define([
	"react"
], function(React) {
	return React.createClass({
		componentDidMount: function() {

		},
		distinguishStudentTeacher: function(){
			if(this.props.course.hasOwnProperty(teacherFolder)){
				return "Teacher";
			} else{
				return "Student";
			}
		},
		render: function() {
			return (
				<div className="row">
					<div className="col s12 m6">
					  <div className="card blue-grey darken-1">
						<div className="card-content white-text">
						  <span className="card-title">{this.props.course.name}</span>
						  <p>{this.distinguishStudentTeacher}</p>
						</div>
						<div className="card-action">
						  <a href="#">Go to {this.props.course.name}</a>
						  {/*<a href="#">This is a link</a>*/}
						</div>
					  </div>
					</div>
				  </div>
			)
		}
	})
})