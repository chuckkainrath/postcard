const POST_POSTCARD = 'postcards/POST_POSTCARD';
const GET_POSTCARDS = 'postcards/GET_POSTCARDS';

const postPostcardAction = postcard => ({
    type: POST_POSTCARD,
    payload: postcard
})

const getPostcardsAction = postcards => ({
    type: GET_POSTCARDS,
    payload: postcards
})

export const postPostcard = (frontImg, backImg, frontName, backName) => async dispatch => {
    const postcardForm = new FormData();
    const frontFile = new File([frontImg], `${frontName}.png`);
    const backFile = new File([backImg], `${backName}.png`);
    postcardForm.append('card_front', frontFile);
    postcardForm.append('card_back', backFile);
    const response = await fetch('/api/postcards/', {
        method: 'POST',
        body: postcardForm
    });
    const data = await response.json();
    if (data.errors) {
        console.log(data.errors);
        return data;
    }
    dispatch(postPostcardAction(data.postcard));
}

export const getPostcards = () => async dispatch => {
    const response = await fetch('/api/postcards/');
    const data = await response.json();
    if (data.errors) {
        console.log('ERRORS GETTING POSTCARDS', data.errors);
        return;
    }
    const flatCards = flattenPostcards(data.postcards)
    dispatch(getPostcardsAction(flatCards));
}

const flattenPostcards = postcards => {
    const fPostcards = {};
    postcards.forEach(card => {
        fPostcards[card.id] = card;
    });
    return fPostcards;
}

const initialState = {
    postcards: null
}

export default function reducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case POST_POSTCARD:
            newState = Object.assign({}, state);
            newState[action.payload.id] = action.payload;
            return newState;
        case GET_POSTCARDS:
            newState = { postcards: action.payload };
            return newState;
        default:
            return state;
    }
}
