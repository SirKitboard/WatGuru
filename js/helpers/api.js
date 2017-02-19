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

	API.prototype.getFirebaseCourses = function() {
		
	}
	return new API();
});