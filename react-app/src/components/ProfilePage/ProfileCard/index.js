import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { deletePhoto } from '../../../store/photos';
import { Modal, OverlayTrigger, Tooltip, Button }from 'react-bootstrap'
import { likePhoto, unlikePhoto } from '../../../store/photos';
import styles from './ProfileCard.module.css';

function ProfileCard({ userProfile, photo }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [liked, setLiked] = useState(photo.liked);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const dltPhoto = async () => {
        setDeleteConfirm(false);
        dispatch(deletePhoto(photo.id));
    }

    const toggleLike = async () => {
        if (liked) {
            await dispatch(unlikePhoto(photo.id));
            setLiked(false);
        } else {
            await dispatch(likePhoto(photo.id));
            setLiked(true)
        }
    }

    const deleteTooltip = props => <Tooltip id="delete-tooltip" {...props}>Delete Image</Tooltip>
    const createTooltip = props => <Tooltip id="create-tooltip" {...props}>Create Postcard</Tooltip>
    const unlikeTooltip = props => <Tooltip id="unlike-tooltip" {...props}>Unlike</Tooltip>
    const likeTooltip = props => <Tooltip id="like-tooltip" {...props}>Like</Tooltip>


    return (
        <div className={styles.photo__card}>
            <img
                className={styles.photo__img}
                src={photo.photo_url}
            />
            <div className={styles.photo__options}>
                {userProfile &&
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 250 }}
                        overlay={deleteTooltip}
                    >
                        <span className={styles.photo__delete} onClick={() => setDeleteConfirm(true)}><i class="fas fa-trash"></i></span>
                    </OverlayTrigger>
                }
                {!userProfile &&
                    <div
                    onClick={toggleLike}
                    className={styles.photo__heart}>
                    {liked &&
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 250 }}
                            overlay={unlikeTooltip}
                        >
                            <i class="fas fa-heart"></i>
                        </OverlayTrigger>
                    }
                    {!liked &&
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 250 }}
                            overlay={likeTooltip}
                        >
                            <i class="fal fa-heart"></i>
                        </OverlayTrigger>
                    }
                </div>
                }
                <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 250 }}
                    overlay={createTooltip}
                >
                    <div
                        onClick={() => history.push(`/create-postcard/${photo.id}`)}
                        className={styles.photo__card_create}>
                        <i title="Create a Postcard" class="fal fa-envelope"></i>
                    </div>
                </OverlayTrigger>
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
    )
}

export default ProfileCard;
