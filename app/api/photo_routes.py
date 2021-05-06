from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Photo
from app.aws import upload_photo_to_s3, valid_file_type, get_unique_filename
from app.forms import PhotoForm

photo_routes = Blueprint(('photos'), __name__)


PHOTO_LIMIT = 40


@photo_routes('/')
@login_required
def get_public_photos():
    photos = Photo.query(Photo).limit(PHOTO_LIMIT).all()
    photos_dict = [photo.to_dict() for photo in photos]
    return { 'photos': photos_dict }


@photo_routes('/:<int:photo_id>')
@login_required
def get_photo(photo_id):
    photo = Photo.query.get(photo_id)
    return { 'photo': photo.to_dict() }


@photo_routes('/', methods=['POST'])
@login_required
def post_photo():
    user_id = int(current_user.id)
    photo_file = request.files.get('photo')
    form = PhotoForm()
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
