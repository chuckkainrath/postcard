import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { confirmAlert } from 'react-confirm-alert';
import styles from './PostcardCard.module.css';

function ProfileCard({ postcard }) {
    const history = useHistory();
    const dispatch = useDispatch();

    const dltPostcard = async () => {
       // dispatch(deletePostcard(photo.id));
    }

    const confirmDelete = () => {
        const options = {
            title: 'Delete Postcard',
            message: 'Are you sure you want to delete this postcard?  All postcards created with the template will be deleted.',
            buttons: [
                {
                    label: 'Delete',
                    onClick: dltPostcard
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
        <div className={styles.postcard__card}>
            <img
                className={styles.postcard__img}
                src={postcard.postcard_front_url}
            />
            <div className={styles.postcard__options}>
                <button onClick={confirmDelete}>Delete</button>
                <button onClick={}>Reuse Card</button>
                {/* <div   TODO REDIRECT THIS TO POSTCARD BACK.
                    onClick={() => history.push(`/create-postcard/${photo.id}`)}
                    className={styles.photo__card_create}>
                    <i class="fal fa-envelope"></i>
                </div> */}
            </div>
        </div>
    )
}

export default ProfileCard;
