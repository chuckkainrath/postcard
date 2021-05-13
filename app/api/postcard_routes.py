from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Postcard, User
from app.aws import (upload_photo_to_s3,
                     delete_photo_from_s3)
from app.forms import PostcardForm

postcard_routes = Blueprint(('postcards'), __name__)

PHOTO_LIMIT = 40


@postcard_routes.route('/', methods=['POST'])
@login_required
def post_postcard():
    user_id = int(current_user.id)
    form = PostcardForm()
    form['csrf_token'].data = request.cookies['csrf_token']
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
    user_id = int(current_user.id)
    postcards_arr = Postcard.query.filter(Postcard.user_id == user_id).all()
    postcards = [postcard.to_dict() for postcard in postcards_arr]
    return { 'postcards': postcards }


@postcard_routes.route('/<int:postcard_id>', methods=['DELETE'])
def delete_postcard(postcard_id):
    user_id = int(current_user.id)
    postcard = Postcard.query.get(postcard_id)
    if postcard.user_id != user_id:
        return { 'errors': ['Cannot delete postcard. Postcard is not owned by user']}

    delete_photo_from_s3('postcard', postcard.postcard_front_url)
    delete_photo_from_s3('postcard', postcard.postcard_back_url)

    db.session.delete(postcard)
    db.session.commit()
    return { 'response': 'Postcard successfully deleted' }
