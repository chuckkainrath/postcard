import React from 'react';
import { useHistory } from 'react-router';
import styles from './PhotoCard.module.css';

function PhotoCard({ photo }) {
    const history = useHistory();
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
                    src={photo.profile_img_url}
                />
                <div className={styles.photo__card_create}>
                    <i class="fal fa-envelope"></i>
                </div>
            </div>
        </div>
    )
}

export default PhotoCard;
