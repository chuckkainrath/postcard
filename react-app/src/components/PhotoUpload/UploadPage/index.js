import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { Modal, Button } from 'react-bootstrap';
import AvatarEditor from 'react-avatar-editor';
import { postPhoto } from '../../../store/photos';
import { addPicture } from '../../../store/profile';
import styles from './UploadPage.module.css';

const WIDTH = 600;
const HEIGHT = 400;

function UploadPage({uploadImage, showUploadImage}) {
    const dispatch = useDispatch();
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
                let photo = await dispatch(postPhoto(blob, privatePhoto));
                dispatch(addPicture(photo));
                showUploadImage(false);
                setImageUrl('');
                setEditor(null);
                setPrivatePhoto(false);
                setImageUploaded(false);
            });
        }
    }

    const chooseDiff = () => {
        setImageUrl('');
        setEditor(null);
        setImageUploaded(false);
        setPrivatePhoto(false);
    }

    return (
        <>
            {!imageUrl &&
                <Modal
                    show={uploadImage}
                    onHide={() => showUploadImage(false)}
                    centered
                >
                    <div className={styles.image__select} {...getRootProps()}>
                        <input {...getInputProps()} />
                        { isDragActive ?
                            <p className={styles.upload__msg}>Drop the file here...</p> :
                            <p className={styles.upload__msg}>Drag 'n' drop a file here, <br /> or click to select files</p>
                        }
                    </div>
                </Modal>
            }
            {imageUrl &&
                <Modal
                    show={uploadImage}
                    onHide={() => showUploadImage(false)}
                    className={styles.modal__image_edit}
                    centered
                >
                    <Modal.Body className={styles.image__crop}>
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
                        <div className={`${styles.edit__input} ${styles.edit__first}`}>
                            <label>Scale:</label>
                            <input
                                type='range'
                                step='0.1'
                                min='1'
                                max='3'
                                value={scale}
                                onChange={(e) => setScale(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className={styles.edit__input}>
                            <label for='privatePhoto'>Private:</label>
                            <input
                                id='privatePhoto'
                                type='checkbox'
                                checked={privatePhoto}
                                onChange={() => setPrivatePhoto(!privatePhoto)}
                            />
                            {!privatePhoto && <div className={styles.private__photo}><i class="fad fa-unlock-alt"></i></div>}
                            {privatePhoto && <div className={styles.private__photo}><i class="fad fa-lock-alt"></i></div>}
                        </div>
                        <div className={styles.buttons}>
                            <Button disabled={imageUploaded} onClick={uploadPhoto}>Upload Photo</Button>
                            <Button onClick={chooseDiff}>Select a Different Photo</Button>
                            <Button onClick={() => showUploadImage(false)}>Cancel</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}

export default UploadPage;
