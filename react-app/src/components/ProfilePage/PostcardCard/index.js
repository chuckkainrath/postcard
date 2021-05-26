import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { confirmAlert } from 'react-confirm-alert';
import { deletePostcards, deletePostcard } from '../../../store/postcards';
import { saveAs } from 'file-saver';
import styles from './PostcardCard.module.css';


function ProfileCard({ cards }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [showBack, setShowBack] = useState(false);

    const dltPostcards = async () => {
        console.log('deleting card');
        dispatch(deletePostcards(cards[0].postcard_front_url));
    }

    const confirmDelete = () => {
        const options = {
            title: 'Delete Postcard',
            message: 'Are you sure you want to delete this postcard?  All postcards created with the template will be deleted.',
            buttons: [
                {
                    label: 'Delete',
                    onClick: dltPostcards
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

    const reuseCard = () => {
        history.push(`/create-postcard/${cards[0].id}`, { front_url: cards[0].postcard_front_url })
    }

    const deleteCard = async card => {
        // Delete template and card
        if (cards.length === 1) {
            await dispatch(deletePostcards(card.postcard_front_url));
            setShowBack(false);
        } else {  // Delete just card
            dispatch(deletePostcard(card.id));
        }
    }

    const downloadCard = card => {
        console.log('here');
        (async () => {
            const srcPartsFront = card.postcard_front_url.split('/');
            const srcPartsBack = card.postcard_back_url.split('/');
            let filenameFront = srcPartsFront[srcPartsFront.length - 1];
            let filenameBack = srcPartsBack[srcPartsBack.length - 1];
            saveAs(card.postcard_front_url, filenameFront);
            saveAs(card.postcard_back_url, filenameBack);
        })();
    }

    return (
        <div className={styles.postcard__card}>
            <img
                className={styles.postcard__img}
                src={cards[0].postcard_front_url}
            />
            <div className={styles.postcard__options}>
                <button onClick={confirmDelete}>Delete</button>
                <button onClick={reuseCard}>Reuse Card</button>
                <button onClick={() => setShowBack(true)}>Show Messages</button>
                <Modal
                    show={showBack}
                    onHide={() => setShowBack(false)}
                    // backdrop='static'
                    dialogClassName={styles.modal__container}
                >
                    <Modal.Header>
                        <h1 className={styles.modal__title}>Postcard Messages</h1>
                        <div className={styles.modal__close} onClick={() => setShowBack(false)}><i class="fal fa-times"></i></div>
                    </Modal.Header>
                    <Modal.Body>
                        {cards.map(card => {
                            return (
                                <div className={styles.modal__message} key={card.id}>
                                    <img src={card.postcard_back_url} />
                                    <div>
                                        <span className={styles.modal__delete} onClick={() => deleteCard(card)}><i class="fas fa-trash"></i></span>
                                        <span className={styles.modal__download} onClick={() => downloadCard(card)}><i class="fas fa-download"></i></span>
                                    </div>
                                </div>
                            )
                        })}
                    </Modal.Body>
                </Modal>
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
