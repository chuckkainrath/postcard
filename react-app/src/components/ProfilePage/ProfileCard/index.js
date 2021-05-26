import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { confirmAlert } from 'react-confirm-alert';
import { deletePhoto } from '../../../store/photos';
import styles from './ProfileCard.module.css';

function ProfileCard({ userProfile, photo }) {
    const history = useHistory();
    const dispatch = useDispatch();

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
                    <span>{photo.like}</span>
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
