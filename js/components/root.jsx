define([
	"react",
	"jsx!components/navbar",
], function(React, NavBar) {
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
				database: firebase.database()
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
					$.ajax({
						method:"GET",
						url: "https://classroom.googleapis.com/v1/courses?access_token=" + self.state.accessToken,
						success: function(response) {
							console.log(response)
						}
					})
				}
			}
		},
		gotoTab: function(e) {

		},
		render: function() {
			return (
				<NavBar user={this.state.user}/>
			)
		}
	})
});