import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getFollows } from '../../../store/followers';
import { getPhotos } from '../../../store/photos';
import { blankProfile } from '../../../store/profile';
import PhotoCard from '../PhotoCard';
import styles from './PhotosComponent.module.css';


function PhotosComponent() {
    const dispatch = useDispatch();
    const photos = useSelector(state => state.photos);
    const [photosArr, setPhotosArr] = useState(photos.photos ? Object.values(photos.photos).reverse() : []);

    useEffect(() => {
        setPhotosArr(photos.photos ? Object.values(photos.photos).reverse() : [])
    }, [photos]);

    useEffect(() => {
        dispatch(getPhotos());
        dispatch(getFollows())
        dispatch(blankProfile());
    }, [])

    return (
        <div>
            <div className={styles.cards__container}>
                {photosArr &&
                    photosArr.map(photo => {
                        return <PhotoCard
                                    myProfile={false}
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
