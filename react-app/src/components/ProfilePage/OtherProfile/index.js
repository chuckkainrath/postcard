import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
        <div>
            {profile &&
                <h1>{profile.username}'s Profile</h1>
            }
            {photosArr && photosArr.map(photo => {
                return <img key={photo.id}
                            className={styles.photo_size}
                            src={photo.photo_url}
                        />
            })}
        </div>
    );
}

export default OtherProfile;
