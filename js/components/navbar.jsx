define([
	"react"
], function(React) {
	return React.createClass({
		componentDidMount: function() {
			$(".button-collapse").sideNav();
		},
		capitalizeFirstLetter: function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
		render: function() {
			return (
				<div className="nav-container">
					<nav className="nav-extended teal">
						<div className="nav-wrapper">
							<a href="#!" className="brand-logo">WAT.guru</a>
							<ul className="right hide-on-sm-and-down">
								<li>Logged in as (email)</li>
								<li><a>Logout</a></li>
							</ul>
						</div>
						<div className="nav-content">
							<span className="nav-title">Classes</span>
							<a className="btn-floating btn-large halfway-fab waves-effect waves-light cyan">
								<i className="material-icons">add</i>
							</a>
						</div>
					</nav>
				</div>
			)
		}
	})
})