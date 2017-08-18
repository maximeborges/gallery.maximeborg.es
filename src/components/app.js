import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import Home from './routes/Home';
import Album from './routes/Album';
import Error from './routes/Error';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Header />
                <Sidebar />
                <div id="wrapper">
    				<Router onChange={this.handleRoute}>
                        <Home path="/" />
    					<Album path="/albums/:album_id" />
    					<Error default code="404" />
    				</Router>
                </div>
			</div>
		);
	}
}
