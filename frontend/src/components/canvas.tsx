import { useEffect, useRef, useState } from 'react';

import { useCanvasStore, INITIAL_RECONNECT_INTERVAL } from "../store/canvas";
import { useToolStore } from "../store/tool";

import  { Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom"

import axios, { AxiosResponse } from 'axios'
import { invariant } from '../helpers/invariant';
import { Brush } from '../tools/brush';
import { Rect } from '../tools/rect';
import { CanvasMsg, DrawMsg } from '../types/canvasMsg.type';
import { Circle } from '../tools/circle';

export const Canvas = () => {
    const [modal, setModal] = useState(true)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const usernameRef = useRef<HTMLInputElement | null>(null)
    const params = useParams()

    const canvasStore = useCanvasStore()
    const toolState = useToolStore()

    useEffect(() => {
        if (canvasRef.current) {
            canvasStore.setCanvas(canvasRef.current)
            const ctx = canvasRef.current.getContext('2d')

            const getImg = async () => {
                const response: AxiosResponse<string> = await axios.get<string, AxiosResponse<string>>(`http://localhost:8000/drawing/image?id=${params.id!}`);
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    invariant(canvasRef.current, 'Canvas is not initialized')
                    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx?.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                }
            }

            try { 
                void getImg()
            } catch (e) {
                console.error(e)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const createSocket = () => {
            if (canvasStore.username && canvasRef.current) {
                const socket = new WebSocket(
                    'ws://'
                    + 'localhost:8000'
                    + '/ws/drawing/'
                    + params.id!
                    + '/'
                )
                const sessionId = params.id!
    
                canvasStore.setWebsocket(socket)
                canvasStore.setSessionId(sessionId)
    
                toolState.setTool(new Brush(canvasRef.current, socket, sessionId))
    
                socket.onopen = () => {
                    console.log('Подключение установлено')
    
                    canvasStore.setIsFirstReconnect(true)
                    canvasStore.setWebsocketReconnectInterval(INITIAL_RECONNECT_INTERVAL)
                    socket.send(JSON.stringify({
                        id: params.id,
                        username: canvasStore.username,
                        method: "connection"
                    }))
                }

                socket.onmessage = (event: MessageEvent<string>) => {
                    const msg: CanvasMsg = JSON.parse(event.data)['message']
                    switch (msg.method) {
                        case "connection":
                            console.log(`User ${msg.username} has joined the session`)
                            break
                        case "draw":
                            drawHandler(msg)
                            break
                    }
                }
    
                socket.onclose = () => {
                    console.log('Подключение закрыто')

                    const reconnectInterval = canvasStore.isFirstReconnect ? 0 : canvasStore.websocketReconnectInterval
    
                    setTimeout(() => {
                        console.log('Попытка переподключения')
                        if (canvasStore.isFirstReconnect) {
                            canvasStore.setIsFirstReconnect(false)
                        } else {
                            canvasStore.setWebsocketReconnectInterval(canvasStore.websocketReconnectInterval * 2)
                        }

                        createSocket()
                    }, reconnectInterval)
                }
            }
        }

        createSocket()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasStore.username])

    const drawHandler = (msg: DrawMsg) => {
        if (!('figure' in msg)) return
        const figure = msg.figure

        invariant(canvasRef.current, 'Canvas is not initialized')
        const ctx = canvasRef.current.getContext('2d')

        invariant(ctx, 'Context is not initialized')
        switch (figure.type) {
            case "brush":
                Brush.staticDraw(ctx, figure.x, figure.y)
                break
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
                break
            case "circle":
                Circle.staticDraw(ctx, figure.x, figure.y, figure.radius, figure.color)
                break;
            case "finish":
                ctx.beginPath()
                break
        }
    }


    const mouseDownHandler = () => {
        invariant(canvasRef.current, 'Canvas is not initialized')
        canvasStore.addToUndoList(canvasRef.current.toDataURL())
    
        // convert dataURL to blob
        const dataURL = canvasRef.current.toDataURL();
        const blobBin = atob(dataURL.split(',')[1]);
        const array = [];
        for(let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        const file=new Blob([new Uint8Array(array)], {type: 'image/png'});
    
        // create form data
        const formData = new FormData();
        formData.append('img', file);
    
        // send POST request with form data
        // void axios.post(`http://localhost:8000/drawing/image?id=${params.id!}`, formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     }).then(response => console.log(response.data))
    }

    const connectHandler = () => {
        invariant(usernameRef.current, 'Username input is not initialized')
        canvasStore.setUsername(usernameRef.current.value)
        setModal(false)
    }

    return (
        <div className="canvas">
            <Modal show={modal} onHide={() => { return }}>
                <Modal.Header >
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas style={{ border: '1px red solid' }} onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400}/>
        </div>
    );
}
