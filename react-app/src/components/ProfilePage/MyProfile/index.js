import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styles from './MyProfile.module.css';
import ProfileCard from '../ProfileCard';
import PhotoCard from '../../MainPage/PhotoCard';
import PostcardCard from '../PostcardCard';
import { getPostcards } from '../../../store/postcards';
import { getLikedPhotos } from '../../../store/photos';
import { deleteFollow } from '../../../store/followers';
import blankProfile from '../../MainPage/PhotoCard/blank-profile-img.png';

const photoFilter = (photos, photoType) => {
    if (!photos) return null;
    const filteredPhotos = photos.filter(photo => {
        if (photo.public) {
            return photoType === 'public';
        } else {
            return photoType === 'private';
        }
    });
    filteredPhotos.reverse();
    return filteredPhotos.length ? filteredPhotos : null;
}

const postcardFilter = (postcards) => {
    if (!postcards) return null;
    const fPostcards = {};
    postcards.forEach(card => {
        if (!fPostcards[card.postcard_front_url]) {
            fPostcards[card.postcard_front_url] = [card]
        } else {
            fPostcards[card.postcard_front_url].push(card);
        }
    });
    if (!Object.keys(fPostcards).length) return null;
    return fPostcards;
}

const followSort = (follows) => {
    if (!follows) return null;
    const sortedFollows = Object.values(follows);
    if (!sortedFollows.length) return null;
    sortedFollows.sort((follow1, follow2) => {
        return follow1.username.toLowerCase() - follow2.username.toLowerCase();
    })
    return sortedFollows;
}

const likeSort = likes => {
    if (!likes) return null;
    const sortedLikes = Object.values(likes);
    if (!sortedLikes.length) return null;
    sortedLikes.sort((like1, like2) => {
        return like2.liked - like1.liked;
    })
    return sortedLikes;
}

