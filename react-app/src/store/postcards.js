const POST_POSTCARD = 'postcards/POST_POSTCARD';

const postPostcardAction = postcard => ({
    type: POST_POSTCARD,
    payload: postcard
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
        default:
            return state
    }
}
