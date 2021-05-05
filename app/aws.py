import boto3
from os import environ
import uuid

S3_BUCKET_NAME = environ.get('S3_BUCKET')
S3_URL = f'https://{S3_BUCKET_NAME}.s3.amazonaws.com/'
ALLOWED_EXTENSIONS = {'png', 'jpeg', 'jpg'}

s3_client = boto3.client(
    's3',
    aws_access_key_id=environ.get('S3_key'),
    aws_secret_access_key=environ.get('S3_SECRET')
)


def upload_photo_to_s3():
    pass


def delete_photo_from_s3():
    pass


def valid_file_type(filename):
    file_arr = filename.lower().split('.')
    return len(file_arr) > 1 and file_arr[-1] in ALLOWED_EXTENSIONS


def get_unique_filename(filename):
    ext = filename.lower().split('.')[-1]
    uuid_filename = uuid.uuid4()
    return f'{uuid_filename}.{ext}'
