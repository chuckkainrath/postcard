from .db import db
from datetime import datetime


class Like(db.Model):
    __tablename__ = 'likes'

    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),nullable=False)
    photo_id = db.Column(db.Integer, db.ForeignKey('photos.id'),nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow,
                            nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
			'user_id': self.user_id,
            'photo_id': self.photo_id,
            'created_at': self.created_at,
        }
