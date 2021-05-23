import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Text, Line, Rect, Transformer } from 'react-konva';
import FontSelector from '../FontSelector';
import styles from './BackEditor.module.css';

const WIDTH = 600;
const HEIGHT = 400;
const ADDRESS1 = '123 Rye Road'
const ADDRESS2 = 'Chicago, IL 60060'

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
    const [ address1, setAddress1] = useState('')
    const [ msgDiv, setMsgDiv] = useState();
    const backRef = useRef(null);
    // const [ atMax, setAtMax ] = useState(false);

    const messageChange = e => {
        const newMsg = e.target.value;

        // Check for message overflow
        msgDiv.innerText = newMsg;
        console.log('Offset Height', msgDiv.offsetHeight);

        setMessage(newMsg);
        messageObj.text = newMsg;
    }

    useEffect(() => {
        // Grab text input field
        // const textInput = document.getElementById('textInput')
        // setTextInput(textInput);
        // textInput.disabled = true;
        const msgDiv = document.getElementById('hidden-message')
        setMsgDiv(msgDiv);
        msgDiv.style.fontSize = '16';
        msgDiv.style.fontFamily  = 'cursive';

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
        console.log('WIDTH', width);
        console.log('HEIGHT', height);
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
            <div id='hidden-message' className={styles.hidden__message}>

            </div>
        </div>
    )
}

export default BackEditor;
