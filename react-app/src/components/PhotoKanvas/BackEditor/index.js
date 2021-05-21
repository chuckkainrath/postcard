import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Text, Line, Rect, Transformer } from 'react-konva';
import FontSelector from '../FontSelector';
import styles from './BackEditor.module.css';

const WIDTH = 600;
const HEIGHT = 400;

const typeMap = {
    'Text': Text,
    'Line': Line,
    'Rect': Rect
}

function checkTextOverflow(text, font, fontSize) {

}

function BackEditor({finishBack}) {
    const [ backObjs, setBackObjs ] = useState([]);
    const [ messageObj, setMessageObj ] = useState();
    const [ message, setMessage ] = useState('Text');
    const backRef = useRef(null);
    // const [ atMax, setAtMax ] = useState(false);

    const messageChange = e => {
        const newMsg = e.target.value;
        setMessage(newMsg);
        messageObj.text = newMsg;
        // const wordArr = newMsg.split(' '); // 38 Characters per line with cursive font, font size 16, 14 lines max
        // let lineLen = 0;
        // let lineCount = 0;
        // for (let i = 0; i < wordArr.length; i++) {
        //     if (lineLen === 0) {
        //         lineLen += wordArr[i].length;
        //     } else {
        //         lineLen += wordArr[i].length + 1;
        //     }
        //     if (lineLen > 38) {
        //         lineCount++;
        //         lineLen = wordArr[i].length;
        //     } else if (lineLen === 38) {
        //         lineCount++;
        //         lineLen = 0;
        //     }
        // }
        // if (lineCount >= 14) {
        //     setAtMax(true);
        // } else {
        //     setAtMax(false);
        // }
        // console.log('LineLen', lineLen);
        // console.log('LineCount', lineCount);
    }

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
        let width = WIDTH / 2 - 40;
        let height = HEIGHT - 50;
        const msg = { type: 'Text', fontFamily: 'cursive', fontSize: 16, x: xStart, y: yStart,
                      width: width, height: height, text: message, lineHeight: 1.5 }
        setMessageObj(msg);
        backArr.push(msg);
        setBackObjs(backArr);
    }, []);

    const submitCard = () => {
        // Convert canvas to image
        const imageURL = backRef.current.toDataURL();
        (async url => {
            const res = await fetch(url);
            const imageBlob = await res.blob();
            imageBlob.filename = 'postcard-back';
            finishBack(imageBlob);
        })(imageURL);
    }

    return (
        <div className={styles.kanvas__container}>
            <Stage ref={backRef} width={WIDTH} height={HEIGHT}>
                <Layer>
                    {backObjs && backObjs.map(object => {
                            const Comp = typeMap[object.type]
                            return <Comp {...object} key={object.id} />
                        })
                    }
                </Layer>
            </Stage>
            <div className={styles.message__container}>
                <label>Postcard Message:</label>
                <textarea
                    className={styles.message__textarea}
                    value={message}
                    onChange={messageChange}
                    // disabled={atMax}
                />
            </div>
            <button onClick={submitCard}>Create Postcard</button>
        </div>
    )
}

export default BackEditor;
