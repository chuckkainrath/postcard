import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addFollow, deleteFollow } from '../../../store/followers';
import { Button } from 'react-bootstrap';
import ProfileCard from '../ProfileCard';
import styles from './OtherProfile.module.css';
import blankProfile from '../../MainPage/PhotoCard/blank-profile-img.png';

function OtherProfile() {
    const dispatch = useDispatch();
    const { profile, photos } = useSelector(state => state.profile);
    const followingDict = useSelector(state => state.follows.following);
    const [following, setFollowing] = useState(profile && profile.id in followingDict);
    const [ photosArr, setPhotosArr ] = useState(
        photos ? Object.values(photos).reverse() : []
    );

    useEffect(() => {
        setPhotosArr(photos ? Object.values(photos).reverse() : [])
    }, [photos])

    useEffect(() => {
        setFollowing(profile && profile.id in followingDict)
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
                        <img src={profile.profile_img_url}/>
                    }
                    {!profile.profile_img_url &&
                        <img src={blankProfile}/>
                    }
                    <span>{profile.username}'s Profile</span>
                    {following &&
                        <Button className={styles.follow__btn} onClick={unfollow}>Unfollow</Button>
                    }
                    {!following &&
                        <Button className={styles.follow__btn} onClick={follow}>Follow</Button>
                    }
                </div>
            }
            <div className={styles.photos__container}>
                {photosArr && photosArr.map(photo => {
                    return <ProfileCard userProfile={false} key={photo.id} photo={photo} />
                })}
            </div>
            {!photosArr.length &&
                <h1 className={styles.no_photo_public}>{profile.username} has no public photos</h1>
            }
        </div>
    );
}

export default OtherProfile;
