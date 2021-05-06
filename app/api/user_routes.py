from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User, Photo

user_routes = Blueprint('users', __name__)


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    sessionUser = int(current_user)
    # Get all photos if request comes from session user
    # Otherwise, just public photos
    if sessionUser == user.id:
        photos = Photo.query.filter(Photo.user_id == user.id).all()
    else:
        photos = Photo.query.filter(Photo.user_id == user.id and
                                    Photo.public == True).all()
    photos_dict = [photo.to_dict for photo in photos]
    return { 'user': user.to_dict(), 'photos': photos_dict }
