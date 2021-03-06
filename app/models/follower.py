from .db import db
from datetime import datetime


class Follower(db.Model):
    __tablename__ = 'followers'

    id = db.Column(db.Integer, primary_key = True)
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'),nullable=False)
    followed_id = db.Column(db.Integer, db.ForeignKey('users.id'),nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow,
                            nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
			'follower_id': self.follower_id,
            'followed_id': self.followed_id,
            'created_at': self.created_at,
        }
