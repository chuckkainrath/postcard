from .db import db
from datetime import datetime

class Photo(db.Model):
	__tablename__ = 'photos'

	id = db.Column(db.Integer, primary_key = True)
	photo_url = db.Column(db.String(255), nullable=False, unique=True)
	public = db.Column(db.Boolean, nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'),nullable=False)
	created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


	def to_dict(self):
		return {
			'id': self.id,
			'photo_url': self.photo_url,
			'user_id': self.user_id,
			'public': self.public,
			'created_at': self.created_at,
		}
