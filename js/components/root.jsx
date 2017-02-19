define([
	"underscore",
	"react",
	"jsx!components/navbar",
	"jsx!components/class",
	"jsx!components/addCourseModal",
	"helpers/api"

], function(_, React, NavBar, Course, AddCourseModal, API) {
	return React.createClass({
		getInitialState: function() {
			var user = firebase.auth().currentUser;
			if(user) {
				console.log(user);
			} else {
				window.location.href = "/";
			}
			return {
				user: user,
				database: firebase.database(),
				googleCourses: [],
				courses:{
					'student': [],
					'teacher': [],
				}
			}
		},
		componentDidMount: function() {
			var self = this;
			this.state.database.ref('/users/' + this.state.user.uid).on('value', function(snapshot) {
				var user = self.state.user;
				user.id = snapshot.val().id;
				self.setState({
					accessToken: snapshot.val().accessToken,
					user: user
				});
			});
		},
		componentDidUpdate: function(prevProps, prevState) {
			var self = this;
			if(!prevState.accessToken) {
				if(this.state.accessToken) {
					API.getGoogleCourses(this.state.accessToken, this.initGoogleCourses);
					API.getCoursesForUser(this.state.user.id, this.initCourses);
				}	
			}
			console.log(this.state.user);
		},
		initGoogleCourses: function(courses) {
			this.setState({
				googleCourses: courses
			});
		},
		initFirebaseCourses:function(courses) {
			this.setState({
				firebaseCourses: courses
			});
		},
		initCourses:function(courses) {
			this.setState({
				courses: courses
			})
		},
		gotoTab: function(e) {

		},
		openAddCourseModal: function() {
			 $('#addCourseModal').modal('open');
		},
		closeAddCourseModal: function() {
			$('#addCourseModal').modal('close');
		},
		render: function() {
			console.log(this.state);
			return (
				<div>
					<NavBar user={this.state.user} openAddCourseModal={this.openAddCourseModal}/>
					<h3>Teaching</h3>
					{
						_.map(this.state.courses.teacher, function(course) {
							return <Course course={course}/>
						})
					}
					<h3>Enrolled</h3>
					{
						_.map(this.state.courses.student, function(course) {
							return <Course course={course}/>
						})
					}
					<AddCourseModal user={this.state.user} closeAddCourseModal={this.closeAddCourseModal} googleCourses={this.state.googleCourses} courses={this.state.courses}/>
				</div>
			)
		}
	})
});