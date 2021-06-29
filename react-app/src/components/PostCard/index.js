import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PhotoKanvas from '../PhotoKanvas';
import styles from './PostCard.module.css';

function PostCard() {
    const { photoId } = useParams();
    const location = useLocation();
    const [ stage, setStage ] = useState('card');
    const photos = useSelector(state => state.photos.photos);
    const profPhotos = useSelector(state => state.profile.photos);

    if (location.state) {
        return (
            <div>
                <h1 className={styles.postcard_title}>Create a Postcard</h1>
                <PhotoKanvas frontSrc={location.state.front_url} />
            </div>
        )
    }

    let photo = photos[photoId];
    if (!photo) {
        photo = profPhotos[photoId];
    }
    const imageUrl = photo.photo_url;


    return (
        <div className={stage !== 'complete' ? styles.kanvas__container : null}>
            {stage === 'card' &&
                <div className={styles.info}><i class="fad fa-info-circle"></i></div>
            }
            <div className={styles.instructions}>
                <h1>Instructions</h1>
                <ul>
                    <li>Click 'New Text' to create a new text field</li>
                    <li>An active text field is indicated by a red dotted border</li>
                    <li>The active text field is editable and draggable</li>
                    <li>You can create as many text fields as you'd like</li>
                    <li>Click a text field to make it active</li>
                    <li>You can delete an active text field by clicking 'Delete'</li>
                </ul>
            </div>
            <h1 className={styles.postcard_title}>Create a Postcard</h1>
            <div className={styles.kanvas}>
                <PhotoKanvas stage={stage} setStage={setStage} photoSrc={imageUrl} />
            </div>
        </div>
    )
}

export default PostCard;
