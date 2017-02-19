require([
    "react",
    "react-dom",
    "jsx!components/root",
], function(React, ReactDOM, RootComponent) {
    var app = React.createElement(RootComponent);
	ReactDOM.render(app, document.getElementById('content'));
}, function(error) {

});