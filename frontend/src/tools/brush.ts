import { Tool } from "./tool";

export class Brush extends Tool {
    constructor(canvas: HTMLCanvasElement, eventHandler: WebSocket, id: string) {
        super(canvas, eventHandler, id, 'brush');
        this.toolName = 'brush'
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.#mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.#mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.#mouseUpHandler.bind(this)
    }

    #mouseUpHandler() {
        this.mouseDown = false
        this.eventHandler.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'finish',
            }
        }))
    }
    #mouseDownHandler(e: MouseEvent) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.ctx.moveTo(e.pageX - (e.target as HTMLCanvasElement).offsetLeft, e.pageY - (e.target as HTMLCanvasElement).offsetTop)
    }
    #mouseMoveHandler(e: MouseEvent) {
        if (this.mouseDown) {
            this.eventHandler.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x: e.pageX - (e.target as HTMLCanvasElement).offsetLeft,
                    y: e.pageY - (e.target as HTMLCanvasElement).offsetTop
                }
            }))
        }
    }

    static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}
