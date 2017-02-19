define([
	"react"
], function(React) {
	return React.createClass({
		getInitialState: function() {
			return {
				active: this.props.course.active,
				lecture: null,
				lectureRef: null, 
				wats: []
			}
		},
		componentWillUnmount: function() {
		this._mounted = false;
		},
		componentDidMount: function() {
			this._mounted = true;
			var self = this;
			if(this.state.active){
				this.initializeListener();
			}
			setInterval(function timeout() {
				if(self._mounted) {
					self.forceUpdate();
				} else {
					clearTimeout(timeout);
				}
			}, 10000)
		},
		reverseArr: function(input) {
			var ret = new Array;
			for(var i = input.length-1; i >= 0; i--) {
				ret.push(input[i]);
			}
			return ret;
		},
		initializeListener: function(){
			var self = this;
			var lectureRef = firebase.database().ref('/courses/'+this.props.course.google_id+'/lecture')
			this.setState({
				lectureRef: lectureRef
			});
			// lectureRef.orderByChild("timestamp").once('value', function(snapshot) {
			// 	_.each(snapshot.val(), function(value, key) {
			// 		self.state.wats.push({
			// 			timestamp: value.timestamp,
			// 			question: value.question
			// 		});
			// 		self.forceUpdate();
			// 	})
			// });
			lectureRef.orderByChild("timestamp").on('child_added', function(snapshot) {
				var value = snapshot.val();
				self.state.wats.push({
					timestamp: value.timestamp,
					question: value.question
				});
			})
		},
		startLecture: function() {
			firebase.database().ref('/courses/'+this.props.course.google_id).set({
				active: true
			});
			this.setState({
				active: true
			})
		},
		endLecture: function() {
			firebase.database().ref('/courses/'+this.props.course.google_id).set({
				active: false
			});
			this.setState({
				active: false
			})
		},
		timeString: function(timestamp) {
			var t = new Date(timestamp);
			var now = new Date();

			var diffInSeconds = (now.getTime() - t.getTime()) / 1000;
			if(diffInSeconds < 20) {
				return "Just now";
			} else if(diffInSeconds < 60) {
				return parseInt(diffInSeconds) + " second" + (parseInt(diffInSeconds) > 1 ? "s" : "") + " ago.";
			}

			var diffInMinutes = diffInSeconds / 60;
			if(diffInMinutes < 60) {
				return parseInt(diffInMinutes) + " minute" + (parseInt(diffInMinutes) > 1 ? "s" : "") + " ago.";
			}

			var diffInHours = diffInMinutes / 60;
			if(diffInHours < 60) {
				return parseInt(diffInHours) + " hour" + (parseInt(diffInHours) > 1 ? "s" : "") + " ago.";
			}

			var diffInDays = diffInHours / 60;
			if(diffInDays < 10) {
				return parseInt(diffInDays) + " day" + (parseInt(diffInDays) > 1 ? "s" : "") + " ago.";
			}
			else {
				return t.toLocaleDateString();
			}
		},
		render: function() {
			var self = this;
			if(!this.state.active) {
				return (
					<div className="container" style={{marginTop: '30px'}}>
						{!this.state.lecture ? 
						<p>
							This course doesn't have an active lecture right now. Click the Start Lecture button to allow students to post their WATs to their Guru.
						</p> : <ul className="live-feed z-depth-1">
							{
								_.map(self.reverseArr(self.state.wats), function(wat){
									console.log(wat);
									return (
										<li>
											<div style={{float:'left'}}>
												WAT: {wat.question ? wat.question : ""}
											</div>
											<div style={{float:'right'}}>
												self.timeString(wat.timestamp);
											</div>
										</li>
									)
								})
							}
						</ul> }
						<button onClick={this.startLecture} className="btn btn-waves waves-green">
							Start button
						</button>
					</div>
				)
			}
			return (
				<div className="container">
					<ul className="live-feed z-depth-1">
							{
								_.map(self.reverseArr(self.state.wats), function(wat){
									console.log(wat);
									return (
										<li>
											<div style={{float:'left'}}>
												WAT: {wat.question ? wat.question : ""}
											</div>
											<div style={{float:'right'}}>
												{self.timeString(wat.timestamp) };
											</div>
										</li>
									)
								})
							}
						</ul>
					<button onClick={this.endLecture} className="btn btn-waves waves-green">
						End Lecture
					</button>
				</div>
			)
		}
	})
})