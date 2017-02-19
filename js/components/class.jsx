define([
	"react"
], function(React) {
	return React.createClass({
		componentDidMount: function() {

		},
		render: function() {
			return (
					<div className="col s6 m4">
					  <div className="card blue-grey darken-1">
						<div className="card-content white-text">
						  <span className="card-title">{this.props.course.name}</span>
						</div>
						<div className="card-action">
							{ this.props.course.active ? <a href="#">Go to {this.props.course.name}</a> : null}
						</div>
					  </div>
					</div>
			)
		}
	})
})