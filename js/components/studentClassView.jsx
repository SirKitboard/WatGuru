define([
	"react",
	"react-dom"
], function(React, ReactDOM) {
	return React.createClass({
		getInitialState: function() {
			return {
				lecture: null,
				lectureRef: null,
				allowWat: true
			}
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
		sendWAT: function() {
			var question = ReactDOM.findDOMNode(this.refs.question).value;
			var self = this;
			if(question && question.length > 0) {
				var lectureRef = firebase.database().ref('courses/' + this.props.course.google_id+'/lecture');
				var newWATRef = lectureRef.push();
				newWATRef.set({
					timestamp: Math.floor((new Date().getTime())),
					question: question
				})
			} else {
				var lectureRef = firebase.database().ref('courses/' + this.props.course.google_id+'/lecture');
				var newWATRef = lectureRef.push();
				newWATRef.set({
					timestamp: Math.floor((new Date().getTime()) / 1000),
				});
			}
			this.setState({
				allowWat: false
			});
			setTimeout(function() {
				self.setState({
					allowWat: true
				});
			}, 5000);
		},
		render: function() {
			if(!this.props.course.active) {
				return (
					<div className="container">
						Lecture Ended.
					</div>
				)
			}
			return (
				<div className="container student-view">
					<div className="row">
						<div className="input-field col s12">
							<input ref="question" placeholder="Attach a question to your WAT (Optional)" id="question" type="text" className="validate"/>
							<label className="active" htmlFor="question">Question</label>
						</div>
					</div>
					<div style={{width:'100%'}}>
					<button onClick={this.sendWAT} className={"btn waves-effect waves-green" + (this.state.allowWat ?"": " disabled")}>
						WAT <br/> 😕
					</button>
					</div>
				</div>
			)
		}
	})
})