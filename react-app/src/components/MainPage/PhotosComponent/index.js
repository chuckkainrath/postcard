import React from 'react';
import { useSelector } from 'react-redux';

function PhotosComponent() {
    const user = useSelector(state => state.session.user);

    return (
        <div>
            <h1>Hello World</h1>
            <img src={user.profile_img_url} />
        </div>
    );
}

export default PhotosComponent;
