import boto3
from os import environ
import uuid

S3_PHOTO_BUCKET = environ.get('S3_PHOTO_BUCKET')
S3_POSTCARD_BUCKET = environ.get('S3_POSTCARD_BUCKET')
S3_PROFILE_BUCKET = environ.get('S3_PROFILE_BUCKET')

S3_BUCKETS = {
    'profile': S3_PROFILE_BUCKET,
    'postcard': S3_POSTCARD_BUCKET,
    'photo': S3_PHOTO_BUCKET
}

URL_SCHEME = 'https://'
URL_DOMAIN = '.s3.amazonaws.com/'
ALLOWED_EXTENSIONS = {'png', 'jpeg', 'jpg'}

s3_client = boto3.client(
    's3',
    aws_access_key_id=environ.get('S3_KEY'),
    aws_secret_access_key=environ.get('S3_SECRET')
)


def upload_photo_to_s3(photo, bucket):
    try:
        s3_client.upload_fileobj(
            photo,
            S3_BUCKETS[bucket],
            photo.filename,
            ExtraArgs={
                'ACL': 'public-read',
                'ContentType': photo.content_type
            })
    except Exception as e:
        # Do error handling
        print('Error uploading file to aws bucket')
    return {'photo_url': f'{URL_SCHEME}{S3_BUCKETS[bucket]}{URL_DOMAIN}{photo.filename}'}



def delete_photo_from_s3():
    pass


def valid_file_type(filename):
    file_arr = filename.lower().split('.')
    return len(file_arr) > 1 and file_arr[-1] in ALLOWED_EXTENSIONS


def get_unique_filename(filename):
    ext = filename.lower().split('.')[-1]
    uuid_filename = uuid.uuid4()
    return f'{uuid_filename}.{ext}'