require.config({
	baseUrl: "js",
 	paths: {
                "jquery": "https://code.jquery.com/jquery-2.1.1.min",
	             "react": "//unpkg.com/react@15.3.2/dist/react-with-addons",
			 "react-dom": "//unpkg.com/react-dom@15.3.2/dist/react-dom",
	    "JSXTransformer": "//cdnjs.cloudflare.com/ajax/libs/react/0.14.0-alpha1/JSXTransformer",
	               "jsx": "//cdn.rawgit.com/philix/jsx-requirejs-plugin/master/js/jsx",
                  "text": "//cdn.rawgit.com/philix/jsx-requirejs-plugin/master/js/text",
	        "underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
			   "require":"//cdnjs.cloudflare.com/ajax/libs/require.js/2.3.2/require.min",
			  "firebase": "//www.gstatic.com/firebasejs/3.6.9/firebase"

 	},
 	jsx: {
		fileExtension: ".jsx"
 	}
});
