import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { likePhoto, unlikePhoto } from '../../../store/photos';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import styles from './PhotoCard.module.css';
import blankProfile from './blank-profile-img.png';

function PhotoCard({ photo }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
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

    const likeTooltip = props => (
        <Tooltip id="like-tooltip" {...props}>Like</Tooltip>
    );

    const unlikeTooltip = props => (
        <Tooltip id="unlike-tooltip" {...props}>Unlike</Tooltip>
    );

    const photoTooltip = props => (
        <Tooltip id="photo-tooltip" {...props}>Create a Postcard</Tooltip>
    );

    return (
        <div className={styles.photo__card}>
            <img
                className={styles.photo__img}
                src={photo.photo_url}
                onClick={() => history.push(`/profiles/${photo.username}`)}
            />
            <div className={styles.photo__options}>
                <div className={styles.left__container}>
                    <img
                        className={styles.photo__user_profile}
                        src={profileSrc}
                        onClick={() => history.push(`/profiles/${photo.username}`)}
                    />
                    <div
                        onClick={toggleLike}
                        className={styles.photo__heart}>
                        {liked &&
                            <>
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 250 }}
                                    overlay={unlikeTooltip}
                                >
                                    <i class="fas fa-heart"></i>
                                </OverlayTrigger>
                                <span className={styles.likes__count}>{photo.like_count}</span>
                            </>
                        }
                        {!liked &&
                            <>
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 250 }}
                                    overlay={likeTooltip}
                                >
                                    <i class="fal fa-heart"></i>
                                </OverlayTrigger>
                                <span className={styles.likes__count}>{photo.like_count}</span>
                            </>
                        }

                    </div>
                </div>
                <div
                    onClick={() => history.push(`/create-postcard/${photo.id}`)}
                    className={styles.photo__card_create}>
                    <OverlayTrigger
                        placement="left"
                        delay={{ show: 250, hide: 250 }}
                        overlay={photoTooltip}
                    >
                        <i class={"fal fa-envelope"}></i>
                    </OverlayTrigger>
                </div>
            </div>
        </div>
    )
}

export default PhotoCard;
