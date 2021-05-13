from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired


class PostcardForm(FlaskForm):
    card_front = StringField('card_front', [DataRequired()])
    card_back = StringField('card_back', [DataRequired()])
