from app.models import db, User, Photo

# id = db.Column(db.Integer, primary_key = True)
# 	photo_url = db.Column(db.String(255), nullable=False, unique=True)
# 	public = db.Column(db.Boolean, nullable=False)
# 	user_id = d

def seed_photos():
    demo = User.query.filter(User.username == 'Demo').first()
    chuck = User.query.filter(User.username == 'Chuck').first()
    kuda = User.query.filter(User.username == 'Kuda').first()
    pepsi = User.query.filter(User.username == 'Pepsi').first()

    db.session.add(Photo(
        photo_url='https://postcard-app-photos.s3.us-east-2.amazonaws.com/51800983-6ab6-4c5f-8e3a-2ab47aa09e97.jpg',
        public=True,
        user_id=chuck.id
    ))

    db.session.add(Photo(
        photo_url='https://postcard-app-photos.s3.us-east-2.amazonaws.com/8c10ae73-6976-4c3e-8a0f-d8aef0698dda.jpg',
        public=True,
        user_id=chuck.id
    ))

    db.session.add(Photo(
        photo_url='https://postcard-app-photos.s3.us-east-2.amazonaws.com/9ddc5bae-c4ef-4b02-b965-551ed968b26b.jpg',
        public=False,
        user_id=chuck.id
    ))

    db.session.add(Photo(
        photo_url='https://postcard-app-photos.s3.us-east-2.amazonaws.com/ad46dcc4-119a-4054-89d5-305bdc707fce.jpg',
        public=True,
        user_id=demo.id
    ))

    db.session.add(Photo(
        photo_url='https://postcard-app-photos.s3.us-east-2.amazonaws.com/b9fd773a-60c1-4ba6-9158-6033da619422.jpg',
        public=True,
        user_id=demo.id
    ))

    db.session.add(Photo(
        photo_url='https://postcard-app-photos.s3.us-east-2.amazonaws.com/c9559000-fa99-41db-961d-8bbab59689a7.jpg',
        public=True,
        user_id=demo.id
    ))

    db.session.add(Photo(
        photo_url='https://postcard-app-photos.s3.us-east-2.amazonaws.com/cb62d129-4ef7-4939-ac94-eef4dcbe1f6d.jpg',
        public=False,
        user_id=demo.id
    ))

    db.session.add(Photo(
        photo_url='https://postcard-app-photos.s3.us-east-2.amazonaws.com/e2fba852-f819-4a4e-9689-138dda8f552e.jpg',
        public=False,
        user_id=demo.id
    ))

    db.session.add(Photo(
        photo_url='https://postcard-app-photos.s3.us-east-2.amazonaws.com/e3c0fb85-319e-467a-9d88-d8f07913ac7e.jpg',
        public=False,
        user_id=demo.id
    ))

    db.session.add(Photo(
        photo_url='https://postcard-app-photos.s3.us-east-2.amazonaws.com/ede50225-afdd-4ce5-9cb6-be67d6d054ff.jpg',
        public=True,
        user_id=demo.id
    ))

    db.session.add(Photo(
        photo_url='https://postcard-app-photos.s3.us-east-2.amazonaws.com/f1d3663e-5d4d-48ac-b988-eca4b3311ce4.jpg',
        public=True,
        user_id=kuda.id
    ))

    db.session.add(Photo(
        photo_url='https://postcard-app-photos.s3.us-east-2.amazonaws.com/fc5494aa-cc28-40cb-91f7-1fd67edbca35.jpg',
        public=True,
        user_id=kuda.id
    ))

    db.session.add(Photo(
        photo_url='https://postcard-app-photos.s3.us-east-2.amazonaws.com/fefdb7c8-5d40-461f-a075-a9e7db067722.jpg',
        public=True,
        user_id=pepsi.id
    ))

    db.session.commit()


def undo_photos():
    db.session.execute('TRUNCATE photos CASCADE;')
    db.session.commit()
