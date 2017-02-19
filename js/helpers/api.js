define([], function() {
	var API = function API(){};
	API.prototype.getGoogleCourses = function(accessToken, onSuccess) {
		$.ajax({
			method:"GET",
			url: "https://classroom.googleapis.com/v1/courses?access_token=" + self.state.accessToken,
			success: function(response) {
				onSuccess(response.courses);
			},
			error: function(jqXHR) {
				console.log(jqXHR);
			}
		})
	}

	API.prototype.getFirebaseCourses = function() {
		
	}
});