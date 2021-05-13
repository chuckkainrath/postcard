from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Postcard, User
from app.aws import (upload_photo_to_s3,
                     valid_file_type,
                     get_unique_filename)
from app.forms import PostcardForm

postcard_routes = Blueprint(('postcards'), __name__)

PHOTO_LIMIT = 40


@postcard_routes.route('/', methods=['POST'])
@login_required
def post_postcard():
    user_id = int(current_user.id)
    form = PostcardForm()
    if form.validate_on_submit():
        # Send photos to aws
        pc_front = request.files.get('card_front', '')
        pc_back = request.files.get('card_back', '')

        front_upload = upload_photo_to_s3(pc_front, 'postcard')
        front_url = front_upload['photo_url'] if front_upload['photo_url'] else ''
        if not front_url:
            return { 'errors': ['Image upload to aws failed']}

        back_upload = upload_photo_to_s3(pc_back, 'postcard')
        back_url = back_upload['photo_url'] if back_upload['photo_url'] else ''
        if not back_url:
            # Delete front image before returning ?
            return { 'errors': ['Image upload to aws failed']}

        postcard = Postcard(
            user_id = user_id,
            postcard_front_url = front_url,
            postcard_back_url = back_url
        )
        db.session.add(postcard)
        db.session.commit()
        postcard_dict = postcard.to_dict()
        return { 'postcard': postcard_dict }
    return { 'errors': ['Invalid postcard form']}


@postcard_routes.route('/', methods=['GET'])
def get_postcards():
    pass
