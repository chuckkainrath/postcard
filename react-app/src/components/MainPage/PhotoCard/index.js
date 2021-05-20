import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { confirmAlert } from 'react-confirm-alert';
import { deletePhoto } from '../../../store/photos';
import styles from './PhotoCard.module.css';
import blankProfile from './blank-profile-img.png';

function PhotoCard({ profilePage, photo }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const profileSrc = photo.profile_img_url ? photo.profile_img_url : blankProfile;

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
                onClick={() => history.push(`/profiles/${photo.username}`)}
            />
            <div className={styles.photo__options}>
                {!profilePage &&
                    <img
                        className={styles.photo__user_profile}
                        src={profileSrc}
                    />
                }
                {profilePage &&
                    <button onClick={confirmDelete}>Delete</button>
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

export default PhotoCard;
