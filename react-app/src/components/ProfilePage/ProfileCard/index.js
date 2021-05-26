import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { confirmAlert } from 'react-confirm-alert';
import { deletePhoto } from '../../../store/photos';
import { likePhoto, unlikePhoto } from '../../../store/photos';
import styles from './ProfileCard.module.css';

function ProfileCard({ userProfile, photo }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [liked, setLiked] = useState(photo.liked);

    const dltPhoto = async () => {
        dispatch(deletePhoto(photo.id));
    }

    const confirmDelete = () => {
        const options = {
            title: 'Delete Photo',
            message: 'Are you sure you want to delete this photo?',
            buttons: [
                {
                    label: 'Delete',
                    onClick: dltPhoto
                },
                {
                    label: 'Cancel',
                    onClick: () => {}
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
            willUnmount: () => {},
            afterClose: () => {},
            onClickOutside: () => {},
            onKeypressEscape: () => {},
            overlayClassName: styles.delete_popup
        };
        confirmAlert(options);
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
                    <span className={styles.photo__delete} onClick={confirmDelete}><i class="fas fa-trash"></i></span>
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
                    <i class="fal fa-envelope"></i>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard;
