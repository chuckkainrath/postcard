import { flattenPhotos } from './photos';

const GET_PROFILE = 'profile/GET_PROFILE';

const getProfileAction = (user, photos) => ({
    type: GET_PROFILE,
    user,
    photos
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
        default:
            return state;
    }
}
