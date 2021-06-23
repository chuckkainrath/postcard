import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Modal, Button } from 'react-bootstrap';
import AvatarEditor from 'react-avatar-editor';
import { postPhoto } from '../../../store/photos';
import styles from './UploadPage.module.css';

const WIDTH = 600;
const HEIGHT = 400;

function UploadPage({uploadImage, showUploadImage}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [imageUrl, setImageUrl] = useState();
    const [scale, setScale] = useState(1.2);
    const [editor, setEditor] = useState();
    const [privatePhoto, setPrivatePhoto] = useState(false)
    const [imageUploaded, setImageUploaded] = useState(false)
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

    const uploadPhoto = () => {
        if (editor) {
            setImageUploaded(true);
            // Get image and convert to format for upload
            editor.getImage().toBlob(async blob => {
                await dispatch(postPhoto(blob, privatePhoto));
                history.push('/photos');
            });
        }
    }

    const chooseDiff = () => {
        setImageUrl('');
    }

    return (
        <Modal
            show={uploadImage}
            onHide={() => showUploadImage(false)}
            centered
        >
            <div>
                {!imageUrl &&
                    <div className={styles.image__select} {...getRootProps()}>
                        <input {...getInputProps()} />
                        { isDragActive ?
                            <p className={styles.upload__msg}>Drop the file here...</p> :
                            <p className={styles.upload__msg}>Drag 'n' drop a file here, <br /> or click to select files</p>
                        }
                    </div>
                }
                {imageUrl &&
                    <div className={styles.image__crop}>
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
                                onChange={() => setPrivatePhoto(!privatePhoto)}
                            />
                        </div>
                        <Button disabled={imageUploaded} onClick={uploadPhoto}>Upload Photo</Button>
                        <Button onClick={chooseDiff}>Choose a Different Photo</Button>
                        <Button onClick={() => showUploadImage(false)}>Cancel</Button>
                    </div>
                }
            </div>
        </Modal>
    )
}

export default UploadPage;
