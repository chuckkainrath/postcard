import React, { useEffect, useState } from 'react';
import { Stage, Layer, Text, Image, Line, Rect } from 'react-konva';
import FontSelector from '../FontSelector';

const WIDTH = 600;
const HEIGHT = 400;

const typeMap = {
    'Text': Text,
    'Line': Line,
    'Rect': Rect
}

function BackEditor() {
    const [ backObjs, setBackObjs ] = useState([]);

    useEffect(() => {
        // Grab text input field
        // const textInput = document.getElementById('textInput')
        // setTextInput(textInput);
        // textInput.disabled = true;

        // Draw postcard back
        const backArr = [];
        const background = { type: 'Rect', fill: '#ffffff', x: 0, y: 0, width: WIDTH, height: HEIGHT}
        const midLine = { type: 'Line', stroke: '#d6d6d6', points: [ WIDTH / 2, 20, WIDTH / 2, HEIGHT - 20, WIDTH / 2, 20] }
        let xStart = WIDTH / 2 + 20;
        let xEnd = WIDTH - 20;
        let y = HEIGHT - 150;
        const topAddress = { type: 'Line', stroke: '#d6d6d6', points: [ xStart, y, xEnd, y, xStart, y] }
        y += 40;
        const midAddress = { type: 'Line', stroke: '#d6d6d6', points: [ xStart, y, xEnd, y, xStart, y] }
        y += 40;
        const btmAddress = { type: 'Line', stroke: '#d6d6d6', points: [ xStart, y, xEnd, y, xStart, y] }
        backArr.push(background);
        backArr.push(midLine);
        backArr.push(topAddress);
        backArr.push(midAddress);
        backArr.push(btmAddress);
        // Stamp
        xStart = WIDTH - 100;
        let yStart = 25;
        const stamp = { type: 'Rect', strokeWidth: 2, stroke: '#d6d6d6', x: xStart, y: yStart, width: 80, height: 100 }
        backArr.push(stamp);
        // Postcard Message
        xStart = 25;
        yStart = 25;
        let width = WIDTH / 2 - 50;
        let height = HEIGHT - 50;
        const msg = { type: 'Text', x: xStart, y: yStart, width: width, height: height, text: 'Text' }
        backArr.push(msg);
        setBackObjs(backArr);
    }, []);

    return (
        <div>
            <h1>Back</h1>
            <Stage width={WIDTH} height={HEIGHT}>
                <Layer>
                    {backObjs && backObjs.map(object => {
                            const Comp = typeMap[object.type]
                            return <Comp {...object} key={object.id} />
                        })
                    }
                </Layer>
            </Stage>
        </div>
    )
}

export default BackEditor;
