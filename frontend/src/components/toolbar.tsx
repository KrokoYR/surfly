import { useState } from 'react';

import { useCanvasStore } from '../store/canvas';
import { useToolStore } from '../store/tool';

import { Brush } from '../tools/brush';
import { Circle } from '../tools/circle';
import { Rect } from '../tools/rect';

import { invariant } from '../helpers/invariant';

import '../styles/toolbar.scss'

export const Toolbar = () => {
    const [toolName, setToolName] = useState<string>('brush')

    const toolStore = useToolStore();
    const canvasStore = useCanvasStore();

    if (!canvasStore.canvas) {
        return null;
    }

    const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        toolStore.setStrokeColor(e.target.value)
        toolStore.setFillColor(e.target.value)
    }

    const download = () => {
        invariant(canvasStore.canvas, 'Canvas is not initialized')
        const dataUrl = canvasStore.canvas.toDataURL()
        const a = document.createElement('a')
        a.href = dataUrl

        invariant(canvasStore.sessionId, 'Session id is not initialized');
        a.download = canvasStore.sessionId + ".jpg"

        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const handleToolSelection = (tool: Brush | Rect | Circle) => {
        return () => {
            toolStore.setTool(tool)
            setToolName(tool.name)
        }
    }

    return (
        <div className="toolbar">
            <button
                className={`toolbar__btn brush ${toolName === 'brush' ? 'active' : ''}`}
                onClick={() => handleToolSelection(new Brush(canvasStore.canvas!, canvasStore.websocket!, canvasStore.sessionId!))}
            />
            <button
                className={`toolbar__btn rect ${toolName === 'rect' ? 'active' : ''}`}
                onClick={() => handleToolSelection(new Rect(canvasStore.canvas!, canvasStore.websocket!, canvasStore.sessionId!))}
            />
            <button
                className={`toolbar__btn circle ${toolName === 'circle' ? 'active' : ''}`}
                onClick={() => handleToolSelection(new Circle(canvasStore.canvas!, canvasStore.websocket!, canvasStore.sessionId!))}
            />

            <input onChange={e => changeColor(e)} style={{marginLeft:10}} type="color"/>
            <button className="toolbar__btn undo" onClick={() => canvasStore.undo()}/>
            <button className="toolbar__btn redo" onClick={() => canvasStore.redo()}/>
            <button className="toolbar__btn save" onClick={() => download()}/>
        </div>
    );
};
