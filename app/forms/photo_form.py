from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired


class PhotoForm(FlaskForm):
    public = BooleanField('public', validators=[DataRequired()])
    photo = StringField('photo')
