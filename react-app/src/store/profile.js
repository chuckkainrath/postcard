import { flattenPhotos } from './photos';

const GET_PROFILE = 'profile/GET_PROFILE';
const DELETE_PROFILE_IMAGE = 'profile/DELETE_PROFILE_IMAGE';
const BLANK_PROFILE = 'profile/BLANK_PROFILE';

const getProfileAction = (user, photos) => ({
    type: GET_PROFILE,
    user,
    photos
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
        console.log('GET PROFILE ERRORS', data.errors);
    }

    const flatPhotos = flattenPhotos(data.photos);
    dispatch(getProfileAction(data.user, flatPhotos))
}

const initialState = {
    profile: null,
    photos: null
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_PROFILE:
            return { profile: action.user, photos: action.photos };
        case DELETE_PROFILE_IMAGE:
            let newState = Object.assign({}, state);
            console.log('action', action);
            console.log('OLDSTATE', state);
            delete newState.photos[action.payload];
            console.log('NEWSTATE', newState);
            return newState;
        case BLANK_PROFILE:
            return initialState;
        default:
            return state;
    }
}
