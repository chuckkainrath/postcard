const GET_FOLLOWS = 'follows/GET_FOLLOWERS';
const ADD_FOLLOW = 'follows/ADD_FOLLOWER';
const DELETE_FOLLOW = 'follows/DELETE_FOLLOWERS';

const getFollowsAction = (followers, following) => ({
    type: GET_FOLLOWS,
    followers,
    following
});

const addFollowAction = follower => ({
    type: ADD_FOLLOW,
    payload: follower
});

const deleteFollowAction = followerId => ({
    type: DELETE_FOLLOW,
    payload: followerId
});

export const getFollows = () => async dispatch => {
    const res = await fetch('/api/follows/');
    const data = await res.json();
    if (data.errors) {
        return;
    }
    const followers = flattenFollows(data.followers);
    const following = flattenFollows(data.following);
    dispatch(getFollowsAction(followers, following));
}

export const addFollow = (followedId) => async dispatch => {
    const res = await fetch('/api/follows/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ followedId })
    });
    const data = await res.json();
    if (data.errors) {
        return;
    }
    dispatch(addFollowAction(data.follow))
}

export const deleteFollow = (followedId) => async dispatch => {
    const res = await fetch(`/api/follows/${followedId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.errors) {
        return;
    }
    dispatch(deleteFollowAction(followedId));
}

const flattenFollows = followers => {
    const fFollows = {}
    followers.forEach(follower => {
        fFollows[follower.id] = follower;
    });
    return fFollows;
}

const initialState = {
    followers: null,
    following: null
}

export default function reducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case GET_FOLLOWS:
            return { followers: action.followers, following: action.following };
        case ADD_FOLLOW:
            newState = Object.assign({}, state);
            newState.following[action.payload.id] = action.payload;
            return newState;
        case DELETE_FOLLOW:
            newState = Object.assign({}, state);
            delete newState.following[action.payload];
            return newState;
        default:
            return state;
    }
}
