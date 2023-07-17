import { create } from 'zustand'

import { Tool } from "../tools/tool";

type ToolState = {
    tool: Tool | null;

    setTool: (tool: Tool) => void
    setLineWidth: (lineWidth: number) => void;
    setFillColor: (fillColour: string) => void;
    setStrokeColor: (strokeColour: string) => void;
}

export const useToolStore = create<ToolState>((set) => ({
    tool: null,

    setTool: (tool: Tool) => set(() => ({ tool })),
    setLineWidth: (lineWidth: number) => set((state) => {
        if (!state.tool) return state
        state.tool.lineWidth = lineWidth
        return { tool: state.tool }
    }),
    setFillColor: (fillColor: string) => set((state) => {
        if (!state.tool) return state
        state.tool.fillColor = fillColor
        return { tool: state.tool }
    }),
    setStrokeColor: (strokeColor: string) => set((state) => {
        if (!state.tool) return state
        state.tool.strokeColor = strokeColor
        return { tool: state.tool }
    })
}))
