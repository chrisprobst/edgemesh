![logo](https://avatars2.githubusercontent.com/u/20493267?v=3&s=200)

# Edgemesh: Peer Enhanced CDN

[![AlwaysGood](https://img.shields.io/badge/build-passing-green.svg)](https://github.com/edgemesh/edgemesh/tags)
[![GitHub release](https://img.shields.io/npm/v/edgemesh.svg?maxAge=2592000)](https://github.com/edgemesh/edgemesh)
[![npm](https://img.shields.io/npm/l/edgemesh.svg?maxAge=2592000)](https://www.npmjs.com/package/edgemesh)
[![Gitter](https://img.shields.io/gitter/room/edgemesh/help.svg?maxAge=2592000)](https://gitter.im/edgemesh/help)

[![Github All Releases](https://img.shields.io/github/downloads/edgemesh/edgemesh/total.svg?maxAge=2592000)]()
[![npm](https://img.shields.io/npm/dm/edgemesh.svg?maxAge=2592000)](https://www.npmjs.com/package/edgemesh)
[![npm](https://img.shields.io/npm/dt/edgemesh.svg?maxAge=2592000)](https://www.npmjs.com/package/edgemesh)


> ✋ Edgemesh is in early access.  To sign up for early access, please visit [edgemesh.com](edgemesh.com). 

## Requirements

- Edgemesh requires that your website be secured with ssl.  We like [letsencrypt](https://letsencrypt.org/).
- You will need to create an free account on our [portal](https://edgemesh.com) in order to start meshing.

> ✋ Edgemesh portal is in development.  Sign up for early access to start meshing.

## Browser Installation

### Step 1

1. Add `emsw.js` and `edgemesh.inject.min.js` to your webserver.
2. Add `<script>` tag to `<head>` element in `index.html`

```html
<script type="application/javascript" src="/edgemesh.inject.min.js" onload="new EdgeMesh()" ></script>
```

### 🍺 You're done!

## Install with npm

1. `npm i edgemesh --save`.
2. `edgemesh install </path/to/static>`
3. Start edgemesh as early as possible in your app.

```javascript
// ES6
import edgemesh from 'edgemesh';
edgemesh();

// ES5
require('edgemesh')();
```

### 🍺 You're done!


## Options

The edgemesh constructor has a few options.

### `debug`: (default: `false`) 
Turn on debug mode.

> ⚠  This will print all edgemesh activity to the console.  Don't leave it on in production.

### `client`: (default: `/`)
The static path where `edgemesh.inject.min.js` and `emsw.js` are accessable.
Defaults to the root of your domain.


### `host`: (default: `sig.edgeno.de`)
The url to edgemesh signaling servers and apis.
Defaults to edgemesh signaling service.

> ⚠  Don't change this unless instructed by edgemesh support.

### Examples

#### Node

```javascript
// ES6
import edgemesh from 'edgemesh';
edgemesh({
    client: 'example.com',
    host: 'sandbox.signo.de',
    debug: true
});

// ES5
require('edgemesh')({
    client: 'example.com',
    host: 'sandbox.signo.de',
    debug: true
});
```

#### Browser

```html
<script 
    type="application/javascript" 
    src="/edgemesh.inject.min.js" 
    onload="new EdgeMesh({ 
        client: 'example.com', 
        host: 'sandbox.signo.de', 
        debug: true })">
</script>
```

## CLI

Sometimes your static file server isn't colocated with your application.
If you're have [node.js](https://nodejs.org) installed we've got you covered.

Install edgemesh globally 
```bash
npm i -g edgemesh
```

Install edgemesh files to your static root 
```bash
edgemesh install /path/to/static
```

This will install `emsw.js` and `edgemesh.inject.min.js` at the supplied path. 
It also stores the path at `/usr/local/etc/edgemesh/edgemesh.conf` so you can run:

```bash
npm i -g edgemesh && edgemesh update
```

on subsequent updates.  To check if you have the latest version run:

```bash
edgemesh check-updates
```

### CLI Api
```bash
Usage: edgemesh <command> [options]


Commands:

    install|i <path>  install edgemesh server files at static path
    update|u          update edgemesh server files
    check-updates|v   check for newer version

Options:

    -h, --help     output usage information
    -V, --version  output the version number

Examples:

    $ edgemesh install ./server/static
    $ edgemesh update
    $ edgemesh check-updates
```

 