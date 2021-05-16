import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getPhotos } from '../../../store/photos';
import PhotoCard from '../PhotoCard';
import styles from './PhotosComponent.module.css';

function PhotosComponent() {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(state => state.session.user);
    const photos = useSelector(state => state.photos.photos);
    const photosArr = photos ? Object.values(photos) : [];

    useEffect(() => {
        dispatch(getPhotos());
    }, [])

    return (
        <div>
            <div className={styles.cards__container}>
                {photosArr &&
                    photosArr.map(photo => {
                        return <PhotoCard
                                    key={photo.id}
                                    photo={photo}
                            />
                    })
                }
            </div>
            {!photosArr && <h1>No photos yet</h1>}
        </div>
    );
}

export default PhotosComponent;
