import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PhotoCanvas from '../Canvas';

function PostCard() {
    const { photoId } = useParams();
    const photos = useSelector(state => state.photos.photos);
    const photo = photos[photoId];
    const imageUrl = photo.photo_url;

    return (
        <div>
            <h1>Canvas!</h1>
            <PhotoCanvas imageUrl={imageUrl} />
        </div>
    )
}

export default PostCard;
