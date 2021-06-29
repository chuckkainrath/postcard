import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Label, Text, Tag, Image, Line, Rect } from 'react-konva';
import useImage from 'use-image';
import styles from './PhotoEditor.module.css';
import FontSelector from '../FontSelector';
import FilterSelector from '../FilterSelector';

const WIDTH = 600;
const HEIGHT = 400;
const randomNum = Math.floor(Math.random() * 1000000);

const typeMap = {
    'Text': Text,
    'Line': Line,
    'Rect': Rect
}

function PhotoEditor({ photoSrc, finishFront }) {
    const [photo, photoStatus] = useImage(`${photoSrc}?${randomNum}`, 'Anonymous');
    const photoRef = useRef(null);
    const [ loading, setLoading ] = useState(true);
    const [ textValue, setTextValue ] = useState('');
    const [ textInput, setTextInput ] = useState();
    const [ objects, setObjects ] = useState({});
    const [ objectKey, setObjectKey ] = useState(0);
    const [ fontSize, setFontSize ] = useState(24);
    const [ currObject, setCurrObject ] = useState();
    const [ color, setColor ] = useState('#000000')
    const [ fontFamily, setFontFamily ] = useState('Arial');
    const [ fontStyle, setFontStyle ] = useState('');
    const [ underline, setUnderline ] = useState('');
    const [ filter, setFilter ] = useState([]);
    const frontRef = useRef(null);

    useEffect(() => {
        // Grab text input field
        if (!loading) {
            const textInput = document.getElementById('textInput')
            setTextInput(textInput);
            textInput.disabled = true;
        }
    }, [loading])

    // useEffet to have access to div after it renders.
    useEffect(() => {
        if (photoStatus === 'loaded') {
            photo.crossOrigin = 'Anonymous';
            photo.width = WIDTH;
            photo.height = HEIGHT;
            setLoading(false);
        }
    }, [photoStatus]);

    useEffect(() => {
        if (photoRef.current) {
            photoRef.current.attrs.filters = filter;
            photoRef.current.cache();
            photoRef.current.getLayer().batchDraw();
        }
    }, [filter]);

    const textChange = (e) => {
        const newTextValue = e.target.value;
        currObject.text = newTextValue;
        setTextValue(newTextValue);
    }

    const dragStart = (e) => {
        let numChildren = e.target.children.length
        let obj = objects[e.target.children[numChildren - 1].attrs.tId];
        setCurrObject(obj);
        setTextValue(obj.text);
        textInput.disabled = false;
    }

    const dragEnd = (e) => {
        textInput.focus();
    }

    const newTextInput = () => {
        const newText = {tId: objectKey, type: 'Text', fontFamily: fontFamily, fontSize: fontSize, fill: color, text: 'Text', x: 10, y: 10 }
        newText.onClick = () => {
            setTextValue(newText.text);
            setCurrObject(newText);
            textInput.disabled = false;
            textInput.focus();
        }

        let newObjs = Object.assign({}, objects);
        newObjs[objectKey] = newText;
        setObjectKey(objectKey + 1);
        setObjects(newObjs);
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
        const objCopies = Object.assign({}, objects);
        objCopies[currObject.tId].x = -1000;
        objCopies[currObject.tId].y = 1000;
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
        <div className={styles.kanvas__container}>
            {loading &&
            <h1>Loading...</h1>
            }
            {!loading &&
            <div id='kanvas'>
                <div className={styles.kanvas__options}>
                    <div className={styles.text__edit}>
                        <button onClick={() => newTextInput()}>
                            + Text
                        </button>
                        <input id='textInput' className={styles.kanvas__text_input} value={textValue} onChange={(e) => textChange(e)} />
                        <button disabled={!currObject} onClick={deleteCurrObj}>Delete</button>
                    </div>
                    <div className={styles.text__options}>
                        <div>
                            <label>Font Size: </label>
                            <input type='number' value={fontSize} onChange={(e) => changeFontSize(e)} />
                        </div>
                        <div>
                            <label>Color: </label>
                            <input type="color" value={color} onChange={(e) => changeColor(e)} />
                        </div>
                        <FontSelector fontFamily={fontFamily} changeFontFamily={changeFontFamily} />
                        <div>
                            <button disabled={!currObject} onClick={() => changeBold()}>B</button>
                            <button disabled={!currObject} onClick={() => changeItalic()}>I</button>
                            <button disabled={!currObject} onClick={() => changeUnderline()}>U</button>
                        </div>
                    </div>
                    <div className={styles.filter}>
                        <label>Photo Filter: </label>
                        <FilterSelector filter={filter} setFilter={setFilter} />
                    </div>
                </div>
                <Stage ref={frontRef} width={WIDTH} height={HEIGHT}>
                    <Layer onClick={() => imageClick()}>
                        <Image ref={photoRef} filters={filter} image={photo} />
                    </Layer>
                    <Layer>
                        {objects && Object.values(objects).map(object => {
                            const Comp = typeMap[object.type]
                            return (
                                <Label draggable onDragStart={dragStart} onDragEnd={dragEnd}>
                                    {object === currObject && <Tag dash={[5, 5]} fill='rgba(255,255,255,0.5)' stroke='black' strokeWidth='2'/> }
                                    <Comp {...object} key={object.id} padding='3' />
                                </Label>
                            )
                        })}
                    </Layer>
                </Stage>
                <button className={styles.continue} onClick={doneEditing}>
                    Continue
                </button>
            </div>
            }
        </div>
    );
}

export default PhotoEditor;
