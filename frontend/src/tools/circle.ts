import { Tool } from "./tool";


export class Circle extends Tool {
    private startX = 0

    private startY = 0

    private saved = ''

    constructor(canvas: HTMLCanvasElement, eventHandler: WebSocket, id: string) {
        super(canvas, eventHandler, id, 'circle');
        this.listen()
    }

    listen() {
        this.canvas.onmousedown = this.#mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.#mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.#mouseMoveHandler.bind(this)
    }

    #mouseDownHandler(e: MouseEvent) {
        this.mouseDown = true
        const canvasData = this.canvas.toDataURL()
        this.ctx.beginPath()
        this.startX = e.pageX - (e.target as HTMLCanvasElement).offsetLeft
        this.startY = e.pageY-(e.target as HTMLCanvasElement).offsetTop
        this.saved = canvasData
    }

    #mouseUpHandler() {
        this.mouseDown = false
    }

    #mouseMoveHandler(e: MouseEvent) {
        if(this.mouseDown) {
            const curentX =  e.pageX - (e.target as HTMLCanvasElement).offsetLeft
            const curentY =  e.pageY - (e.target as HTMLCanvasElement).offsetTop
            const width = curentX-this.startX
            const height = curentY-this.startY
            const r = Math.sqrt(width**2 + height**2)
            this.#draw(this.startX, this.startY, r)
        }
    }

    #draw(x: number, y: number, r: number) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x, y, r, 0, 2*Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
        console.log('staticDraw')
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.arc(x, y, r, 0, 2*Math.PI)
        ctx.fill()
        ctx.stroke()
    }
}
