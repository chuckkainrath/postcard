from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Photo, User, Like, photo
from app.aws import (upload_photo_to_s3,
                     valid_file_type,
                     get_unique_filename,
                     delete_photo_from_s3)
from app.forms import PhotoForm

photo_routes = Blueprint(('photos'), __name__)


PHOTO_LIMIT = 40


@photo_routes.route('/')
@login_required
def get_public_photos():
    # photos = Photo.query(Photo, User).filter(Photo.public == True).limit(PHOTO_LIMIT).all()
    user_id = int(current_user.id)
    raw_photos = db.session.query(Photo, User).join(User) \
                   .filter(Photo.public == True and User.id == user_id).limit(PHOTO_LIMIT).all()
    # raw_photos = db.session.query(Photo, User, Like).join(User).join(Like) \
    #                .filter(Photo.public == True and User.id == user_id).limit(PHOTO_LIMIT).all()
    photos_list = []
    for (photo, user) in raw_photos:
        photo_dict = photo.to_dict()
        photo_dict['username'] = user.username
        photo_dict['profile_img_url'] = user.profile_img_url
        photos_list.append(photo_dict)
    return { 'photos': photos_list}


# @photo_routes.route('/:<int:photo_id>')
# @login_required
# def get_photo(photo_id):
#     photo = Photo.query.get(photo_id)
#     return { 'photo': photo.to_dict() }


@photo_routes.route('/', methods=['POST'])
@login_required
def post_photo():
    user_id = int(current_user.id)
    photo_file = request.files.get('photo')
    form = PhotoForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if not form.validate_on_submit():
        return { 'errors': ['Invalid form data']}

    if (not valid_file_type(photo_file.filename)):
        return { 'errors': ['Invalid file type'] }

    photo_file.filename = get_unique_filename(photo_file.filename)
    upload_response = upload_photo_to_s3(photo_file, 'photo')
    if (not upload_response['photo_url']):
        return { 'errors': ['Photo upload failed']}

    photo = Photo(
        user_id = user_id,
        photo_url = upload_response['photo_url'],
        public = form.data['public']
    )
    db.session.add(photo)
    db.session.commit()
    return { 'photo': photo.to_dict() }


@photo_routes.route('/<int:photo_id>', methods=['DELETE'])
@login_required
def delete_photo(photo_id):
    # TODO: DELETE ALL LIKES ASSOCIATE WITH PHOTO
    user_id = int(current_user.id)
    photo = Photo.query.get(photo_id)
    if user_id != photo.user_id:
        return { 'errors': ['Photo does not belong to user']}

    photo_url = photo.photo_url
    filename = photo_url.rsplit('/', 1)[-1]
    try:
        delete_photo_from_s3('photo', filename)
    except Exception as e:
        print(e)

    db.session.delete(photo)
    db.session.commit()
    return { 'response': 'Photo successfully deleted' }


@photo_routes.route('/<int:photo_id>', methods=['POST'])
@login_required
def like_photo(photo_id):
    user_id = int(current_user.id)
    like = Like.query.filter(user_id == Like.user_id and
                             photo_id == Like.photo_id).first()
    if like:
        return { 'errors': ['Photo already liked']}

    like = Like(
        user_id = user_id,
        photo_id = photo_id
    )
    db.session.add(like)
    db.session.commit()
    return { 'response': 'photo liked' }

@photo_routes.route('/<int:photo_id>', methods=['DELETE'])
def unlike_photo(photo_id):
    user_id = int(current_user.id)
    like = Like.query.filter(user_id == Like.user_id and
                             photo_id == Like.photo_id).first()
    if not like:
        return { 'errors': ['Photo not liked']}

    db.session.delete(like)
    db.session.commit()
    return { 'response': 'photo unliked' }
