import PropTypes from 'prop-types';
import { h, Component, Image} from 'preact';
import { css, StyleSheet } from 'aphrodite/no-important';
import Lightbox from 'react-images';
import style from './style.scss';

class Gallery extends Component {
	constructor () {
		super();

		this.state = {
			lightboxIsOpen: false,
			currentImage: 0,
		};

		this.colCount = 5;
		this.colHeights = [];
		for(let i = 0; i < this.colCount; i++) {
			this.colHeights.push(0);
		}

		this.closeLightbox = this.closeLightbox.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrevious = this.gotoPrevious.bind(this);
		this.gotoImage = this.gotoImage.bind(this);
		this.handleClickImage = this.handleClickImage.bind(this);
		this.openLightbox = this.openLightbox.bind(this);

		this.imageLoadedCount = 0;
	}
	openLightbox (index, event) {
		event.preventDefault();
		this.setState({
			currentImage: index,
			lightboxIsOpen: true,
		});
	}
	closeLightbox () {
		this.setState({
			currentImage: 0,
			lightboxIsOpen: false,
		});
	}
	gotoPrevious () {
		this.setState({
			currentImage: this.state.currentImage - 1,
		});
	}
	gotoNext () {
		this.setState({
			currentImage: this.state.currentImage + 1,
		});
	}
	gotoImage (index) {
		this.setState({
			currentImage: index,
		});
	}
	handleClickImage () {
		if (this.state.currentImage === this.props.images.length - 1) return;

		this.gotoNext();
	}
	renderGallery () {
		const { images } = this.props;
		if (!images) return;

		const gallery = images.map((obj, i) => {

			let order = (i + 1) % this.colCount || this.colCount;

			let img = (<img 
							src={obj.thumbnail} 
							class={style.inner}
							// className={css(classes.source)}
							onload={(e) => {
								this.imageLoadedCount++;
								if(this.imageLoadedCount == images.length) {
									let container = this.base.children[0].children[0];
									let blocks = container.children;

									var COL_COUNT = 5; // set this to however many columns you want
									var col_heights = [];
									for (var i = 0; i < COL_COUNT; i++) {
									  col_heights.push(0);
									}
									for (var i = 0; i < container.children.length; i++) {
										var order = (i + 1) % COL_COUNT || COL_COUNT;
										container.children[i].style.order = order;
										col_heights[order-1] += parseFloat(container.children[i].clientHeight);
									}
									var highest = Math.max.apply(Math, col_heights);
									for(let i = 0; i < COL_COUNT; i++)
									{
										if(col_heights[i] != highest)
										{
											let node = document.createElement("div");
											node.style.height = highest - col_heights[i] + "px";
											node.style.order = i + 1;
											container.appendChild(node);
										}
									}
									container.class = highest+'px';
									container.style.height = highest+'px';
								}
							}}
						/>);

			return (
				<a
					class={style.block}
					// className={css(classes.thumbnail, classes[obj.orientation])}
					key={i}
					onClick={(e) => this.openLightbox(i, e)}
					order={order}
				>
					{img}
				</a>

			);
		});


				/*<div class={style.block}>
					{img}
				</div>*/

				/*<a
					class={style.block}
					// className={css(classes.thumbnail, classes[obj.orientation])}
					key={i}
					onClick={(e) => this.openLightbox(i, e)}
					order={order}
				>
					<div class={style.inner}>{i}</div>
				</a>
				*/

			/*<div className={css(classes.gallery)}>
				{gallery}
			</div>*/

		return (
			<div  class={style.gallery}>
				<div id={style["block-contain"]}>
					{gallery}
				</div>
			</div>
		);
	}
	render () {
		let gallery = this.renderGallery();

		return (
			<div className="section">
				{this.props.heading && <h2>{this.props.heading}</h2>}
				{this.props.subheading && <p>{this.props.subheading}</p>}
				{gallery}
				<Lightbox
					currentImage={this.state.currentImage}
					images={this.props.images}
					isOpen={this.state.lightboxIsOpen}
					onClickImage={this.handleClickImage}
					onClickNext={this.gotoNext}
					onClickPrev={this.gotoPrevious}
					onClickThumbnail={this.gotoImage}
					onClose={this.closeLightbox}
					showThumbnails={this.props.showThumbnails}
					theme={this.props.theme}
				/>
			</div>
		);
	}
}

Gallery.displayName = 'Gallery';
Gallery.propTypes = {
	heading: PropTypes.string,
	images: PropTypes.array,
	showThumbnails: PropTypes.bool,
	subheading: PropTypes.string,
};

const gutter = {
	small: 2,
	large: 4,
};
const classes = StyleSheet.create({
	gallery: {
		marginRight: -gutter.small,
		overflow: 'hidden',
		display: 'flex',
		flexFlow: 'column wrap',

		'@media (min-width: 500px)': {
			marginRight: -gutter.large,
		},
	},

	// anchor
	thumbnail: {
		boxSizing: 'border-box',
		display: 'block',
		float: 'left',
		lineHeight: 0,
		paddingRight: gutter.small,
		paddingBottom: gutter.small,
		overflow: 'hidden',
	    flex: '1 0 auto',
	    overflow: 'hidden',

		'@media (min-width: 500px)': {
			paddingRight: gutter.large,
			paddingBottom: gutter.large,
		},
	},

	// orientation
	landscape: {
		width: '30%',
	},
	square: {
		paddingBottom: 0,
		width: '40%',

		'@media (min-width: 500px)': {
			paddingBottom: 0,
		},
	},

	// actual <img />
	source: {
		border: 0,
		display: 'block',
		height: 'auto',
		maxWidth: '100%',
		width: 'auto',
	},
});

export default Gallery;