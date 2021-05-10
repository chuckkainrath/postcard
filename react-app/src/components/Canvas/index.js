import React, { useRef, useEffect } from 'react';

function PhotoCanvas({imageUrl}) {
    const canvasRef = useRef(null);

    // Draw image onto canvas when it loads
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            context.drawImage(img, 0, 0, 600, 400) // TODO: figure out width and height
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            width='600'
            height='400'
        ></canvas>
    );
}

export default PhotoCanvas;
