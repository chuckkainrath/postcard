from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, User, Follower


follow_routes = Blueprint(('follows'), __name__)


@follow_routes.route('/')
@login_required
def get_follows():
    user_id = int(current_user.id)

    raw_followers = db.session.execute('''SELECT followers.*, users.username, users.profile_img_url FROM followers
                                          JOIN users ON followers.follower_id=users.id
                                          WHERE followers.followed_id=user_id''', {'user_id': user_id})

    raw_following = db.session.execute('''SELECT followers.*, users.username, users.profile_img_url FROM followers
                                          JOIN users ON followers.followed_id=users.id
                                          WHERE followers.follower_id=user_id''', {'user_id': user_id})

    followers = []
    for follower in raw_followers:
        follower_dict = {
            'id': follower[0],
            'follower_id': follower[1],
            'followed_id': follower[2],
            'created_at': follower[3],
            'username': follower[5],
            'profile_img_url': follower[6],
        }
        followers.append(follower_dict)

    followings = []
    for following in raw_followers:
        following_dict = {
            'id': following[0],
            'follower_id': following[1],
            'followed_id': following[2],
            'created_at': following[3],
            'username': following[5],
            'profile_img_url': following[6],
        }
        followings.append(following_dict)

    return { 'followers': followers, 'following': following }


@follow_routes.route('/', methods=["POST"])
@login_required
def add_following():
    followed_id = request.get_json()['followedId']
    user_id = int(current_user.id)
    newFollower = Follower(
        follower = user_id,
        followed = followed_id
    )
    db.session.add(newFollower)
    db.session.commit()
    followed = User.query.get(followed_id)
    newFollowerDict = newFollower.to_dict()
    newFollowerDict['username'] = followed.username
    newFollowerDict['profile_img_url'] = followed.profile_img_url
    return { 'follow': newFollowerDict }


@follow_routes.route('/<int:follow_id>', methods=["DELETE"])
@login_required
def delete_following(follow_id):
    user_id = int(current_user.id)
    follow = Follower.query.get(follow_id)
    if not follow:
        return { 'errors': ['Follow_id does not exist']}

    if follow.follower_id != user_id:
        return { 'errors': ['Incorrect user']}

    db.session.delete(follow)
    db.session.commit()
    return { 'response': 'unfollow successful'}
