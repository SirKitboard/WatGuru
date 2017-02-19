define([
	"react",
], function(React) {
	return React.createClass({
		onClose: function() {
			this.props.closeAddCourseModal();
		},
		componentDidMount: function() {
			$('#addCourseModal').modal();
		},
		getTaughtCourses: function() {
			return _.filter(this.props.googleCourses, function(gCourse) {
				if(gCourse.teacherFolder) {
					return true;
				}
				return false;
			})
		},
		getNewCourses: function(filteredGCourses) {
			// console.log(filteredGCourses);
			gIDs = _.pluck(this.props.courses.teacher, 'google_id'); 
			// console.log(gIDs);
			return _.filter(filteredGCourses, function(course) {
				return gIDs.indexOf(course.id) == -1;
			});
		},
		createCourse: function(e) {
			debugger;
			var courseID = e.target.getAttribute('data-id');
			var course = _.find(this.props.googleCourses, function(course) {
				return course.id == courseID;
			});
			$.ajax({
				method:'POST',
				url:'/api/courses',
				data: {
					name: course.name,
					google_id: courseID,
					owner_id: this.props.user.id
				}, 
				success:function(response) {
					this.props.refreshCourses();
					this.props.closeAddCourseModal();
				}
			})
		},
		render: function() {
			var self = this;
			return (
				<div id="addCourseModal" className="modal">
					<div className="modal-content">
						<h4>Add courses</h4>
						<ul className="course-list">
							{
								_.map(this.getNewCourses(this.getTaughtCourses()), function(course) {
									return <li>
										<div className="course-name">{course.name}</div>
										<div data-id={course.id} onClick={self.createCourse} className="btn waves-effect waves-green">Add</div>
									</li>
								})
							}
						</ul>
					</div>
					<div className="modal-footer">
						<a onClick={this.onClose} href="#!" className=" modal-action modal-close waves-effect waves-green btn">Done</a>
					</div>
				</div>
			)
		}
	})
});