import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.scss';

import Albums from 'Albums'

export default class Sidebar extends Component {
	render() {
		return (
			<aside class={style.sidebar}>
				<nav>
					<Link activeClassName={style.active} href="/">Home</Link>
                    {Albums.map((album, i) =>
                    	<Link activeClassName={style.active} href={"/albums/" + i}>{album.title}</Link>
					)}
				</nav>
			</aside>
		);
	}
}
