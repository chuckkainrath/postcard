import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Text, Image, Line, Rect } from 'react-konva';
import useImage from 'use-image';
import styles from './PhotoEditor.module.css';
import FontSelector from '../FontSelector';

const WIDTH = 600;
const HEIGHT = 400;

const typeMap = {
    'Text': Text,
    'Line': Line,
    'Rect': Rect
}

function PhotoEditor({ photoSrc, finishFront }) {
    const [ photo ] = useImage(photoSrc + '?_');
    const [ textValue, setTextValue ] = useState('');
    const [ textInput, setTextInput ] = useState();
    const [ objects, setObjects ] = useState([]);
    const [ fontSize, setFontSize ] = useState(24);
    const [ currObject, setCurrObject ] = useState();
    const [ color, setColor ] = useState('#000000')
    const [ fontFamily, setFontFamily ] = useState('Arial');
    const [ fontStyle, setFontStyle ] = useState('normal');
    const [ underline, setUnderline ] = useState('');
    const frontRef = useRef(null);

    useEffect(() => {
        // Grab text input field
        const textInput = document.getElementById('textInput')
        setTextInput(textInput);
        textInput.disabled = true;
    }, [])

    // useEffet to have access to div after it renders.
    useEffect(() => {
        if (photo) {
            photo.crossOrigin = 'Anonymous';
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

    const doneEditing = () => {
        // Convert canvas to image
        const imageURL = frontRef.current.toDataURL();
        (async url => {
            const res = await fetch(url);
            const imageBlob = await res.blob();
            imageBlob.filename = 'postcard-photo';
            finishFront(imageBlob);
        })(imageURL);
    }

    return (
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
            <Stage ref={frontRef} width={WIDTH} height={HEIGHT}>
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
            <button onClick={doneEditing}>
                Continue
            </button>
        </div>
    );
}

export default PhotoEditor;
