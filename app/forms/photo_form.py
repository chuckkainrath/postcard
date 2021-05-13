from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField


class PhotoForm(FlaskForm):
    public = BooleanField('public')
    photo = StringField('photo')
