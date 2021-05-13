import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PhotoEditor from './PhotoEditor';
import BackEditor from './BackEditor';
import { saveAs } from 'file-saver';
import { postPostcard } from '../../store/postcards';

const WIDTH = 600;
const HEIGHT = 400;

function PhotoKanvas({ photoSrc }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [ cardFront, setCardFront ] = useState();
    const [ cardBack, setCardBack ] = useState();
    const [ stage, setStage ] = useState('card');
    const [ frontName, setFrontName ] = useState('');
    const [ backName, setBackName ] = useState('');
    const [ cardSaved, setCardSaved ] = useState(false);
    const user = useSelector(state => state.session.user);

    const finishFront = image => {
        setCardFront(image);
        setStage('back');
    }

    const finishBack = image => {
        setCardBack(image);
        setStage('complete');

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        const formattedDate = `${year}-${month}-${day}-${hour}-${min}-${sec}`;
        setFrontName(`${user.username}-front-${formattedDate}`);
        setBackName(`${user.username}-back-${formattedDate}`);
    }

    const downloadPostcard = () => {
        saveAs(cardFront, frontName);
        saveAs(cardBack, backName);
        history.push('/photos');
    }

    const storePostcard = async () => {
        setCardSaved(true);
        await dispatch(postPostcard(cardFront, cardBack, frontName, backName));
    }

    return (
        <div>
            {stage === 'card' &&
                <PhotoEditor photoSrc={photoSrc} finishFront={finishFront} />
            }
            {stage === 'back' &&
                <BackEditor finishBack={finishBack} />
            }
            {stage === 'complete' &&
                <div>
                    <h1>Almost Finished</h1>
                    <button onClick={downloadPostcard}>Download Images</button>
                    <button disabled={cardSaved} onClick={storePostcard}>
                        {cardSaved ? 'Postcard Saved!' : 'Save Postcard'}
                    </button>
                    <button onClick={() => history.push('/photos')}>Photos Page</button>
                </div>
            }
        </div>
    );
}

export default PhotoKanvas;
