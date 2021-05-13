from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Postcard, User
from app.aws import (upload_photo_to_s3,
                     valid_file_type,
                     get_unique_filename)
from app.forms import PostcardForm

photo_routes = Blueprint(('photos'), __name__)


PHOTO_LIMIT = 40


@photo_routes.route('/')
@login_required
def get_public_photos():
    #photos = Photo.query(Photo, User).filter(Photo.public == True).limit(PHOTO_LIMIT).all()
    raw_photos = db.session.query(Photo, User).join(User).filter(Photo.public == True) \
                   .limit(PHOTO_LIMIT).all()
    photos_list = []
    for (photo, user) in raw_photos:
        photo_dict = photo.to_dict()
        photo_dict['username'] = user.username
        photo_dict['profile_img_url'] = user.profile_img_url
        photos_list.append(photo_dict)
    return { 'photos': photos_list}
