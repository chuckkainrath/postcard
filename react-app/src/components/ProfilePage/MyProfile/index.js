import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './MyProfile.module.css';
import PhotoCard from '../../MainPage/PhotoCard';
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
    const postcardsDict = useSelector(state => state.postcards.postcards);
    const [category, setCategory] = useState('photo-public');
    const [postcards, setPostcards] = useState([]);
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
        setPostcards(Object.values(postcardsDict));
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
                        <PhotoCard key={photo.id} photo={photo} />
                    ))}

                </div>
            }
            {category === 'photo-private' &&
                <div className={styles.photos__container}>
                    {privatePhotos && privatePhotos.map(photo => (
                        <PhotoCard key={photo.id} photo={photo} />
                    ))}
                </div>
            }
            {category === 'postcards' &&
                <div>
                    {postcards && postcards.map(card => {
                        return <img src={card.postcard_front_url}
                                    key={card.id} />
                    })}
                </div>
            }
        </div>
    );
}

export default MyProfile;
