import { deleteProfileImageAction } from './profile';

const GET_PHOTOS = 'photos/GET_PHOTOS';
const GET_PHOTO = 'photos/GET_PHOTO';
const POST_PHOTO = 'photos/POST_PHOTO';
const DELETE_PHOTO = 'photos/DELETE_PHOTO';
const LIKE_PHOTO = 'photos/LIKE';
const UNLIKE_PHOTO = 'photos/UNLIKE';
const GET_LIKED_PHOTOS = 'photos/GET_LIKED';

const likePhotoAction = (photoId, likedId) => ({
    type: LIKE_PHOTO,
    photoId,
    likedId
});

const unlikePhotoAction = photoId => ({
    type: UNLIKE_PHOTO,
    payload: photoId
})

const getLikedPhotosAction = photos => ({
    type: GET_LIKED_PHOTOS,
    payload: photos
})

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
        return;
    }
    dispatch(postPhotoAction(data.photo))
    return data.photo;
}

export const likePhoto = photoId => async dispatch => {
    const response = await fetch(`/api/photos/${photoId}/like`, {method: 'POST'});
    const data = await response.json();
    if (data.errors) {
        return;
    }
    dispatch(likePhotoAction(photoId, data.liked_id));
    return data.liked_id;
}

export const unlikePhoto = photoId => async dispatch => {
    const response = await fetch(`/api/photos/${photoId}/unlike`, {method: 'DELETE'});
    const data = await response.json();
    if (data.errors) {
        return;
    }
    dispatch(unlikePhotoAction(photoId));
}

export const getLikedPhotos = () => async dispatch => {
    const response = await fetch('/api/photos/liked');
    const data = await response.json();
    if (data.errors) {
        return;
    }
    const flatPhotos = flattenPhotos(data.photos);
    dispatch(getLikedPhotosAction(flatPhotos));
}

export const getPhotos = () => async dispatch => {
    const response = await fetch('/api/photos/');
    const data = await response.json();
    if (data.errors) {
        return;
    }
    const flatPhotos = flattenPhotos(data.photos);
    dispatch(getPhotosAction(flatPhotos));
}

export const deletePhoto = photoId => async dispatch => {
    const res = await fetch(`/api/photos/${photoId}`, { method: 'DELETE'});
    const data = await res.json();
    if (data.errors) {
        return;
    }
    dispatch(deletePhotoAction(photoId));
    dispatch(deleteProfileImageAction(photoId));
}

export const flattenPhotos = photos => {
    const flatPhotos = {};
    photos.forEach(photo => {
        flatPhotos[photo.id] = photo
    });
    return flatPhotos;
}

const initialState = { photos: null,
                       likedPhotos: null
                     }

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
        case LIKE_PHOTO:
            newState = Object.assign({}, state);
            if (newState.photos[action.photoId]) {
                newState.photos[action.photoId].liked = action.likedId;
                newState.photos[action.photoId].like_count++;
            }
            if (!newState.likedPhotos) newState.likedPhotos = {};
            newState.likedPhotos[action.photoId] = newState.photos[action.photoId];
            return newState;
        case UNLIKE_PHOTO:
            newState = Object.assign({}, state);
            if (newState.photos[action.payload]) {
                newState.photos[action.payload].liked = null;
                newState.photos[action.payload].like_count--;
            }
            if (newState.likedPhotos && newState.likedPhotos[action.payload]) {
                delete newState.likedPhotos[action.payload];
            }
            return newState;
        case GET_LIKED_PHOTOS:
            newState = Object.assign({}, state);
            newState.likedPhotos = action.payload;
            return newState;
        default:
            return state;
    }
}
