define([
	"underscore",
	"react",
	"jsx!components/navbar",
	"jsx!components/class",
	"helpers/api"
], function(_, React, NavBar, Class, API) {
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
				firebaseCourses: []
			}
		},
		componentDidMount: function() {
			var self = this;
			this.state.database.ref('/users/' + this.state.user.uid).on('value', function(snapshot) {
				console.log(snapshot.val())
				self.setState({
					accessToken: snapshot.val().accessToken
				});
			});
		},
		componentDidUpdate: function(prevProps, prevState) {
			var self = this;
			if(!prevState.accessToken) {
				if(this.state.accessToken) {
					API.getGoogleCourses(this.state.accessToken, this.initGoogleCourses);
				}	
			}
		},
		initGoogleCourses: function(Courses) {
			this.setState({
				googleCourses: Courses
			});
		},
		initFirebaseCourses:function(Courses) {
			this.setState({
				firebaseCourses: Courses
			});
		},
		gotoTab: function(e) {

		},
		render: function() {
			return (
				<div>
					<NavBar user={this.state.user}/>
					{
						_.map(this.state.firebaseCourses, function(course) {

						})
					}
				</div>
			)
		}
	})
});