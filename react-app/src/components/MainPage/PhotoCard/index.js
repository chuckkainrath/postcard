import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { likePhoto, unlikePhoto } from '../../../store/photos';
import styles from './PhotoCard.module.css';
import blankProfile from './blank-profile-img.png';

function PhotoCard({ photo }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const profileSrc = photo.profile_img_url ? photo.profile_img_url : blankProfile;
    const [liked, setLiked] = useState(photo.liked);

    const toggleLike = async () => {
        if (liked) {
            await dispatch(unlikePhoto(photo.id));
            setLiked(false);
        } else {
            await dispatch(likePhoto(photo.id));
            setLiked(true)
        }
    }

    return (
        <div className={styles.photo__card}>
            <img
                className={styles.photo__img}
                src={photo.photo_url}
                // TODO: ADD MODAL HERE ?
            />
            <div className={styles.photo__options}>
                <img
                    className={styles.photo__user_profile}
                    src={profileSrc}
                    onClick={() => history.push(`/profiles/${photo.username}`)}
                />
                <div
                    onClick={toggleLike}
                    className={styles.photo__heart}>
                    {liked &&
                        <i class="fas fa-heart"></i>
                    }
                    {!liked &&
                        <i class="fal fa-heart"></i>
                    }
                </div>
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
