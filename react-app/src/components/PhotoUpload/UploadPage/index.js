import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';

const WIDTH = 600;
const HEIGHT = 400;

function UploadPage() {
    const dispatch = useDispatch();
    const [imageUrl, setImageUrl] = useState();
    const [scale, setScale] = useState(1.2);
    const [editor, setEditor] = useState();
    const [privatePhoto, setPrivatePhoto] = useState(false)
    const [picture, setPicture] = useState();
    const onDrop = useCallback(acceptedFile => {
        const imageFile = acceptedFile[0];
        const imageUrl = URL.createObjectURL(imageFile)
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            setImageUrl(URL.createObjectURL(imageFile));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop});

    const saveImage = () => {
        if (editor) {
            // Get image and convert to format for upload
            const blob = editor.getImage().toBlob(blob => {
                setPicture(blob);
            });
        }
    }

    const uploadPhoto = () => {
        // dispatch photo
    }

    return (
        <div>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                { isDragActive ?
                    <p>Drop the file here...</p> :
                    <p>Drag 'n' drop a file here, or click to select files</p>
                }
            </div>
            {imageUrl &&
                <div>
                    <AvatarEditor
                        image={imageUrl}
                        width={WIDTH}
                        height={HEIGHT}
                        border={[10,10]}
                        borderRadius={0}
                        color={[255,255,255,0.6]}
                        scale={scale}
                        rotate={0}
                        ref={(e) => setEditor(e)}
                    />
                    <div>
                        <label>Scale</label>
                        <input
                            type='range'
                            step='0.1'
                            min='1'
                            max='3'
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                        />
                    </div>
                    <div>
                        <label>Make Photo Private</label>
                        <input
                            type='checkbox'
                            checked={privatePhoto}
                            onClick={() => setPrivatePhoto(!privatePhoto)}
                        />
                    </div>
                    <button onClick={uploadPhoto}>Upload Photo</button>
                </div>
            }
        </div>
    )
}

export default UploadPage;
