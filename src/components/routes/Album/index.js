import { h, Component } from 'preact';
import Gallery from "../../layout/Gallery"
import style from './style.scss';

import Albums from 'Albums'

export default class Album extends Component {
	render({ album_id }) {
		let self = this;
		const album = Albums[album_id];
		console.log(album)
		const pictures = 
			album.pictures.map(function(picture, i){
				return {
					src: "/albums/" + album.title + "/" + picture,
					thumbnail: "/albums/" + album.title + "/" + picture + "-small"
				};
			});

		const theme = {
			// arrows
			arrow: {
				backgroundColor: 'rgba(0, 0, 0, 0.8)',
				fill: '#222',
				opacity: 0.6,
				transition: 'opacity 200ms',

				':hover': {
					opacity: 1,
				},
			},
			arrow__size__medium: {
				borderRadius: 40,
				height: 40,
				marginTop: -20,

				'@media (min-width: 768px)': {
					height: 70,
					padding: 15,
				},
			},
			arrow__direction__left: { marginLeft: 10 },
			arrow__direction__right: { marginRight: 10 },
			close: {
				position: 'fixed',
    			right: 10,
				fill: '#D40000',
				opacity: 0.6,
				transition: 'all 200ms',
				':hover': {
					opacity: 1,
				},
			},

			//header
			header: {
				height: 10,
			},

			// footer
			footer: {
				height: 0,
				color: 'black',
			},
			footerCount: {
				color: 'rgba(0, 0, 0, 0.6)',
			},

			// thumbnails
			thumbnail: {
			},
			thumbnail__active: {
				boxShadow: '0 0 0 2px #00D8FF',
			},
		};

		return (
			<div class={style.album}>
				<h1>{album.title}</h1>

				<Gallery images={pictures} theme={theme} showThumbnails />

				{/*{pictures.map(function(picture, i) {
					return (
						<a onClick={(e) => self.openLightbox(i, e)}>
							<img src={picture.src + "-small"} />
						</a>
					);
				})}*/}
			</div>
		);
	}
}
