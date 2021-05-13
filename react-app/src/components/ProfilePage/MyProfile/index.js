import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './MyProfile.module.css';
import { getPostcards } from '../../../store/postcards';

function MyProfile() {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile);
    const postcardsDict = useSelector(state => state.postcards.postcards);
    const [category, setCategory] = useState('photos');
    const [postcards, setPostcards] = useState([]);
    const [photos, setPhotos] = useState(
        profile.photos ? Object.values(profile.photos) : []
    );

    useEffect(() => {
        dispatch(getPostcards());
    }, [])

    useEffect(() => {
        setPostcards(Object.values(postcardsDict));
    }, [postcardsDict]);

    useEffect(() => {
        setPhotos(
            profile.photos ? Object.values(profile.photos) : []
        )
    }, [profile])

    return (
        <div>
            <h1>My Profile</h1>
            <button onClick={() => setCategory('photos')}>Photos</button>
            <button onClick={() => setCategory('postcards')}>Postcards</button>
            {category === 'photos' &&
                <div>
                    <h2>My Public Photos</h2>
                    {photos && photos.map(photo => {
                        if (photo.public) {
                            return <img key={photo.id}
                                        src={photo.photo_url}
                                        className={styles.photo_size}
                                    />
                        }
                    })}
                    <br />
                    <h2>My Private Photos</h2>
                    {photos && photos.map(photo => {
                        if (!photo.public) {
                            return <img key={photo.id}
                                        src={photo.photo_url}
                                        className={styles.photo_size}
                                    />
                        }
                    })}
                </div>
            }
            {category === 'postcards' &&
                <div>
                    <h1>My Postcards</h1>
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
