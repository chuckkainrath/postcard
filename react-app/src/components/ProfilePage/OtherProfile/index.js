import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addFollow, deleteFollow } from '../../../store/followers';
import ProfileCard from '../ProfileCard';
import styles from './OtherProfile.module.css';

function OtherProfile() {
    const dispatch = useDispatch();
    const { profile, photos } = useSelector(state => state.profile);
    const followingDict = useSelector(state => state.follows.following);
    const [following, setFollowing] = useState(profile.id in followingDict);
    const [ photosArr, setPhotosArr ] = useState(
        photos ? Object.values(photos).reverse() : []
    );

    useEffect(() => {
        setPhotosArr(photos ? Object.values(photos).reverse() : [])
    }, [photos])

    useEffect(() => {
        setFollowing(followingDict[profile.id] ? true : false)
    }, [followingDict])

    const follow = async () => {
        await dispatch(addFollow(profile.id));
        setFollowing(true);
    }

    const unfollow = async () => {
        await dispatch(deleteFollow(followingDict[profile.id].id, profile.id))
        setFollowing(false);
    }

    return (
        <div className={styles.profile__container}>
            {profile &&
                <h1>{profile.username}'s Profile</h1>
            }
            {following &&
                <button onClick={unfollow}>Unfollow</button>
            }
            {!following &&
                <button onClick={follow}>Follow</button>
            }
            <div className={styles.photos__container}>
                {photosArr && photosArr.map(photo => {
                    return <ProfileCard userProfile={false} key={photo.id} photo={photo} />
                })}
            </div>
        </div>
    );
}

export default OtherProfile;
