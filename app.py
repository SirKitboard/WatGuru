from __future__ import print_function
from flask import Flask
import flask
import httplib2
import os
import json
from os.path import join, dirname
from dotenv import load_dotenv
from dotenv import load_dotenv, find_dotenv
from apiclient import discovery
from oauth2client import client
from oauth2client import tools
from oauth2client.file import Storage

app = Flask(__name__)
load_dotenv(find_dotenv())
     
try:
    import argparse
    flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
except ImportError:
    flags = None

# If modifying these scopes, delete your previously saved credentials
# at ~/.credentials/classroom.googleapis.com-python-quickstart.json
SCOPES = 'https://www.googleapis.com/auth/classroom.courses.readonly'
CLIENT_SECRET_FILE = 'client_secret.json'
APPLICATION_NAME = 'Classroom API Python Quickstart'
PORT = os.environ.get("PORT")
HOST = os.environ.get("HOST")
FIREBASE_CONFIG = {
	'apiKey': os.environ.get("FIREBASE_APIKEY"),
	'authDomain': os.environ.get("FIREBASE_DOMAIN") + ".firebaseapp.com",
	'databaseURL': os.environ.get("FIREBASE_APIKEY"),
	'storageBucket': os.environ.get("FIREBASE_DOMAIN") + ".appspot.com",
	'messagingSenderId': os.environ.get("FIREBASE_SENDER_ID")
}

# @app.route('/')
# def hello_world():
#     return 'Hello, World!'

@app.route('/api/classes')
def index():
	if 'credentials' not in flask.session:
		return flask.redirect(flask.url_for('oauth2callback'))
	credentials = client.OAuth2Credentials.from_json(flask.session['credentials'])
	if credentials.access_token_expired:
		return flask.redirect(flask.url_for('oauth2callback'))
	else:
		http_auth = credentials.authorize(httplib2.Http())
		service = discovery.build('classroom', 'v1', http=http_auth)
		results = service.courses().list(pageSize=10).execute()
		courses = results.get('courses', [])
		return json.dumps(courses)

@app.route('/css/<path:path>')
def send_css(path):
	return flask.send_from_directory('css', path)

@app.route('/js/<path:path>')
def send_js(path):
	return flask.send_from_directory('js', path)

@app.route('/dashboard')
def dashboard():
	print(FIREBASE_CONFIG)
	return flask.render_template('dashboard.html', firebase_config=FIREBASE_CONFIG)

@app.route('/')
def login():
    return flask.render_template('login.html', firebase_config=FIREBASE_CONFIG)

@app.route('/oauth2callback')
def oauth2callback():
	flow = client.flow_from_clientsecrets(
		'client_secrets.json',
		scope=SCOPES,
		redirect_uri=flask.url_for('oauth2callback', _external=True))
	flow.params['access_type'] = 'offline'
	if 'code' not in flask.request.args:
		auth_uri = flow.step1_get_authorize_url()
		return flask.redirect(auth_uri)
	else:
		auth_code = flask.request.args.get('code')
		credentials = flow.step2_exchange(auth_code)
		flask.session['credentials'] = credentials.to_json()
		return flask.redirect(flask.url_for('index'))

if __name__ == '__main__':
	import uuid
	app.secret_key = str(uuid.uuid4())
	app.run(host=HOST, port=int(PORT), debug=True, threaded=True)