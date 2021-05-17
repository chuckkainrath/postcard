import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PhotoCard from '../../MainPage/PhotoCard';
import styles from './OtherProfile.module.css';

function OtherProfile() {
    const { profile, photos } = useSelector(state => state.profile);
    const [ photosArr, setPhotosArr ] = useState(
        photos ? Object.values(photos) : []
    );

    useEffect(() => {
        setPhotosArr(photos ? Object.values(photos) : [])
    }, [photos])

    return (
        <div className={styles.profile__container}>
            {profile &&
                <h1>{profile.username}'s Profile</h1>
            }
            <div className={styles.photos__container}>
                {photosArr && photosArr.map(photo => {
                    return <PhotoCard key={photo.id} photo={photo} />
                })}
            </div>
        </div>
    );
}

export default OtherProfile;
