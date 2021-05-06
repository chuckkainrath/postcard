import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './MyProfile.module.css';

function MyProfile() {
    const profile = useSelector(state => state.profile);
    const [photos, setPhotos] = useState(
        profile.photos ? Object.values(profile.photos) : []
    );

    useEffect(() => {
        setPhotos(
            profile.photos ? Object.values(profile.photos) : []
        )
    }, [profile])

    return (
        <div>
            <h1>My Profile</h1>
            <h2>My Public Photos</h2>
            {photos && photos.map(photo => {
                if (photo.public) {
                    return <img key={photo.id}
                                src={photo.photo_url}
                                className={styles.photo_size}
                            />
                }
            })}
            <br />
            <h2>My Private Photos</h2>
            {photos && photos.map(photo => {
                if (!photo.public) {
                    return <img key={photo.id}
                                src={photo.photo_url}
                                className={styles.photo_size}
                            />
                }
            })}
        </div>
    );
}

export default MyProfile;
