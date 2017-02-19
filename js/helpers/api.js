define(["underscore"], function(_) {
	var API = function API(){};
	API.prototype.getGoogleCourses = function(accessToken, onSuccess) {
		$.ajax({
			method:"GET",
			url: "https://classroom.googleapis.com/v1/courses?access_token=" + accessToken,
			success: function(response) {
				onSuccess(response.courses);
			},
			error: function(jqXHR) {
				console.log(jqXHR);
			}
		})
	}

	API.prototype.getCoursesForUser = function(user_id, onSuccess) {
		$.ajax({
			method:"GET",
			url: "/api/courses",
			data: {
				user_id: user_id
			}, 
			success: function(response) {
				onSuccess(response);
			}
		})
	}

	API.prototype.enrollStudentInCourses = function(user_id, courses, onSuccess) {
		var numCourses = courses.length;
		var count = 0;
		_.each(courses, function(course) {
			$.ajax({
				method:"POST",
				url: "/api/courses/enroll",
				data: {
					user_id: user_id,
					google_id: course.id
				}, 
				success: function(response) {
					count = count+1;
					if(count == numCourses) {
						onSuccess();
					}
				}
			})
		})
	}
	return new API();
});