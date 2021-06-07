import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Text, Line, Rect, Image } from 'react-konva';
import useImage from 'use-image';
import FontSelector from '../FontSelector';
import styles from './BackEditor.module.css';
import postcardStamp from '../../../images/postcard-stamp.png';

const WIDTH = 600;
const HEIGHT = 400;

const typeMap = {
    'Text': Text,
    'Line': Line,
    'Rect': Rect
}

function BackEditor({finishBack}) {
    const [stamp, stampStatus] = useImage(postcardStamp);
    const stampRef = useRef(null);
    const [ loading, setLoading ] = useState(true);
    const [ maxLen, setMaxLen ] = useState(1000);
    const [ backObjs, setBackObjs ] = useState([]);
    const [ messageObj, setMessageObj ] = useState();
    const [ message, setMessage ] = useState('Text');
    const [ address1, setAddress1] = useState('');
    const [ address1Obj, setAddress1Ojb] = useState();
    const [ address2, setAddress2] = useState('');
    const [ address2Obj, setAddress2Ojb] = useState();
    const [ address3, setAddress3] = useState('');
    const [ address3Obj, setAddress3Ojb] = useState();
    const [ address4, setAddress4] = useState('');
    const [ address4Obj, setAddress4Ojb] = useState();
    const [ msgDiv, setMsgDiv] = useState();
    const [ lineDiv, setLineDiv ] = useState();
    const backRef = useRef(null);

    // useEffet to have access to div after it renders.
    useEffect(() => {
        if (stampStatus === 'loaded') {
            stamp.width = 100;
            stamp.height = 110;
            setLoading(false);
        }
    }, [stampStatus]);

    const messageChange = e => {
        const newMsg = e.target.value;

        // Check for message overflow
        msgDiv.innerText = newMsg + 'W';
        if (msgDiv.offsetHeight >= 350) {
            setMaxLen(newMsg.len);
        } else {
            setMessage(newMsg);
            messageObj.text = newMsg;
        }
    }

    const lineChange = (e, setLine, lineObj) => {
        const newLine = e.target.value;
        // Check for message overflow
        lineDiv.innerText = newLine + 'W';
        if (lineDiv.offsetWidth < 275) {
            setLine(newLine);
            lineObj.text = newLine;
        }
    }

    useEffect(() => {
        // Grab text input field
        // const textInput = document.getElementById('textInput')
        // setTextInput(textInput);
        // textInput.disabled = true;
        const msgDiv = document.getElementById('hidden-message')
        setMsgDiv(msgDiv);
        const lineDiv = document.getElementById('hidden-line');
        setLineDiv(lineDiv);
        msgDiv.style.fontSize = '16';
        msgDiv.style.fontFamily  = 'cursive';

        // Draw postcard back
        const backArr = [];
        const background = { type: 'Rect', fill: '#ffffff', x: 0, y: 0, width: WIDTH, height: HEIGHT}
        const midLine = { type: 'Line', stroke: '#d6d6d6', points: [ WIDTH / 2, 20, WIDTH / 2, HEIGHT - 20, WIDTH / 2, 20] }
        let xStart = WIDTH / 2 + 20;
        let xEnd = WIDTH - 20;
        let y = HEIGHT - 180;
        const topAddress = { type: 'Line', stroke: '#d6d6d6', points: [ xStart, y, xEnd, y, xStart, y] }
        y += 40;
        const midAddress = { type: 'Line', stroke: '#d6d6d6', points: [ xStart, y, xEnd, y, xStart, y] }
        y += 40;
        const btmAddress = { type: 'Line', stroke: '#d6d6d6', points: [ xStart, y, xEnd, y, xStart, y] }
        y += 40;
        const btmbtmAddress = { type: 'Line', stroke: '#d6d6d6', points: [xStart, y, xEnd, y, xStart, y] }
        backArr.push(background);
        backArr.push(midLine);
        backArr.push(topAddress);
        backArr.push(midAddress);
        backArr.push(btmAddress);
        backArr.push(btmbtmAddress);
        // Stamp
        // xStart = WIDTH - 100;
        // let yStart = 25;
        // const stamp = { type: 'Rect', strokeWidth: 2, stroke: '#d6d6d6', x: xStart, y: yStart, width: 80, height: 100 }
        // backArr.push(stamp);
        // Postcard Message
        xStart = 25;
        let yStart = 25;
        let width = WIDTH / 2 - 40;
        let height = HEIGHT - 50;
        const msg = { type: 'Text', fontFamily: 'cursive', fontSize: 16, x: xStart, y: yStart,
                      width: width, height: height, text: message, lineHeight: 1.5 }
        setMessageObj(msg);
        backArr.push(msg);
        const add1 = { type: 'Text', fontFamily: 'cursive', fontSize: 20, x: 323, y: 195, text: address1, lineHeight: 1.5 }
        const add2 = { type: 'Text', fontFamily: 'cursive', fontSize: 20, x: 323, y: 235, text: address2, lineHeight: 1.5 }
        const add3 = { type: 'Text', fontFamily: 'cursive', fontSize: 20, x: 323, y: 275, text: address3, lineHeight: 1.5 }
        const add4 = { type: 'Text', fontFamily: 'cursive', fontSize: 20, x: 323, y: 315, text: address4, lineHeight: 1.5 }
        setAddress1Ojb(add1);
        setAddress2Ojb(add2);
        setAddress3Ojb(add3);
        setAddress4Ojb(add4);
        backArr.push(add1);
        backArr.push(add2);
        backArr.push(add3);
        backArr.push(add4);
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
        <>
            {loading &&
                <h1>Loading...</h1>
            }
            {!loading &&
                <div className={styles.kanvas__container}>
                    <Stage ref={backRef} width={WIDTH} height={HEIGHT}>
                        <Layer>
                            {backObjs && backObjs.map(object => {
                                    const Comp = typeMap[object.type]
                                    return <Comp {...object} key={object.id} />
                                })
                            }
                        </Layer>
                        <Layer>
                            <Image x={480} y={20} ref={stampRef} image={stamp} />
                        </Layer>
                    </Stage>
                    <div className={styles.message__container}>
                        <label>Postcard Message:</label>
                        <textarea
                            maxLength={`${maxLen}`}
                            className={styles.message__textarea}
                            value={message}
                            onChange={messageChange}
                        />
                    </div>
                    <button className={styles.button__submit} onClick={submitCard}>Create Postcard</button>
                    <div id='hidden-message' className={styles.hidden__message}></div>
                    <div id='hidden-line' className={styles.hidden__line}></div>
                    <div className={styles.address__container}>
                        <input
                            placeholder='Line 1 ...'
                            className={styles.address__input} value={address1} onChange={(e) => lineChange(e, setAddress1, address1Obj)} />
                        <input
                            placeholder='Line 2 ...'
                            className={styles.address__input} value={address2} onChange={(e) => lineChange(e, setAddress2, address2Obj)} />
                        <input
                            placeholder='Line 3 ...'
                            className={styles.address__input} value={address3} onChange={(e) => lineChange(e, setAddress3, address3Obj)} />
                        <input
                            placeholder='Line 4 ...'
                            className={styles.address__input} value={address4} onChange={(e) => lineChange(e, setAddress4, address4Obj)} />
                    </div>
                </div>
            }
        </>
    )
}

export default BackEditor;
