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
        <div className={styles.kanvas__container}>
            <h1 className={styles.postcard_title}><span className={styles.info}><i class="fad fa-info-circle"></i></span>Create a Postcard</h1>
            <PhotoKanvas stage={stage} setStage={setStage} photoSrc={imageUrl} />
        </div>
    )
}

export default PostCard;
