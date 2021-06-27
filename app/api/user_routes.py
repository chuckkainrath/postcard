from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import db, User, Photo

user_routes = Blueprint('users', __name__)


@user_routes.route('/<username>')
@login_required
def user(username):
    user = User.query.filter(User.username == username).first()
    sessionUser = int(current_user.id)
    # Get all photos if request comes from session user
    # Otherwise, just public photos
    if sessionUser == user.id:
        photos = Photo.query.filter(Photo.user_id == user.id).all()
        photos_dict = [photo.to_dict() for photo in photos]
        return { 'user': user.to_dict(), 'photos': photos_dict }

    # photos = Photo.query.filter(Photo.user_id == user.id and
    #                             Photo.public == True).all()
    # photos_dict = [photo.to_dict() for photo in photos]

    raw_photos = db.session.execute('''SELECT photos.*, likes.id FROM photos
                                       LEFT JOIN likes ON photos.id=likes.photo_id AND likes.user_id=:sessionUser
                                       WHERE public=true AND photos.user_id=:profileUser''',
                                    {'sessionUser': sessionUser, 'profileUser': user.id})

    photos_list = []
    for photo in raw_photos:
        photo_dict = {
            'id': photo[0],
            'photo_url': photo[1],
            'public': photo[2],
            'user_id': photo[3],
            'created_at': photo[4],
            'liked': photo[5]
        }
        photos_list.append(photo_dict)
    return { 'user': user.to_dict(), 'photos': photos_list }


@user_routes.route('/<string:username>/search')
def search_users(username):
    users = User.query.filter(User.username.ilike(f"%{username}%")).all()
    return { user.id: user.to_dict() for user in users}
