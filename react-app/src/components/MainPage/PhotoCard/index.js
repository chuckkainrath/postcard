import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { likePhoto, unlikePhoto, deletePhoto } from '../../../store/photos';
import { likeProfilePhoto, unlikeProfilePhoto } from '../../../store/profile';
import { Tooltip, OverlayTrigger, Modal, Button } from 'react-bootstrap';
import styles from './PhotoCard.module.css';
import blankProfile from './blank-profile-img.png';
import postcardIcon from '../../../images/postcard.svg';

function PhotoCard({ photo, myProfile }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
    const profileSrc = photo.profile_img_url ? photo.profile_img_url : blankProfile;
    const [liked, setLiked] = useState(photo.liked);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const toggleLike = async () => {
        if (liked) {
            await dispatch(unlikePhoto(photo.id));
            dispatch(unlikeProfilePhoto(photo.id));
            setLiked(false);
        } else {
            const likeId = await dispatch(likePhoto(photo.id));
            if (myProfile) dispatch(likeProfilePhoto(photo.id, likeId))
            setLiked(true)
        }
    }


    const dltPhoto = async () => {
        setDeleteConfirm(false);
        dispatch(deletePhoto(photo.id));
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

    const deleteTooltip = props => <Tooltip id="delete-tooltip" {...props}>Delete Image</Tooltip>

    return (
        <div className={styles.flex__container}>
            <div className={styles.photo__card}>
                <img
                    className={styles.photo__img}
                    src={photo.photo_url}
                    onClick={() => history.push(`/profiles/${photo.username}`)}
                />
                <div className={styles.photo__options}>
                    <div className={styles.left__container}>
                        {myProfile &&
                            <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 250 }}
                                overlay={deleteTooltip}
                            >
                                <span className={styles.photo__delete} onClick={() => setDeleteConfirm(true)}><i class="fas fa-trash"></i></span>
                            </OverlayTrigger>
                        }
                        {!myProfile &&
                            <img
                                className={styles.photo__user_profile}
                                src={profileSrc}
                                onClick={() => history.push(`/profiles/${photo.username}`)}
                            />
                        }
                        {photo.public &&
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
                        }
                    </div>
                    <div
                        onClick={() => history.push(`/create-postcard/${photo.id}`)}
                        className={styles.photo__card_create}>
                        <OverlayTrigger
                            placement="left"
                            delay={{ show: 250, hide: 250 }}
                            overlay={photoTooltip}
                        >
                            <i className={styles.postcard_icon}></i>
                        </OverlayTrigger>
                    </div>
                </div>
                    <Modal
                        show={deleteConfirm}
                        onHide={() => setDeleteConfirm(false)}
                        centered
                        className={styles.delete__modal}
                    >
                        <Modal.Header>
                            <h1 className={styles.modal__title}>Delete Photo</h1>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Are you sure you want to delete the photo?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className={styles.delete_or_cancel}>
                                <Button onClick={dltPhoto}>Delete</Button>
                                <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                            </div>
                        </Modal.Footer>
                    </Modal>
            </div>
        </div>
    )
}

export default PhotoCard;
