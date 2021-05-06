const GET_PHOTOS = 'photos/GET_PHOTOS'
const GET_PHOTO = 'photos/GET_PHOTO'
const POST_PHOTO = 'photos/POST_PHOTO'
const DELETE_PHOTO = 'photos/DELETE_PHOTO'

const getPhotosAction = photos => ({
    type: GET_PHOTOS,
    payload: photos
})

export const getPhotos = () => async dispatch => {
    const response = await fetch('/api/photos/');
    const data = await response.json();
    if (data.errors) {
        console.log('ERROR RETRIEVING PHOTOS', data.errors);
        return;
    }
    dispatch(getPhotosAction(flattenPhotos(data.photos)));
}

const flattenPhotos = photos => {
    
}

const initialState = { photos: null }

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_PHOTOS:

        case GET_PHOTO:

        case POST_PHOTO:

        case DELETE_PHOTO:

        default:
            return state
    }
}
