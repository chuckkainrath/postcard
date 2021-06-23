import { flattenPhotos } from './photos';

const GET_PROFILE = 'profile/GET_PROFILE';
const DELETE_PROFILE_IMAGE = 'profile/DELETE_PROFILE_IMAGE';
const BLANK_PROFILE = 'profile/BLANK_PROFILE';
const ADD_PICTURE = 'profile/ADD_PICTURE';

const getProfileAction = (user, photos) => ({
    type: GET_PROFILE,
    user,
    photos
})

export const addPicture = photo => ({
    type: ADD_PICTURE,
    payload: photo
})

export const blankProfile = () => ({
    type: BLANK_PROFILE
})

export const deleteProfileImageAction = photoId => ({
    type: DELETE_PROFILE_IMAGE,
    payload: photoId
})

export const getProfile = (username) => async dispatch => {
    const response = await fetch(`/api/users/${username}`);
    const data = await response.json();
    if (data.errors) {
        return;
    }

    const flatPhotos = flattenPhotos(data.photos);
    dispatch(getProfileAction(data.user, flatPhotos))
}

const initialState = {
    profile: null,
    photos: null
}

export default function reducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case GET_PROFILE:
            return { profile: action.user, photos: action.photos };
        case DELETE_PROFILE_IMAGE:
            newState = Object.assign({}, state);
            delete newState.photos[action.payload];
            return newState;
        case BLANK_PROFILE:
            return initialState;
        case ADD_PICTURE:
            newState = Object.assign({}, state);
            if (state.photos === null) newState.photos = {}
            newState.photos[action.payload.id] = action.payload
            return newState;
        default:
            return state;
    }
}
