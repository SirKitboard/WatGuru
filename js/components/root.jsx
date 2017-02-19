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
			$.ajax({
				method:"GET",
				url:"/",
				success:function() {
					debugger;
				}
			})
			// window.setRootState();
			// this.state.database.ref('/users/' + this.state.user.uid).on('value', function(snapshot) {
			// 	debugger;
			// });
		},
		gotoTab:function(e) {

		},
		render: function() {
			return (
				<NavBar user={this.state.user}/>
			)
		}
	})
});