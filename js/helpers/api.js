define([], function() {
	var API = function API(){};
	API.prototype.getGoogleCourses = function(accessToken, onSuccess) {
		$.ajax({
			method:"GET",
			url: "https://classroom.googleapis.com/v1/courses?access_token=" + accessToken,
			success: function(response) {
				console.log(response.courses);
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
	return new API();
});