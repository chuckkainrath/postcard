import React, { useEffect, useState } from 'react';
import { Stage, Layer, Text, Image, Line, Rect } from 'react-konva';
import useImage from 'use-image';
import styles from './PhotoKanvas.module.css';
import FontSelector from './FontSelector';

const WIDTH = 600;
const HEIGHT = 400;

function PhotoKanvas({ photoSrc }) {
    const [ stage, setStage ] = useState('card');
    const [ photo ] = useImage(photoSrc);
    const [ textValue, setTextValue ] = useState('');
    const [ textInput, setTextInput ] = useState();
    const [ objects, setObjects ] = useState([]);
    const [ fontSize, setFontSize ] = useState(24);
    const [ currObject, setCurrObject ] = useState();
    const [ color, setColor ] = useState('#000000')
    const [ fontFamily, setFontFamily ] = useState('Arial');
    const [ fontStyle, setFontStyle ] = useState('normal');
    const [ underline, setUnderline ] = useState('');
    const [ backObjs, setBackObjs ] = useState([]);

    const typeMap = {
        'Text': Text,
        'Line': Line,
        'Rect': Rect
    }

    useEffect(() => {
        // Grab text input field
        const textInput = document.getElementById('textInput')
        setTextInput(textInput);
        textInput.disabled = true;

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
        let yStart = 20;
        const stamp = { type: 'Rect', strokeWidth: 2, stroke: '#d6d6d6', x: xStart, y: yStart, width: 80, height: 100 }
        backArr.push(stamp);
        setBackObjs(backArr);
    }, [])

    // useEffet to have access to div after it renders.
    useEffect(() => {
        if (photo) {
            photo.width = WIDTH;
            photo.height = HEIGHT;
        }
    }, [photo]);

    const textChange = (e) => {
        const newTextValue = e.target.value;
        currObject.text = newTextValue;
        setTextValue(newTextValue);
    }

    const newTextInput = () => {
        const newText = {type: 'Text', fontFamily: fontFamily, fontSize: fontSize, fill: color, text: 'Text', x: 10, y: 10 }
        newText.onClick = () => {
            setTextValue(newText.text);
            setCurrObject(newText);
            textInput.disabled = false;
            textInput.focus();
        }
        newText.onDragStart = () => {
            setCurrObject(newText);
            textInput.disabled = false;
        }
        newText.onDragEnd = () => {
            textInput.focus();
        }
        setObjects([...objects, newText]);
        setCurrObject(newText);
        setTextValue(newText.text);
        textInput.disabled = false;
        textInput.focus();
        console.log('Back objs', backObjs);
    }

    const changeFontFamily = e => {
        if (currObject) {
            currObject.fontFamily = e.target.value;
        }
        setFontFamily(e.target.value);
    }

    const changeFontSize = e => {
        setFontSize(parseInt(e.target.value));
        if (currObject) {
            currObject.fontSize = parseInt(e.target.value)
        }
    }

    const changeBold = () => {
        let newBold;
        if (fontStyle === '' || fontStyle === 'italic') {
            newBold = 'bold';
        } else {
            newBold = '';
        }
        currObject.fontStyle = newBold;
        setFontStyle(newBold);
    }

    const changeUnderline = () => {
        const newUnderline = underline ? '' : 'underline';
        currObject.textDecoration = newUnderline;
        setUnderline(newUnderline);
    }

    const changeItalic = () => {
        let newItalic;
        if (fontStyle === '' || fontStyle === 'bold') {
            newItalic = 'italic';
        } else {
            newItalic = '';
        }
        currObject.fontStyle = newItalic;
        setFontStyle(newItalic);
    }

    const changeColor = e => {
        setColor(e.target.value);
        if (currObject) {
            currObject.fill = e.target.value;
        }
    }

    const deleteCurrObj = () => {
        const objCopies = objects.filter(obj => {
            return obj !== currObject;
        })
        setObjects(objCopies);
        setTextValue('');
        textInput.disabled = true;
        setCurrObject(null);
    }

    // Disable text input and current object
    const imageClick = () => {
        setCurrObject();
        setTextValue('');
        textInput.disabled = true;
    }

    return (
        <div>
            {stage === 'card' &&
                <div id='kanvas'>
                    <div className={styles.kanvas__options}>
                        <button disabled={!currObject} onClick={() => deleteCurrObj()}>Delete</button>
                        <button onClick={() => newTextInput()}>
                            Text
                        </button>
                        <input id='textInput' className={styles.kanvas__text_input} value={textValue} onChange={(e) => textChange(e)} />
                        <label>Font Size</label>
                        <input type='number' value={fontSize} onChange={(e) => changeFontSize(e)} />
                        <label>Color</label>
                        <input type="color" value={color} onChange={(e) => changeColor(e)} />
                        <FontSelector fontFamily={fontFamily} changeFontFamily={changeFontFamily} />
                        <button disabled={!currObject} onClick={() => changeBold()}>B</button>
                        <button disabled={!currObject} onClick={() => changeItalic()}>I</button>
                        <button disabled={!currObject} onClick={() => changeUnderline()}>U</button>
                    </div>
                    <Stage width={WIDTH} height={HEIGHT}>
                        <Layer onClick={() => imageClick()}>
                            <Image image={photo} />
                        </Layer>
                        <Layer>
                            {objects && objects.map(object => {
                                const Comp = typeMap[object.type]
                                return <Comp draggable {...object} key={object.id} />
                            })}
                        </Layer>
                    </Stage>
                    <button onClick={() => setStage('back')}>
                        Continue
                    </button>
                </div>
            }
            {stage === 'back' &&
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
            }
        </div>
    );
}

export default PhotoKanvas;
