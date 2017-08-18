import { h, Component } from 'preact';
import style from './style.scss';

export default class Home extends Component {
	render() {
		return (
			<div class={style.home}>
				<h1>Home</h1>
				<p>Some pictures I took or stole from my friends.</p>
                <p>All the content is under <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank">CC-BY 2.0</a></p>
                <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank">
                	<img src="/assets/icons/cc-by.svg"/>
                </a>
			</div>
		);
	}
}
