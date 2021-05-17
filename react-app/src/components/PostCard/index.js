import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PhotoKanvas from '../PhotoKanvas';
import styles from './PostCard.module.css';

function PostCard() {
    const { photoId } = useParams();
    const photos = useSelector(state => state.photos.photos);
    const photo = photos[photoId];
    const imageUrl = photo.photo_url;

    return (
        <div>
            <h1 className={styles.postcard_title}>Create a Postcard</h1>
            <PhotoKanvas photoSrc={imageUrl} />
        </div>
    )
}

export default PostCard;
