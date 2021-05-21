const GET_PHOTOS = 'photos/GET_PHOTOS'
const GET_PHOTO = 'photos/GET_PHOTO'
const POST_PHOTO = 'photos/POST_PHOTO'
const DELETE_PHOTO = 'photos/DELETE_PHOTO'

const getPhotosAction = photos => ({
    type: GET_PHOTOS,
    payload: photos
})

const postPhotoAction = photo => ({
    type: POST_PHOTO,
    payload: photo
})

const deletePhotoAction = photoId => ({
    type: DELETE_PHOTO,
    payload: photoId
})

export const postPhoto = (photo, pvtPhoto) => async dispatch => {
    const form = new FormData();
    const picType = photo.type;
    const ext = picType.split('/')[1];
    const picFile = new File([photo], `newphoto.${ext}`);
    form.append('photo', picFile);
    form.append('public', !pvtPhoto);
    const response = await fetch('/api/photos/', {
        method: 'POST',
        body: form
    });
    const data = await response.json();
    if (data.errors) {
        console.log('PHOTO UPLOAD ERRER', data.errors);
        return;
    }
    dispatch(postPhotoAction(data.photo))
}

export const getPhotos = () => async dispatch => {
    const response = await fetch('/api/photos/');
    const data = await response.json();
    if (data.errors) {
        console.log('ERROR RETRIEVING PHOTOS', data.errors);
        return;
    }
    const flatPhotos = flattenPhotos(data.photos);
    dispatch(getPhotosAction(flatPhotos));
}

export const deletePhoto = photoId => async dispatch => {
    const res = await fetch(`/api/photos/${photoId}`, { method: 'DELETE'});
    const data = await res.json();
    if (data.errors) {
        console.log('PHOTO ERRORS', data.errors);
        return;
    }
    dispatch(deletePhotoAction(photoId));
}

export const flattenPhotos = photos => {
    const flatPhotos = {};
    photos.forEach(photo => {
        flatPhotos[photo.id] = photo
    });
    return flatPhotos;
}

const initialState = { photos: null }

export default function reducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case GET_PHOTOS:
            return { photos: action.payload }
        case GET_PHOTO:
            return initialState; // TODO: COMPELTE ROUTE
        case POST_PHOTO:
            newState = Object.assign({}, state);
            if (!newState.photos) {
                newState.photos = {}
            }
            newState.photos[action.payload.id] = action.payload
            return newState;
        case DELETE_PHOTO:
            newState = Object.assign({}, state);
            delete newState.photos[action.payload];
            return newState;
        default:
            return state
    }
}
