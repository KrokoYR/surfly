import { Tool } from "./tool";

export class Rect extends Tool {
    private startX = 0

    private startY = 0

    private width = 0

    private height = 0

    private saved = ''

    constructor(canvas: HTMLCanvasElement, eventHandler: WebSocket, id: string) {
        super(canvas, eventHandler, id, 'rect');
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
                type: 'rect',
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                color: this.ctx.fillStyle
            }
        }))
    }

    #mouseDownHandler(e: MouseEvent) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - (e.target as HTMLCanvasElement).offsetLeft;
        this.startY = e.pageY - (e.target as HTMLCanvasElement).offsetTop;
        this.saved = this.canvas.toDataURL()
    }

    #mouseMoveHandler(e: MouseEvent) {
        if (this.mouseDown) {
            const currentX = e.pageX - (e.target as HTMLCanvasElement).offsetLeft;
            const currentY = e.pageY - (e.target as HTMLCanvasElement).offsetTop;
            this.width = currentX - this.startX;
            this.height = currentY - this.startY;
            this.#draw(this.startX, this.startY, this.width, this.height)
        }
    }
    

    #draw(x: number, y: number, w: number, h: number) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.rect(x, y, w, h)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.rect(x, y, w, h)
        ctx.fill()
        ctx.stroke()
    }
}
