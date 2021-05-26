import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addFollow, deleteFollow } from '../../../store/followers';
import ProfileCard from '../ProfileCard';
import styles from './OtherProfile.module.css';
import blankProfile from '../../MainPage/PhotoCard/blank-profile-img.png';

function OtherProfile() {
    const dispatch = useDispatch();
    const { profile, photos } = useSelector(state => state.profile);
    const followingDict = useSelector(state => state.follows.following);
    const [following, setFollowing] = useState(profile.id in followingDict);
    const [ profileImg, setProfileImg ] = useState(profile.profile_img_url ? profile.profile_img_url : blankProfile)
    const [ photosArr, setPhotosArr ] = useState(
        photos ? Object.values(photos).reverse() : []
    );

    useEffect(() => {
        setPhotosArr(photos ? Object.values(photos).reverse() : [])
    }, [photos])

    useEffect(() => {
        setFollowing(profile.id in followingDict)
        console.log('FOLLOWING DICT', followingDict);
    }, [followingDict, profile])

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
                <div className={styles.profile__header}>
                    {profile.profile_img_url &&
                        <img src={profileImg}/>
                    }
                    <span>{profile.username}'s Profile</span>
                    {following &&
                        <button className={styles.follow__btn} onClick={unfollow}>Unfollow</button>
                    }
                    {!following &&
                        <button className={styles.follow__btn} onClick={follow}>Follow</button>
                    }
                </div>
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
