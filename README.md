![Postacard Main Page](https://drive.google.com/uc?export=view&id=1NnYz5ibhZW-0IFqUbvCyDYLaV8Ek52SP)
# Postacard
Postacard is a photo website where users can upload and browse photos.  Users can create customized postcards from uploaded images.

## Features
 - Upload photos and crop them to postcard dimensions.  Photos can be either set to public or private.
 - Users can choose a photo and create a postcard from it.  Users can then save/download the postcard.  Templates can be reused.
 - Users can like/unlike photos and can view their liked photos on their profile page.
 - Users can follow/unfollow other users and can view their follows/followers on their profile page.

## Technology

 - ReactJS
 - Redux
 - AWS S3
 - KonvaJS
 - Flask
 - SQLAlchemy
 - PostgreSQL

## Installation

1. Clone the repo and install dependencies

```
git clone https://github.com/chuckkainrath/postcard.git
pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt
```

2. Create a .env file based on the example.
3. Setup database user, password and database.
4. Migrate/Seed database
pipenv shell
```
flask db upgrade
flask db seed all
flask db run
```
5. Install the frontend dependencies and run
```
cd react-app
npm install
npm start
```

## Features
# Photo Upload
Users can upload photos and set them to private or public.  Uploaded photos are cropped.
![Upload](https://drive.google.com/uc?export=view&id=1KwunpEREyx_4B6G5ua6n-_CMcW7uBVyM)

# Likes/Follows
Users can like/unlike follows and follow/unfollow users.
![LikesAndFollows](https://drive.google.com/uc?export=view&id=1FiKhjL1qxzOq7OVUTpHbNhMkOv2lXTkW)

# Creating a Postcard
Users can create postcards from photos.  Users can save/download postcards.  Users can reuse postcards they've created.
![PostcardFront](https://drive.google.com/uc?export=view&id=1UThncz1Xtw8QJ3-n6AfT49Vi779gHxK6)
![PostcardBack](https://drive.google.com/uc?export=view&id=1x5Sezxbdiwl6Xl5HOjJjEZlrM80-z3Gq)
