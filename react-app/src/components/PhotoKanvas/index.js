import React, { useEffect, useState } from 'react';
import { Stage, Layer, Text, Image } from 'react-konva';
import useImage from 'use-image';
import styles from './PhotoKanvas.module.css';

function PhotoKanvas({ photoSrc }) {
    const [ photo ] = useImage(photoSrc);
    const [ input, setInput ] = useState();
    const [ count, setCount ] = useState(1);
    const [ objects, setObjects ] = useState([]);

    const typeMap = {
        'Text': Text
    }

    // useEffet to have access to div after it renders.
    useEffect(() => {
        if (photo) {
            photo.width = 600;
            photo.height = 400;
        }
    }, [photo]);

    const handleKanvasClick = e => {
        const newText = {type: 'Text', text: `clicks: ${count}`, x: 10, y: 10 + count * 10 }
        setCount(count + 1);
        setObjects([...objects, newText]);
    }

    return (
        <div id='kanvas'>
            <div className={styles.kanvas__options}>
                <button onClick={() => handleKanvasClick()}>
                    Text
                </button>
            </div>
            <Stage width={600} height={400}>
                <Layer>
                    <Image image={photo} />
                </Layer>
                <Layer id='input-layer' onClick={e => handleKanvasClick(e)}>
                    {objects && objects.map(object => {
                        const Comp = typeMap[object.type]
                        return <Comp {...object} key={object.id} />
                    })}
                </Layer>
            </Stage>
        </div>
    );
}

export default PhotoKanvas;
