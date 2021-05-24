import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PhotoEditor from './PhotoEditor';
import BackEditor from './BackEditor';
import { saveAs } from 'file-saver';
import { postPostcard } from '../../store/postcards';
import styles from './PhotoKanvas.module.css';

const WIDTH = 600;
const HEIGHT = 400;

function PhotoKanvas({ photoSrc, frontSrc }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [ cardFront, setCardFront ] = useState();
    const [ cardBack, setCardBack ] = useState();
    const [ frontUrl, setFrontUrl ] = useState('');
    const [ backUrl, setBackUrl ] = useState('');
    const [ stage, setStage ] = useState('card');
    const [ frontName, setFrontName ] = useState('');
    const [ backName, setBackName ] = useState('');
    const [ cardSaved, setCardSaved ] = useState(false);
    const user = useSelector(state => state.session.user);

    const finishFront = image => {
        setCardFront(image);
        setStage('back');
        setFrontUrl(URL.createObjectURL(image));
    }

    const finishBack = image => {
        setCardBack(image);
        setStage('complete');
        setBackUrl(URL.createObjectURL(image));
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        const formattedDate = `${year}-${month}-${day}-${hour}-${min}-${sec}`;
        if (photoSrc) {
            setFrontName(`${user.username}-front-${formattedDate}`);
        }
        setBackName(`${user.username}-back-${formattedDate}`);
    }

    const downloadPostcard = () => {
        saveAs(cardFront, frontName);
        saveAs(cardBack, backName);
    }

    const storePostcard = async () => {
        setCardSaved(true);
        await dispatch(postPostcard(cardFront, cardBack, frontName, backName));
    }

    useEffect(() => {
        if (frontSrc) {
            (async url => {
                const res = await fetch(url);
                const imageBlob = await res.blob();
                const srcParts = frontSrc.split('/');
                let filename = srcParts[srcParts.length - 1];
                filename = filename.split('.')[0];
                imageBlob.filename = filename;
                setFrontName(filename);
                finishFront(imageBlob);
            })(frontSrc);
        }
    }, []);


    return (
        <div>
            {stage === 'card' &&
                <PhotoEditor photoSrc={photoSrc} finishFront={finishFront} />
            }
            {stage === 'back' &&
                <BackEditor finishBack={finishBack} />
            }
            {stage === 'complete' &&
                <div className={styles.finished__container}>
                    <div className={styles.images__container}>
                        <img className={styles.image} src={frontUrl} />
                        <img className={styles.iamge} src={backUrl} />
                    </div>
                    <div className={styles.button__container}>
                        <button onClick={downloadPostcard}>Download Images</button>
                        <button disabled={cardSaved} onClick={storePostcard}>
                            {cardSaved ? 'Postcard Saved!' : 'Save Postcard'}
                        </button>
                        <button onClick={() => history.push('/photos')}>Back to Main Page</button>
                    </div>
                </div>
            }
        </div>
    );
}

export default PhotoKanvas;
