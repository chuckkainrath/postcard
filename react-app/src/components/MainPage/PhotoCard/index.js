import React from 'react';
import { useHistory } from 'react-router';
import styles from './PhotoCard.module.css';
import blankProfile from './blank-profile-img.png';

function PhotoCard({ photo }) {
    const history = useHistory();
    const profileSrc = photo.profile_img_url ? photo.profile_img_url : blankProfile;
    console.log(profileSrc);
    return (
        <div className={styles.photo__card}>
            <img
                className={styles.photo__img}
                src={photo.photo_url}
                onClick={() => history.push(`/profiles/${photo.username}`)}
            />
            <div className={styles.photo__options}>
                <img
                    className={styles.photo__user_profile}
                    src={profileSrc}
                />
                <div
                    onClick={() => history.push(`/create-postcard/${photo.id}`)}
                    className={styles.photo__card_create}>
                    <i class="fal fa-envelope"></i>
                </div>
            </div>
        </div>
    )
}

export default PhotoCard;
