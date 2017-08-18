import { h, Component } from 'preact';
import style from './style.scss';

export default class Error extends Component {
	state = {
		count: 0
	};

	// update the current time
	updateTime = () => {
		let time = new Date().toLocaleString();
		this.setState({ time });
	};

	// gets called when this route is navigated to
	componentDidMount() {
		// start a timer for the clock:
		this.timer = setInterval(this.updateTime, 1000);
		this.updateTime();

		// every time we get remounted, increment a counter:
		this.setState({ count: this.state.count+1 });
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		clearInterval(this.timer);
	}

	// Note: `code` comes from the URL, courtesy of our router
	render({ code }, { time, count }) {
		return (
			<div class={style.profile}>
				<h1>Error code: {code}</h1>
				<div>The page you requested disapeared in the limbo of the web.</div>
                <div>Or maybe I'm just really stupid or something.</div>
				<p>Current time: {time} (← because it looks cool)</p>
			</div>
		);
	}
}
