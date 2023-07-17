import { invariant } from "../helpers/invariant"

export class Tool {
    protected readonly canvas: HTMLCanvasElement

    protected readonly ctx: CanvasRenderingContext2D

    protected readonly eventHandler: WebSocket

    protected readonly id: string

    protected mouseDown = false

    protected toolName: string

    get name() {
        return this.toolName
    }

    protected constructor(canvas: HTMLCanvasElement, eventHandler: WebSocket, id: string, toolName: string) {
        this.canvas = canvas

        const ctx = canvas.getContext('2d');
        invariant(ctx, 'Canvas context is null');
        this.ctx = ctx;


        this.eventHandler = eventHandler
        this.id = id
        this.toolName = toolName

        this.destroyEvents()
    }

    set fillColor(color: string | CanvasGradient | CanvasPattern) {
        this.ctx.fillStyle = color
    }

    set strokeColor(color: string | CanvasGradient | CanvasPattern) {
        this.ctx.strokeStyle = color
    }

    set lineWidth(width: number) {
        this.ctx.lineWidth = width
    }

    private destroyEvents() {
        this.canvas.onmousedown = null
        this.canvas.onmousemove = null
        this.canvas.onmouseup = null
    }
}