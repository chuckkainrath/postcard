import React, { useEffect, useState } from 'react';
import PhotoEditor from './PhotoEditor';
import BackEditor from './BackEditor';

const WIDTH = 600;
const HEIGHT = 400;

function PhotoKanvas({ photoSrc }) {
    const [ cardFront, setCardFront ] = useState();
    const [ cardBack, setCardBack ] = useState();
    const [ stage, setStage ] = useState('card');

    const finishFront = image => {
        setCardFront(image);
        setStage('back');
    }

    const finishBack = image => {
        setCardBack(image);
        setStage('complete');
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
                <h1>Done?</h1>
            }
        </div>
    );
}

export default PhotoKanvas;
