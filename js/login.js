/**
 * Created by Nomi on 2/18/2017.
 */
$(document).ready(function(){
    $('#login_button').on("click", function(){
        console.log("login button clicked")
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/classroom.courses.readonly');
        firebase.auth().signInWithPopup(provider).then(function (result) {
            
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            $.ajax({
                method: "POST",
                url:"/api/users",
                data: {
                    email:user.email
                },
                success: function(response) {
                    console.log(response);
                    firebase.database().ref('users/' + user.uid).set({
                        id: response.id,
                        accessToken: token
                    }).then(function() {
                        window.location.href = "/dashboard";
                    });
                }
            })
            
        }).catch(function (error) {
            
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    });
});

