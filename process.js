const fs = require('fs');
const path = require('path');
const im = require('imagemagick');

let isDirectory = (filepath) => {
	if (typeof filepath !== 'string') {
		throw new Error('expected filepath to be a string');
	}

	try {
		var stat = fs.statSync(filepath);
		return stat.isDirectory();
	} catch (err) {
		throw err;
	}
	return false;
};

let copyFile = (source, target) => {
    return new Promise(function(resolve, reject) {
        var rd = fs.createReadStream(source);
        var wr = fs.createWriteStream(target);
        let rejectCleanup = (err) => {
            rd.destroy();
            wr.end();
            reject(err);
        };
        rd.on('error', rejectCleanup);
        wr.on('error', rejectCleanup);
        wr.on('finish', resolve);
        rd.pipe(wr);
    });
}

// Constants
const toProcessPath = "to_process/";
const albumsPath = "src/albums/";
const knownExtensions = ['.jpg', '.jpeg', '.png'];

// Check if `to_process` folder exists
if(!isDirectory(toProcessPath)) 
	return console.log(`\`${toProcessPath}\` is not a valid directory !`);


// Check if albums directory exists
if(!isDirectory(albumsPath)) 
	return console.log(`\`${albumsPath}\` is not a valid directory !`);

// Check if there is something to process
let albumsToProcess;
try {
	albumsToProcess = fs.readdirSync(toProcessPath);
} catch (err) {
	console.log(`Error while reading \`${toProcessPath}\` content`);
	throw err;
}

// Exit if there is nothing to do
if(albumsToProcess.length === 0)
	return console.log("Nothing to process. End.");

// Only keep album directories
for(let i = 0; i < albumsToProcess.length; i++)
{
	let directory = toProcessPath + albumsToProcess[i];
	try {
		if(!isDirectory(directory)) {
			albumsToProcess.splice(i, 1);
			i--;
		}
	} catch (err) {
		console.log(err);
		console.log(`Error while checking \`${directory}\` for directory`);
	}
}

for(let i = 0; i < albumsToProcess.length; i++)
{
	let pathToAlbum;
	let files;
	// Get files in the album
	try {
		pathToAlbum = path.join(toProcessPath, albumsToProcess[i]);
		files = fs.readdirSync(pathToAlbum);
	} catch (err) {
		console.log(`Error while reading \`${pathToAlbum}\` content`);
		throw err;
	}
	// Filter known file formats
	for(let j = 0; j < files.length; j++)
	{
		let file = pathToAlbum + files[j];
		try {
			const ext = path.extname(file);
			if(knownExtensions.indexOf(ext) === -1)
			{
				files.splice(j, 1);
				j--;
			}
		} catch (err) {
			console.log(err);
			console.log(`Error while checking \`${directory}\` for directory`);
		}
	}

	// Save the list of files to process
	albumsToProcess[i] = {title: albumsToProcess[i], files: files};
}

// Debug message
// XX: ALBUM_NAME (YY file(s))
console.log("Albums to process:")
for(let i in albumsToProcess)
{
	console.log(`${parseInt(i) + 1}: ${albumsToProcess[i].title} (${albumsToProcess[i].files.length} file${albumsToProcess[i].files.length>1?'s':''})`)
}

// Get already existing albums to be able to merge new pictures
// Read all files in the albums directory 
let albums;
try {
	albums = fs.readdirSync(albumsPath);
} catch (err) {
	console.log(`Error while reading \`${albumsPath}\` content`);
	throw err;
}

// Only keep album directories
for(let i in albums)
{
	let directory = albumsPath + albums[i];
	try {
		if(!isDirectory(directory)) {
			albums.splice(i, 1);
		}
	} catch (err) {
		console.log(err);
		console.log(`Error while checking \`${directory}\` for directory`);
	}
}


// Generate thumbnails and index.js, copy pictures
let albumsPromises = albumsToProcess.map((album)=>{
	return new Promise((resolve, reject) => {
		const albumToProcessPath = path.join(toProcessPath, album.title);
		const albumOutputPath = path.join(albumsPath, album.title);

		try {
			if(!fs.existsSync(albumOutputPath))
			{
				fs.mkdirSync(albumOutputPath, 0o755);
				albums.push(album.title);
			}
		} catch (err) {
			reject(err);
		}

		// Thumbnails promises generation
		let thumbnailPromises = album.files.map((file) => {
			const fileToProcessPath = path.join(albumToProcessPath, file);
			const fileOutputPath = path.join(albumOutputPath, file);
			return new Promise((resolvef, rejectf) => {
				im.convert([
					fileToProcessPath, 
					'-resize', 
					'300x', 
					'+repage', 
					'-unsharp', 
					'0x.5', 
					'-quality',
					'50',
					fileOutputPath + '-small'], 
				function(err, stdout) {
					if (err) return rejectf(err);
					return resolvef();
				});
			});
		});
		let copyPicturesPromises = album.files.map((file) => {
			return copyFile(path.join(albumToProcessPath, file), path.join(albumOutputPath, file));
		});
		let indexGenerationPromise = new Promise((resolvei, rejecti) => {
			// Check if album already exist to merge new pictures in it
			if(albums.indexOf(album.title) != -1)
			{
				// Import list of already existing pictures
				const index = './' + albumOutputPath + '/index.js';
				if (fs.existsSync(index)) {
					let existingPictures = require(index);
					// Check for duplicates
					for(let i = 0; i < album.files.length; i++) {
						for(let j = 0; j < existingPictures.length; j++) {
							if(album.files[i] == existingPictures[j]) {
								// Remove from the list before merging
								existingPictures.splice(j, 1);
								j--;
								break;
							}
						}
					}
					album.files = album.files.concat(existingPictures);
				}
			}

			// index.js generation
			let indexContent = 'module.exports = [\n';
			for(let j = 0; j < album.files.length; j++)
			{
				indexContent += '\t"' + album.files[j] + '",\n';
			}
			indexContent += ']';

			try {
				fs.writeFileSync(path.join(albumOutputPath, 'index.js'), indexContent);
				resolvei();
			} catch(err) {
				rejecti(err);
			}
		});

		Promise.all([].concat(thumbnailPromises, copyPicturesPromises, indexGenerationPromise))
		.then(()=>{
			resolve();
		})
		.catch(reject);
	});
});

// Execute all promises in parallel
Promise.all(albumsPromises)
.then(()=>{
	// Build the list of valid albums
	let indexContent = "";
	let albumTitle = (i) => albums[i].replace('"', '\\"');
	for(let i = 0; i < albums.length; i++) {
		indexContent += `import Album${i} from "./${albumTitle(i)}"\n`;
	}
	indexContent += '\nmodule.exports = [\n';
	for(let i = 0; i < albums.length; i++) {
		indexContent += `\t{title: "${albumTitle(i)}", pictures: Album${i}},\n`;
	}
	indexContent += ']';
	try {
		fs.writeFileSync(path.join(albumsPath, 'index.js'), indexContent);
	} catch(err) {
		throw(err);
	}
})
.catch(console.log);
