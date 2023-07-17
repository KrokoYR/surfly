import { create } from 'zustand'
import { invariant } from '../helpers/invariant'

export const INITIAL_RECONNECT_INTERVAL = 5000

type CanvasStore = {
    websocket: WebSocket | null
    setWebsocket: (websocket: WebSocket) => void

    websocketReconnectInterval: number
    setWebsocketReconnectInterval: (websocketReconnectInterval: number) => void
    isFirstReconnect: boolean
    setIsFirstReconnect: (isFirstReconnect: boolean) => void

    canvas: HTMLCanvasElement | null
    setCanvas: (canvas: HTMLCanvasElement) => void

    sessionId: string | null
    setSessionId: (sessionId: string) => void,

    username: string | null
    setUsername: (username: string) => void

    undoList: string[]
    addToUndoList: (item: string) => void
    undo: () => void

    redoList: string[]
    addToRedoList: (item: string) => void
    redo: () => void
}

export const useCanvasStore = create<CanvasStore>((set) => ({
    websocket: null,
    setWebsocket: (websocket: WebSocket) => set(() => ({ websocket })),

    websocketReconnectInterval: INITIAL_RECONNECT_INTERVAL,
    setWebsocketReconnectInterval: (websocketReconnectInterval: number) => set(() => ({ websocketReconnectInterval })),
    isFirstReconnect: true,
    setIsFirstReconnect: (isFirstReconnect: boolean) => set(() => ({ isFirstReconnect })),

    canvas: null,
    setCanvas: (canvas: HTMLCanvasElement) => set(() => ({ canvas })),

    sessionId: null,
    setSessionId: (sessionId: string) => set(() => ({ sessionId })),

    username: null,
    setUsername: (username: string) => set(() => ({ username })),

    undoList: [],
    addToUndoList: (item: string) => set((state) => ({ undoList: [...state.undoList, item] })),
    undo: () => set((state) => {
        if (!state.undoList) return state
        if (!state.canvas) return state
        
        const ctx = state.canvas.getContext('2d')
        const dataUrl = state.undoList.pop()
        if (ctx && dataUrl) {
            state.redoList.push(state.canvas.toDataURL())
            const img = new Image()
            img.src = dataUrl
            img.onload =  () => {
                invariant(state.canvas, 'Canvas is null')
                ctx.clearRect(0,0, state.canvas.width, state.canvas.height)
                ctx.drawImage(img, 0, 0, state.canvas.width, state.canvas.height)
            }
        } else {
            ctx?.clearRect(0, 0, state.canvas?.width, state.canvas?.height)
        }

        return { undoList: state.undoList, redoList: state.redoList }
    }),

    redoList: [],
    addToRedoList: (item: string) => set((state) => ({ redoList: [...state.redoList, item] })),
    redo: () => set((state) => {
        if (!state.redoList) return state
        if (!state.canvas) return state

        const ctx = state.canvas.getContext('2d')
        const dataUrl = state.redoList.pop()
        if (ctx && dataUrl) {
            state.undoList.push(state.canvas.toDataURL())
            const img = new Image()
            img.src = dataUrl
            img.onload =  () => {
                invariant(state.canvas, 'Canvas is null')
                ctx.clearRect(0,0, state.canvas.width, state.canvas.height)
                ctx.drawImage(img, 0, 0, state.canvas.width, state.canvas.height)
            }
        } else {
            ctx?.clearRect(0, 0, state.canvas?.width, state.canvas?.height)
        }

        return { redoList: state.redoList, undoList: state.undoList }
    })
}))