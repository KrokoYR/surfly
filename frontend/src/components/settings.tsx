import React from 'react';

import { useToolStore } from '../store/tool';

export const SettingBar = () => {
    const toolStore = useToolStore();

    const handleLineWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
        toolStore.setLineWidth(+e.target.value);
    };

    const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        toolStore.setStrokeColor(e.target.value);
    };

    return (
        <div className="setting-bar">
            <label htmlFor="line-width">Толщина линии</label>
            <input
                onChange={handleLineWidth}
                style={{margin: '0 10px'}}
                id="line-width"
                type="number" defaultValue={1} min={1} max={50}
            />

            <label htmlFor="stroke-color">Цвет обводки</label>
            <input onChange={handleColor} id="stroke-color" type="color"/>
        </div>
    );
};
