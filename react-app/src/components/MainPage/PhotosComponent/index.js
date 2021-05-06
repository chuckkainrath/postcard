import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPhotos } from '../../../store/photos';
import styles from './PhotosComponent.module.css';

function PhotosComponent() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const photos = useSelector(state => state.photos.photos);
    const photosArr = photos ? Object.values(photos) : [];

    useEffect(() => {
        dispatch(getPhotos());
    }, [])

    return (
        <div>
            <h1>Hello {user && user.username}</h1>
            {photosArr &&
                photosArr.map(photo => {
                    return <img key={photo.id} className={styles.main_photo} src={photo.photo_url}></img>
                })
            }
            {!photosArr && <h1>No photos yet</h1>}
        </div>
    );
}

export default PhotosComponent;
