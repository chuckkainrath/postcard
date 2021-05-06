import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../../../store/profile';
import MyProfile from '../MyProfile';
import OtherProfile from '../OtherProfile';

function ProfileContainer() {
    const dispatch = useDispatch();
    const { username } = useParams();
    const user = useSelector(state => state.session.user);
    const userProfile = user.username == username;

    useEffect(() => {
        dispatch(getProfile(username))
    }, [username])

    return (
        <div>
            {userProfile && <MyProfile />}
            {!userProfile && <OtherProfile />}
        </div>
    )
}

export default ProfileContainer;
