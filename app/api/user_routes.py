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
        raw_photos = db.session.execute('''SELECT photos.*, users.profile_img_url, liked.id as liked_id,
                                    COUNT(likes_count.photo_id) as like_count
                                    FROM photos
                                    JOIN users on users.id=:profileUser
                                    LEFT JOIN likes liked ON liked.user_id=:sessionUser AND liked.photo_id=photos.id
                                    LEFT JOIN likes likes_count ON likes_count.photo_id=photos.id
                                    WHERE photos.user_id=:profileUser
                                    GROUP BY liked.id, users.profile_img_url, photos.id''',
                                    {'sessionUser': sessionUser, 'profileUser': user.id})
        photos_list = []
        for photo in raw_photos:
            photo_dict = {
                'id': photo[0],
                'photo_url': photo[1],
                'public': photo[2],
                'user_id': photo[3],
                'created_at': photo[4],
                'profile_img_url': photo[5],
                'liked': photo[6],
                'like_count': photo[7]
            }
            photos_list.append(photo_dict)
        return { 'user': user.to_dict(), 'photos': photos_list }

    # Just get public photos from other user's profile
    raw_photos = db.session.execute('''SELECT photos.*, users.profile_img_url, liked.id as liked_id,
                                    COUNT(likes_count.photo_id) as like_count
                                    FROM photos
                                    JOIN users on users.id=:profileUser
                                    LEFT JOIN likes liked ON liked.user_id=:sessionUser AND liked.photo_id=photos.id
                                    LEFT JOIN likes likes_count ON likes_count.photo_id=photos.id
                                    WHERE photos.public=true AND photos.user_id=:profileUser
                                    GROUP BY liked.id, users.profile_img_url, photos.id''',
                                    {'sessionUser': sessionUser, 'profileUser': user.id})


    photos_list = []
    for photo in raw_photos:
        photo_dict = {
            'id': photo[0],
            'photo_url': photo[1],
            'public': photo[2],
            'user_id': photo[3],
            'created_at': photo[4],
            'profile_img_url': photo[5],
            'liked': photo[6],
            'like_count': photo[7]
        }
        photos_list.append(photo_dict)
    return { 'user': user.to_dict(), 'photos': photos_list }


@user_routes.route('/<string:username>/search')
def search_users(username):
    users = User.query.filter(User.username.ilike(f"%{username}%")).all()
    return { user.id: user.to_dict() for user in users}
