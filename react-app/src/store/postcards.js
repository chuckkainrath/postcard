const POST_POSTCARD = 'postcards/POST_POSTCARD';
const GET_POSTCARDS = 'postcards/GET_POSTCARDS';
const DELETE_POSTCARDS = 'postcards/DELETE_POSTCARDS';
const DELETE_POSTCARD = 'postcards/DELETE_POSTCARD';

const postPostcardAction = postcard => ({
    type: POST_POSTCARD,
    payload: postcard
})

const getPostcardsAction = postcards => ({
    type: GET_POSTCARDS,
    payload: postcards
})

const deletePostcardsAction = front_url => ({
    type: DELETE_POSTCARDS,
    payload: front_url
})

const deletePostcardAction = postcard_id => ({
    type: DELETE_POSTCARD,
    payload: postcard_id
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
        return data;
    }
    dispatch(postPostcardAction(data.postcard));
}

export const getPostcards = () => async dispatch => {
    const response = await fetch('/api/postcards/');
    const data = await response.json();
    if (data.errors) {
        return;
    }
    const flatCards = flattenPostcards(data.postcards)
    dispatch(getPostcardsAction(flatCards));
}

export const deletePostcards = front_url => async dispatch => {
    const response = await fetch('/api/postcards/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ front_url })
    });
    const data = await response.json();
    if (data.errors) {
        return;
    }
    dispatch(deletePostcardsAction(front_url));
}

export const deletePostcard = postcard_id => async dispatch => {
    const response = await fetch(`/api/postcards/${postcard_id}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    if (data.errors) {
        return;
    }
    dispatch(deletePostcardAction(postcard_id));
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
        case DELETE_POSTCARDS:
            newState = Object.assign({}, state);
            let keys = Object.keys(newState.postcards);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let card = newState.postcards[key];
                if (card.postcard_front_url === action.payload) {
                    delete newState.postcards[key];
                }
            }
            return newState;
        case DELETE_POSTCARD:
            newState = Object.assign({}, state);
            delete newState.postcards[action.payload];
            return newState;
        default:
            return state;
    }
}
