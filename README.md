# gallery.maximeborg.es

:camera: Static photos gallery made with [Preact](https://github.com/developit/preact). Each albums is generated using a script to index the photos and generating the thumbnails.

---

## Run !

**1. Clone this repo:**

```sh
git clone https://github.com/maximeborges/gallery.maximeborg.es.git gallery.maximeborg.es
cd gallery.maximeborg.es
```

**2. Install dependencies:**
```sh
yarn
```
or (slower)
```sh
npm install
```

**3. Add albums:**

```sh
cp -r ~/Images/My-Album/ ./to_process/
```

**4. Build !:**

```sh
yarn build
```

> You're done! Now serve the `build` folder from wherever you want!


## Serving

Since this application use `preact-router`, you can access any page with a simple rewrite rule from your reverse-proxy.  There is an example using Caddy: 

```haskell
gallery.maximeborg.es {
    header / server "AN AMAZING UNICORN"
    tls contact@maximeborg.es
    root /var/www/gallery.maximeborg.es
    gzip
    rewrite / {
        ext !jpg !jpeg !png
        to {path} /
    }
}
```

> The extensions line (`ext !jpg !jpeg !png`) in the `rewrite` section allows to have direct access to images via their URL, and not to be redirected to the `html` content 


## Development

The web part of this application is based on [preact-boilerplate](https://github.com/developit/preact-boilerplate), you can check out the [developement workflow](https://github.com/developit/preact-boilerplate#development-workflow) section to get how to work on this project.

The processing of the albums is done with the `process.js` file. It's a little bit messy in there but I got it working perfectly for me. If anyone want to imporve it, pull request are welcomed!

---


## License

MIT


[Preact]: https://github.com/developit/preact
[preact-compat]: https://github.com/developit/preact-compat
[webpack]: https://webpack.github.io