import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import styles from './AvatarInput.module.css';

function AvatarInput({setPicture, setChoosingPicture}) {
    const [imageUrl, setImageUrl] = useState();
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();
    const [scale, setScale] = useState(1.2);
    const [editor, setEditor] = useState();
    const onDrop = useCallback(acceptedFile => {
        const imageFile = acceptedFile[0];
        const imageUrl = URL.createObjectURL(imageFile)
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            const width = Math.min(400, img.width);
            setWidth(width)
            setHeight(width)
            setImageUrl(URL.createObjectURL(imageFile));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop});

    const saveImage = () => {
        if (editor) {
            // Get image and convert to format for upload
            const blob = editor.getImageScaledToCanvas().toBlob(blob => {
                setPicture(blob);
                setChoosingPicture(false);
                setImageUrl();
            });
        }
    }

    const cancelImage = () => {
        setChoosingPicture(false);
    }

    return (
        <div>
            <button className={styles.cancel__picture} onClick={cancelImage}>Cancel</button>
            {!imageUrl &&
                <div className={styles.picture__input} {...getRootProps()}>
                    <input {...getInputProps()} />
                    { isDragActive ?
                        <p>Drop the file here...</p> :
                        <p>Drag 'n' drop a file here, or click to select files</p>
                    }
                </div>
            }
            {imageUrl &&
                <div className={styles.picture__container}>
                    <AvatarEditor
                        image={imageUrl}
                        width={width}
                        height={height}
                        border={[10,10]}
                        borderRadius={width}
                        color={[255,255,255,0.6]}
                        scale={scale}
                        rotate={0}
                        ref={(e) => setEditor(e)}
                    />
                    <div className={styles.scale__slider}>
                        <label>Scale Image:</label>
                        <input
                            type='range'
                            step='0.1'
                            min='1'
                            max='3'
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                        />
                    </div>
                    <button className={styles.submit__btn} onClick={saveImage}>Save Profile Picture</button>
                </div>
            }
        </div>
    )
}

export default AvatarInput;
