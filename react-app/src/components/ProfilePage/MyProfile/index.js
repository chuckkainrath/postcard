import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './MyProfile.module.css';
import ProfileCard from '../ProfileCard';
import PhotoCard from '../../MainPage/PhotoCard';
import PostcardCard from '../PostcardCard';
import { getPostcards } from '../../../store/postcards';
import { getLikedPhotos } from '../../../store/photos';

const photoFilter = (photos, photoType) => {
    return photos.filter(photo => {
        if (photo.public) {
            return photoType === 'public';
        } else {
            return photoType === 'private';
        }
    });
}

const postcardFilter = (postcards) => {
    const fPostcards = {};
    postcards.forEach(card => {
        if (!fPostcards[card.postcard_front_url]) {
            fPostcards[card.postcard_front_url] = [card]
        } else {
            fPostcards[card.postcard_front_url].push(card);
        }
    });
    return fPostcards;
}

function MyProfile() {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile);
    const photos = useSelector(state => state.photos);
    const postcardsDict = useSelector(state => state.postcards);
    const [category, setCategory] = useState('photo-public');
    const [likedPhotos, setLikedPhotos] = useState(
        photos.likedPhotos ? Object.values(photos.likedPhotos) : []
    );
    const [postcards, setPostcards] = useState(
        postcardsDict ? postcardFilter(Object.values(postcardsDict.postcards)) : {}
    );
    const [publicPhotos, setPublicPhotos] = useState(
        profile.photos ? photoFilter(Object.values(profile.photos), 'public') : []
    );
    const [privatePhotos, setPrivatePhotos] = useState(
        profile.photos ? photoFilter(Object.values(profile.photos), 'private') : []
    );

    useEffect(() => {
        dispatch(getPostcards());
        dispatch(getLikedPhotos());
    }, []);

    useEffect(() => {
        setPostcards(postcardsDict ? postcardFilter(Object.values(postcardsDict.postcards)) : {})
    }, [postcardsDict]);

    useEffect(() => {
        setLikedPhotos(photos.likedPhotos ? Object.values(photos.likedPhotos) : []);
    }, [photos])

    useEffect(() => {
        setPrivatePhotos(
            profile.photos ? photoFilter(Object.values(profile.photos), 'private') : []
        );
        setPublicPhotos(
            profile.photos ? photoFilter(Object.values(profile.photos), 'public') : []
        );
    }, [profile])

    const setPictureCategory = (cat) => {
        const lastNode = document.getElementById(category);
        lastNode.classList.remove(styles.category_selection__selected)
        setCategory(cat);
        const selectedNode = document.getElementById(cat);
        selectedNode.classList.add(styles.category_selection__selected);
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
            {category === 'photo-public' &&
                <div className={styles.photos__container}>
                    {publicPhotos && publicPhotos.map(photo => (
                        <ProfileCard userProfile={true} key={photo.id} photo={photo} />
                    ))}
                </div>
            }
            {category === 'photo-private' &&
                <div className={styles.photos__container}>
                    {privatePhotos && privatePhotos.map(photo => (
                        <ProfileCard userProfile={true} key={photo.id} photo={photo} />
                    ))}
                </div>
            }
            {category === 'liked-photos' &&
                <div className={styles.photos__container}>
                    {likedPhotos && likedPhotos.map(photo => (
                        <PhotoCard userProfile={false} key={photo.id} photo={photo} />
                    ))}
                </div>
            }
            {category === 'postcards' &&
                <div className={styles.photos__container}>
                    {postcards && Object.keys(postcards).map((key, idx) => (
                        <PostcardCard cards={postcards[key]} key={idx} />
                    ))}
                </div>
            }
        </div>
    );
}

export default MyProfile;
