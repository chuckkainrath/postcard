import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { deletePostcards, deletePostcard } from '../../../store/postcards';
import { saveAs } from 'file-saver';
import styles from './PostcardCard.module.css';


function ProfileCard({ cards }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [showBack, setShowBack] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const dltPostcards = async () => {
        setDeleteConfirm(false);
        dispatch(deletePostcards(cards[0].postcard_front_url));
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
        (async () => {
            const srcPartsFront = card.postcard_front_url.split('/');
            const srcPartsBack = card.postcard_back_url.split('/');
            let filenameFront = srcPartsFront[srcPartsFront.length - 1];
            let filenameBack = srcPartsBack[srcPartsBack.length - 1];
            saveAs(card.postcard_front_url, filenameFront);
            saveAs(card.postcard_back_url, filenameBack);
        })();
    }

    const deleteTooltip = props => (
        <Tooltip id="delete-tooltip" {...props}>Delete Postcards</Tooltip>
    );

    return (
        <div className={styles.postcard__card}>
            <img
                className={styles.postcard__img}
                src={cards[0].postcard_front_url}
            />
            <div className={styles.postcard__options}>
                <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 250 }}
                    overlay={deleteTooltip}
                >
                    <span className={styles.delete__card} onClick={() => setDeleteConfirm(true)}><i class="fas fa-trash"></i></span>
                </OverlayTrigger>
                <div>
                    <Button className={styles.view__msgs} onClick={() => setShowBack(true)}>Show Messages</Button>
                    <Button className={styles.reuse} onClick={reuseCard}>Reuse Card</Button>
                </div>
            </div>
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
            <Modal
                show={deleteConfirm}
                onHide={() => setDeleteConfirm(false)}
                className={styles.modal__delete}
                centered
            >
                <Modal.Header>
                    <h1 className={styles.modal__title}>Delete Postcard</h1>
                </Modal.Header>
                <Modal.Body>
                    <p>Deleting this postcard will also delete all associate messages.</p>
                </Modal.Body>
                <Modal.Footer>
                    <div className={styles.delete_or_cancel}>
                        <Button onClick={dltPostcards}>Delete</Button>
                        <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ProfileCard;
