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
				loading: 0,
				user: user,
				database: firebase.database(),
				googleCourses: [],
				courses:{
					'student': [],
					'teacher': [],
				},
				databaseRefs: [],
			}
		},
		componentDidMount: function() {
			var self = this;
			this.state.database.ref('/users/' + this.state.user.uid).once('value', function(snapshot) {
				var user = self.state.user;
				user.id = snapshot.val().id;
				self.setState({
					accessToken: snapshot.val().accessToken,
					user: user
				});
			});
		},
		componentDidUpdate: function(prevProps, prevState) {
			console.log(this.state.loading);
			var self = this;
			if(!prevState.accessToken) {
				if(this.state.accessToken) {
					this.refreshCourses();
				}	
			}
			if(prevState.loading != 2) {
				if(this.state.loading == 2) {
					this.createEnrolledCoursesIfMissing();
				}
			}
			console.log(this.state.user);
		},
		refreshCourses:function() {
			API.getCoursesForUser(this.state.user.id, this.initCourses);
			API.getGoogleCourses(this.state.accessToken, this.initGoogleCourses);
		},
		initGoogleCourses: function(courses) {
			var self;
			this.setState({
				googleCourses: courses,
				loading: this.state.loading+1
			});
		},
		getEnrolledCourses: function() {
			return _.filter(this.state.googleCourses, function(gCourse) {
				if(gCourse.teacherFolder) {
					return false;
				}
				return true;
			})
		},
		getNewStudentCourses: function(filteredGCourses) {
			// console.log(filteredGCourses);
			gIDs = _.pluck(this.state.courses.student, 'google_id'); 
			// console.log(gIDs);
			return _.filter(filteredGCourses, function(course) {
				return gIDs.indexOf(course.id) == -1;
			});
		},
		createEnrolledCoursesIfMissing: function() {
			var self = this;
			var coursesToBeCreated = this.getNewStudentCourses(this.getEnrolledCourses());
			if(coursesToBeCreated.length > 0) {
				API.enrollStudentInCourses(this.state.user.id, coursesToBeCreated, function() {
					self.refreshCourses();
				});
			}
		},
		initFirebaseCourses:function(courses) {
			this.setState({
				firebaseCourses: courses
			});
		},
		setCourseAsActive: function(google_id) {
			var index = _.findIndex(this.state.courses.student, function(course) {
				return course.google_id == google_id;
			});
			var courses = this.state.courses;
			if(index != -1) {
				courses.student[index].active = true;
				this.setState({
					courses: courses
				});
			}
		},
		setCourseAsInactive: function(google_id) {
			var index = _.findIndex(this.state.courses.student, function(course) {
				return course.google_id == google_id;
			});
			var courses = this.state.courses;
			if(index != -1) {
				courses.student[index].active = false;
				this.setState({
					courses: courses
				});
			}
		},
		initCourses:function(courses) {
			var self = this;
			var databaseRefs = this.state.databaseRefs;
			databaseRefs.forEach(function(ref) {
				ref.off();
			}, this);

			this.setState({
				courses: courses,
				loading: this.state.loading+1,
				databaseRefs: []
			});
			refs = [];
			var coursesRef = firebase.database().ref('/courses');
			_.each(this.state.courses.student, function(course) {
				coursesRef.child(course.google_id).once('value', function(snapshot) {
					if(!snapshot.val()) {
						firebase.database().ref('/courses/'+course.google_id).set({
							active: false
						});
					} 
					refs.push(firebase.database().ref('/courses/'+course.google_id).on('value', function(snapshot) {
						var val = snapshot.val()
						console.log('val', val);
						if(val) {
							if(val.active) {
								self.setCourseAsActive(course.google_id);
							} else {
								self.setCourseAsInactive(course.google_id);
							}
						}
					}));
					self.setState({
						databaseRefs:refs
					});
				});
			});
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
			// console.log(this.state);
			console.log(this.state.databaseRefs);
			return (
				<div>
					<NavBar user={this.state.user} openAddCourseModal={this.openAddCourseModal}/>
					<div className="container">
						<h3>Teaching</h3>
						<div className="row">
							{
								_.map(this.state.courses.teacher, function(course) {
									course.active = true;
									return <Course course={course}/>
								})
							}
						</div>
						<h3>Enrolled</h3>
						<div className="row">
							{
								_.map(this.state.courses.student, function(course) {
									return <Course course={course}/>
								})
							}
						</div>
					</div>
					<AddCourseModal refreshCourses={this.refreshCourses} user={this.state.user} closeAddCourseModal={this.closeAddCourseModal} googleCourses={this.state.googleCourses} courses={this.state.courses}/>
				</div>
			)
		}
	})
});