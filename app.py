from __future__ import print_function
from flask import Flask, request
import flask
import httplib2
import os
from dotenv import load_dotenv, find_dotenv
from apiclient import discovery
from oauth2client import client
from oauth2client import tools
from flask_mysqldb import MySQL
from flask import jsonify

app = Flask(__name__)
load_dotenv(find_dotenv())


app.config['MYSQL_USER'] = os.environ.get("MYSQL_USER")
app.config['MYSQL_PASSWORD'] = os.environ.get("MYSQL_PASSWORD")
app.config['MYSQL_DB'] = os.environ.get("MYSQL_DB")
app.config['MYSQL_HOST'] = os.environ.get("MYSQL_HOST")
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL()
mysql.init_app(app)
     
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
	'databaseURL': os.environ.get("FIREBASE_DOMAIN") + ".firebaseio.com",
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
		return jsonify(courses)

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
@app.route('/login')
def login():
    return flask.render_template('login.html', firebase_config=FIREBASE_CONFIG)

@app.route('/test')
def test():
    return flask.render_template('test.html', firebase_config=FIREBASE_CONFIG)

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

@app.route('/api/users', methods=['POST'])
def getOrCreateUser():
	cursor = mysql.connection.cursor()
	query = "SELECT * FROM users where email='%s'"
	cursor.execute(query % (request.form['email'],))
	row = cursor.fetchone()
	if row:
		return jsonify(row)
	else:
		query = "INSERT INTO users(email) VALUES('%s')"
		cursor.execute(query % (request.form['email'],))
		mysql.connection.commit()
		query = "SELECT * FROM users where email='%s'"
		cursor.execute(query % (request.form['email'],))
		row = cursor.fetchone()
		return jsonify(row)

@app.route('/api/courses', methods=['GET'])
def getCourses():
	cursor = mysql.connection.cursor()
	if 'user_id' in request.args:
		result_dict = {'student': [], 'teacher': []}
		query = "SELECT * FROM courses where owner_id=%s"
		cursor.execute(query % (request.args['user_id'],))
		rows = cursor.fetchall()
		for row in rows:
			result_dict['teacher'].append(row)
		
		query = "select c.* from courses c join users_courses uc on uc.course_id = c.id where uc.user_id = %s";
		cursor.execute(query % (request.args['user_id'],))
		rows = cursor.fetchall()
		for row in rows:
			result_dict['student'].append(row)
		
		return jsonify(result_dict)

@app.route('/api/courses', methods=['POST'])
def createCourse():
	cursor = mysql.connection.cursor()
	result_dict = {}
	query = "INSERT INTO courses(name, google_id, owner_id) VALUES('%s', '%s', %s)"
	cursor.execute(query % (request.form['name'], request.form['google_id'], request.form['owner_id']))
	mysql.connection.commit()
	query = "SELECT * FROM courses where id=%s"
	cursor.execute(query % (cursor.lastrowid,))
	result_dict = cursor.fetchone()
	mysql.connection.commit()
	return jsonify(result_dict)

@app.route('/api/courses/enroll', methods=['POST'])
def enrollStudent():
	cursor = mysql.connection.cursor()
	query = "SELECT * FROM courses where google_id='%s'"
	cursor.execute(query % (request.form['google_id'],))
	row = cursor.fetchone()
	if(row):
		course_id = row['id']
		query = "INSERT IGNORE INTO users_courses(user_id, course_id) VALUES(%s, %s)"
		cursor.execute(query % (request.form['user_id'], course_id))
		mysql.connection.commit()
		return "Woo"
	else:
		return "Nothing"


if __name__ == '__main__':
	import uuid
	app.secret_key = str(uuid.uuid4())
	app.run(host=HOST, port=int(PORT), debug=True, threaded=True)