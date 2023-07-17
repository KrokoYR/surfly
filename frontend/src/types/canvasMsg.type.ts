type RectMsg = {
    type: 'rect',
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
}

type CircleMsg = {
    type: 'circle',
    x: number,
    y: number,
    radius: number,
    color: string,
}

type BrushMsg = {
    type: 'brush',
    x: number,
    y: number,
}

type FinishMsg = {
    type: 'finish',
}

export type DrawMsg = {
    method: 'draw',
    username: string,
    figure: RectMsg | CircleMsg | BrushMsg | FinishMsg,
}

export type CanvasMsg = {
    method: 'connection',
    username: string,
} | DrawMsg