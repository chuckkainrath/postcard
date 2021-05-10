import React, { useEffect, useState } from 'react';
import { Stage, Layer, Text, Image } from 'react-konva';
import useImage from 'use-image';
import styles from './PhotoKanvas.module.css';
import FontSelector from './FontSelector';

function PhotoKanvas({ photoSrc }) {
    const [ photo ] = useImage(photoSrc);
    const [ textValue, setTextValue ] = useState('');
    const [ textInput, setTextInput ] = useState();
    const [ objects, setObjects ] = useState([]);
    const [ fontSize, setFontSize ] = useState(24);
    const [ currObject, setCurrObject ] = useState();
    const [ color, setColor ] = useState('#000000')
    const [ fontFamily, setFontFamily ] = useState('Arial');

    const typeMap = {
        'Text': Text
    }

    useEffect(() => {
        const textInput = document.getElementById('textInput')
        setTextInput(textInput);
        textInput.disabled = true;
    }, [])

    // useEffet to have access to div after it renders.
    useEffect(() => {
        if (photo) {
            photo.width = 600;
            photo.height = 400;
        }
    }, [photo]);

    const textChange = (e) => {
        console.log(e.target.value);
        const newTextValue = e.target.value;
        currObject.text = newTextValue;
        setTextValue(newTextValue);
    }

    const newTextInput = () => {
        const newText = {type: 'Text', fontFamily: fontFamily, fontSize: fontSize, fill: color, text: 'Text', x: 10, y: 10 }
        newText.onClick = () => {
            console.log('CLICKED', newText.text);
            setTextValue(newText.text);
            setCurrObject(newText);
            textInput.disabled = false;
            textInput.focus();
        }
        newText.onDragStart = () => {
            console.log('Drag started');
            setCurrObject(newText);
            textInput.disabled = false;
        }
        newText.onDragEnd = () => {
            textInput.focus();
            console.log('Drag ended');
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
            </div>
            <Stage width={600} height={400}>
                <Layer onClick={() => imageClick()}>
                    <Image image={photo} />
                </Layer>
                <Layer id='input-layer'>
                    {objects && objects.map(object => {
                        const Comp = typeMap[object.type]
                        return <Comp draggable {...object} key={object.id} />
                    })}
                </Layer>
            </Stage>
        </div>
    );
}

export default PhotoKanvas;
