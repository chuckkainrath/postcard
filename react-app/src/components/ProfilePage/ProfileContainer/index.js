import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

function ProfileContainer() {
    const dispatch = useDispatch();
    const { username } = useParams();
    const user = useSelector(state => state.session.user);
    const userProfile = user.username == username;

    useEffect(() => {
        //dispatch(/* write dispatch for getting profile information*/)
    }, [username])


    return (
        <div>
            {userProfile && <h1>My Profile</h1>}
            {!userProfile && <h1>{username}'s Profile</h1>}
        </div>
    )
}

export default ProfileContainer;
