import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PhotoEditor from './PhotoEditor';
import BackEditor from './BackEditor';
import { saveAs } from 'file-saver';

const WIDTH = 600;
const HEIGHT = 400;

function PhotoKanvas({ photoSrc }) {
    const history = useHistory();
    const [ cardFront, setCardFront ] = useState();
    const [ cardBack, setCardBack ] = useState();
    const [ stage, setStage ] = useState('card');
    const user = useSelector(state => state.session.user);

    const finishFront = image => {
        setCardFront(image);
        setStage('back');
    }

    const finishBack = image => {
        setCardBack(image);
        setStage('complete');
    }

    const downloadPostcard = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        const formattedDate = `${year}-${month}-${day}-${hour}-${min}-${sec}`;
        const frontName = `${user.username}-front-${formattedDate}`;
        const backName = `${user.username}-back-${formattedDate}`;
        saveAs(cardFront, frontName);
        saveAs(cardBack, backName);
        history.push('/photos');
    }

    const storePostcard = () => {

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
                    <button onClick={storePostcard}>Save Postcard</button>
                </div>
            }
        </div>
    );
}

export default PhotoKanvas;
