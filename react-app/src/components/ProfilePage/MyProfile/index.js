import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './MyProfile.module.css';
import ProfileCard from '../ProfileCard';
import PostcardCard from '../PostcardCard';
import { getPostcards } from '../../../store/postcards';

const photoFilter = (photos, photoType) => {
    return photos.filter(photo => {
        if (photo.public) {
            return photoType === 'public';
        } else {
            return photoType === 'private';
        }
    });
}

function MyProfile() {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile);
    const postcardsDict = useSelector(state => state.postcards);
    const [category, setCategory] = useState('photo-public');
    const [postcards, setPostcards] = useState(
        postcardsDict ? Object.values(postcardsDict.postcards) : []
    );
    const [publicPhotos, setPublicPhotos] = useState(
        profile.photos ? photoFilter(Object.values(profile.photos), 'public') : []
    );
    const [privatePhotos, setPrivatePhotos] = useState(
        profile.photos ? photoFilter(Object.values(profile.photos), 'private') : []
    );

    useEffect(() => {
        dispatch(getPostcards());
    }, [])

    useEffect(() => {
        setPostcards(postcardsDict ? Object.values(postcardsDict.postcards) : [])
    }, [postcardsDict]);

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
            {category === 'postcards' &&
                <div className={styles.photos__container}>
                    {postcards && postcards.map(card => (
                        <PostcardCard postcard={card} key={card.id} />
                    ))}
                </div>
            }
        </div>
    );
}

export default MyProfile;
