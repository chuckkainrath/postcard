import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './PhotoCanvas.module.css';

function PhotoCanvas({imageUrl}) {
    const canvasRef = useRef(null);
    const photos = useSelector(() => )

    // Draw image onto canvas when it loads
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            context.drawImage(img, 0, 0, 600, 400) // TODO: figure out width and height
        }
        img.src = imageUrl;


        const addText = () => {

        }

    }, [])

    return (
        <div className={styles.canvas__container}>
            <div className={styles.canvas__controls}>
                <span onClick={() => addText()}>
                    Add Text
                </span>
            </div>
            <canvas
                ref={canvasRef}
                width='600'
                height='400'
            ></canvas>
        </div>
    );
}

export default PhotoCanvas;
