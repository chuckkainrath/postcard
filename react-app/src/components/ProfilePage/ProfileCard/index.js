import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { deletePhoto } from '../../../store/photos';
import Modal from 'react-bootstrap/Modal'
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

    return (
        <div className={styles.photo__card}>
            <img
                className={styles.photo__img}
                src={photo.photo_url}
            />
            <div className={styles.photo__options}>
                {userProfile &&
                    <span className={styles.photo__delete} onClick={() => setDeleteConfirm(true)}><i class="fas fa-trash"></i></span>
                }
                {!userProfile &&
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
                }
                <div
                    onClick={() => history.push(`/create-postcard/${photo.id}`)}
                    className={styles.photo__card_create}>
                    <i title="Create a Postcard" class="fal fa-envelope"></i>
                </div>
            </div>
                <Modal
                    show={deleteConfirm}
                    onHide={() => setDeleteConfirm(false)}
                    // backdrop='static'
                    dialogClassName={styles.modal__container}
                >
                    <Modal.Header dialogClassName={styles.modal__header}>
                        <h1 className={styles.modal__title}>Delete Photo</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete the photo?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className={styles.delete_or_cancel}>
                            <button onClick={dltPhoto}>Delete</button>
                            <button onClick={() => setDeleteConfirm(false)}>Cancel</button>
                        </div>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}

export default ProfileCard;
