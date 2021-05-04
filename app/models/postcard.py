from .db import db
from datetime import datetime


class Postcard(db.Model):
    __tablename__ = 'postcards'

    id = db.Column(db.Integer, primary_key = True)
    postcard_url = db.Column(db.String(255), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow,
                            nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'postcard_url': self.postcard_url,
			'user_id': self.user_id,
            'created_at': self.created_at,
        }
