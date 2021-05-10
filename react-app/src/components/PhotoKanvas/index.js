import React, { useEffect, useState } from 'react';
import { Stage, Layer, Text, Image } from 'react-konva';
import useImage from 'use-image';
import styles from './PhotoKanvas.module.css';

function PhotoKanvas({ photoSrc }) {
    const [ photo ] = useImage(photoSrc);
    const [ textValue, setTextValue ] = useState('');
    const [ textInput, setTextInput ] = useState();
    const [ objects, setObjects ] = useState([]);
    const [ fontSize, setFontSize ] = useState(12);
    const [ currObject, setCurrObject ] = useState();

    const typeMap = {
        'Text': Text
    }

    useEffect(() => {
        setTextInput(document.getElementById('textInput'));
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
        const newText = {type: 'Text', fontSize: fontSize, text: 'Text', x: 10, y: 10 }
        newText.onClick = () => {
            console.log('CLICKED', newText.text);
            setTextValue(newText.text);
            setCurrObject(newText);
            textInput.focus();
        }
        newText.onDragStart = () => {
            console.log('Drag started');
            setCurrObject(newText);
        }
        newText.onDragEnd = () => {
            textInput.focus();
            console.log('Drag ended');
        }
        setObjects([...objects, newText]);
        setCurrObject(newText);
        setTextValue(newText.text);
        textInput.focus();
    }

    const changeFontSize = e => {
        setFontSize(parseInt(e.target.value));
        if (currObject) {
            currObject.fontSize = parseInt(e.target.value)
        }
    }

    const deleteCurrObj = () => {
        const objCopies = objects.filter(obj => {
            return obj !== currObject;
        })
        setObjects(objCopies);
        setCurrObject(null);
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
            </div>
            <Stage width={600} height={400}>
                <Layer>
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
