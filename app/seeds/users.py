from werkzeug.security import generate_password_hash
from app.models import db, User

# Adds a demo user, you can add other users here if you want
def seed_users():

    demo = User(username='Demo', email='demo@aa.io',
                password='password')
    chuck = User(username='Chuck', email='chuck@gmail.com',
                password='kooper21',
                profile_img_url='https://postcard-app-profiles.s3.us-east-2.amazonaws.com/d4d8fb89-38ec-467e-a3d0-1e4af6c7fd36.jpg')
    kuda = User(username='Kuda', email='kuda@gmail.com',
                password='kuda21',
                profile_img_url='https://postcard-app-profiles.s3.us-east-2.amazonaws.com/a86f9726-8716-4482-9287-b2e841aee11b.jpg')
    pepsi = User(username='Pepsi', email='pepsi@gmail.com',
                password='pepsi21',
                profile_img_url='https://postcard-app-profiles.s3.us-east-2.amazonaws.com/479826bf-36a4-4576-b548-9c2598ace235.jpg')


    db.session.add(demo)
    db.session.add(chuck)
    db.session.add(kuda)
    db.session.add(pepsi)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_users():
    db.session.execute('TRUNCATE users;')
    db.session.commit()
