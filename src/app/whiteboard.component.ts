import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { combineLatest, combineLatestAll, fromEvent, merge } from 'rxjs'

type Coordinates = [x: number, y: number]
type Path = [a: Coordinates, b: Coordinates]

@Component({
    selector: 'app-whiteboard',
    template: `
        <canvas #board id="board"></canvas>
    `,
    styles: [
        `#board {
            width: 100%;
            height: 100%;
        }`
    ]
})
export class WhiteboardComponent implements AfterViewInit {

    @ViewChild('board')
    board!: ElementRef<HTMLCanvasElement>

    canvas!: HTMLCanvasElement

    start?: Coordinates

    ngAfterViewInit(): void {
        this.canvas = this.board.nativeElement
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.setupEvents()
    }

    setupEvents(): void {
        fromEvent(this.canvas, 'mousedown')
            .subscribe({
                next: event => {
                    const mouseEvent = event as MouseEvent
                    this.start = [mouseEvent.offsetX, mouseEvent.offsetY]
                }
            })

        fromEvent(this.canvas, 'mousemove')
            .subscribe({
                next: event => {
                    const mouseEvent = event as MouseEvent
                    this.path([this.start!, [mouseEvent.offsetX, mouseEvent.offsetY]])
                    this.start = [mouseEvent.offsetX, mouseEvent.offsetY]
                }
            })
        
        fromEvent(this.canvas, 'mouseup')
            .subscribe({
                next: event => {
                    const mouseEvent = event as MouseEvent
                    this.path([this.start!, [mouseEvent.offsetX, mouseEvent.offsetY]])
                    delete this.start
                }
            })
    }

    path(path: Path){
        const ctx = this.canvas.getContext("2d")!
        ctx.beginPath()
        ctx.moveTo(path[0][0], path[0][1])
        ctx.lineTo(path[1][0], path[1][1])
        ctx.stroke()
    }
}