function MyProfile() {
    const dispatch = useDispatch();
    const history = useHistory();
    const profile = useSelector(state => state.profile);
    const photos = useSelector(state => state.photos);
    const postcardsDict = useSelector(state => state.postcards);
    const { followers, following } = useSelector(state => state.follows);
    const [category, setCategory] = useState('photo-public');
    const [followersArr, setFollowersArr] = useState([]);
    const [followingArr, setFollowingArr] = useState([]);
    const [likedPhotos, setLikedPhotos] = useState(
        photos.likedPhotos ? likeSort(photos.likedPhotos) : null
    );
    const [postcards, setPostcards] = useState(
        postcardsDict ? postcardFilter(Object.values(postcardsDict.postcards)) : null
    );
    const [publicPhotos, setPublicPhotos] = useState(
        profile.photos ? photoFilter(Object.values(profile.photos), 'public') : null
    );
    const [privatePhotos, setPrivatePhotos] = useState(
        profile.photos ? photoFilter(Object.values(profile.photos), 'private') : null
    );

    useEffect(() => {
        dispatch(getPostcards());
        dispatch(getLikedPhotos());
    }, []);

    useEffect(() => {
        setFollowingArr(followSort(following));
    }, [following])

    useEffect(() => {
        setFollowersArr(followSort(followers));
    }, [followers])

    useEffect(() => {
        setPostcards(postcardsDict ? postcardFilter(Object.values(postcardsDict.postcards)) : null)
    }, [postcardsDict]);

    useEffect(() => {
        setLikedPhotos(photos.likedPhotos ? likeSort(photos.likedPhotos) : null);
    }, [photos])

    useEffect(() => {
        setPrivatePhotos(
            profile.photos ? photoFilter(Object.values(profile.photos), 'private') : null
        );
        setPublicPhotos(
            profile.photos ? photoFilter(Object.values(profile.photos), 'public') : null
        );
    }, [profile])

    const setPictureCategory = (cat) => {
        const lastNode = document.getElementById(category);
        lastNode.classList.remove(styles.category_selection__selected)
        setCategory(cat);
        const selectedNode = document.getElementById(cat);
        selectedNode.classList.add(styles.category_selection__selected);
    }

    const unfollow = async follow => {
        await dispatch(deleteFollow(follow.id, follow.followed_id));
        const followCopy = Object.assign({}, following);
        delete followCopy[follow.id];
        setFollowingArr(followSort(followCopy));
    }

    return (
        <div className={styles.profile__container}>
            <h1>My Profile</h1>
            <div className={styles.category_selection}>
                <span
                    id='photo-public'
                    className={`${styles.category_selection__left} ${styles.category_selection__selected}`}
                    onClick={(e) => setPictureCategory('photo-public')}>Public Photos</span>
                <span
                    id='photo-private'
                    className={styles.category_selection__middle}
                    onClick={(e) => setPictureCategory('photo-private')}>Private Photos</span>
                <span
                    id='liked-photos'
                    onClick={(e) => setPictureCategory('liked-photos')}>Liked Photos</span>
                <span
                    id='postcards'
                    className={styles.category_selection__right}
                    onClick={(e) => setPictureCategory('postcards')}>Postcards</span>
            </div>
            <div className={styles.center__container}>
                {category === 'photo-public' &&
                    <div className={styles.photos__container}>
                        {publicPhotos && publicPhotos.map(photo => (
                            <ProfileCard userProfile={true} key={photo.id} photo={photo} />
                        ))}
                        {!publicPhotos &&
                            <h1>You don't have any public images!</h1>
                        }
                    </div>
                }
                {category === 'photo-private' &&
                    <div className={styles.photos__container}>
                        {privatePhotos && privatePhotos.map(photo => (
                            <ProfileCard userProfile={true} key={photo.id} photo={photo} />
                        ))}
                        {!privatePhotos &&
                            <h1>You don't have any private images!</h1>
                        }
                    </div>
                }
                {category === 'liked-photos' &&
                    <div className={styles.photos__container}>
                        {likedPhotos && likedPhotos.map(photo => (
                            <PhotoCard userProfile={false} key={photo.id} photo={photo} />
                        ))}
                        {!likedPhotos &&
                            <h1>You don't have any liked photos!</h1>
                        }
                    </div>
                }
                {category === 'postcards' &&
                    <div className={styles.photos__container}>
                        {postcards && Object.keys(postcards).map((key, idx) => (
                            <PostcardCard cards={postcards[key]} key={idx} />
                        ))}
                        {!postcards &&
                            <h1>You don't have any postcards!</h1>
                        }
                    </div>
                }
            </div>
            <div className={styles.left__container}>
                <h1>Following</h1>
                <div className={styles.follows__container}>
                    {followingArr && followingArr.map(follow => {
                        return (
                            <div className={styles.following__container}>
                                {follow.profile_img_url &&
                                    <img onClick={() => history.push(`/profiles/${follow.username}`)} className={styles.follow__profile_img} src={follow.profile_img_url}/>
                                }
                                {!follow.profile_img_url &&
                                    <img onClick={() => history.push(`/profiles/${follow.username}`)} className={styles.follow__profile_img} src={blankProfile}/>
                                }
                                <span className={styles.follow__name} onClick={() => history.push(`/profiles/${follow.username}`)} key={follow.id}>{follow.username}</span>
                                <button className={styles.unfollow} onClick={() => unfollow(follow)}>Unfollow</button>
                            </div>
                        )
                    })}
                    {!followingArr &&
                        <h1 className={styles.no_follow}>You aren't following anyone</h1>
                    }
                </div>
            </div>
            <div className={styles.right__container}>
                <h1>Followers</h1>
                <div className={styles.follows__container}>
                    {followersArr && followersArr.map(follow => {
                        return (
                            <div className={styles.follower__container}>
                                {follow.profile_img_url &&
                                    <img className={styles.follower__img} onClick={() => history.push(`/profiles/${follow.username}`)} className={styles.follow__profile_img} src={follow.profile_img_url}/>
                                }
                                {!follow.profile_img_url &&
                                    <img className={styles.follower__img} onClick={() => history.push(`/profiles/${follow.username}`)} className={styles.follow__profile_img} src={blankProfile}/>
                                }
                                <span className={styles.follow__name} onClick={() => history.push(`/profiles/${follow.username}`)} key={follow.id}>{follow.username}</span>
                            </div>
                        )
                    })}
                    {!followingArr &&
                        <h1 className={styles.no_follow}>You don't have any followers</h1>
                    }
                </div>
            </div>
        </div>
    );
}

export default MyProfile;
