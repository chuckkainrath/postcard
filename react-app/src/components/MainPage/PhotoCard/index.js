import React from 'react';
import { useHistory } from 'react-router';
import styles from './PhotoCard.module.css';

function PhotoCard({ photo }) {
    const history = useHistory();
    const profileSrc = photo.profile_img_url ? photo.profile_img_url : '/images/blank-profile-img.webp';
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
                <div className={styles.photo__card_create}>
                    <i class="fal fa-envelope"></i>
                </div>
            </div>
        </div>
    )
}

export default PhotoCard;
