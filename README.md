![logo](https://avatars2.githubusercontent.com/u/20493267?v=3&s=200)

# Edgemesh: Peer Enhanced CDN

[![AlwaysGood](https://img.shields.io/badge/build-passing-green.svg)](https://github.com/edgemesh/edgemesh/tags)
[![GitHub release](https://img.shields.io/github/release/edgemesh/edgemesh.svg?maxAge=2592000)](https://github.com/edgemesh/edgemesh)
[![npm](https://img.shields.io/npm/l/edgemesh.svg?maxAge=2592000)](https://www.npmjs.com/package/edgemesh)

[![Github All Releases](https://img.shields.io/github/downloads/edgemesh/edgemesh/total.svg?maxAge=2592000)]()
[![npm](https://img.shields.io/npm/dm/edgemesh.svg?maxAge=2592000)](https://www.npmjs.com/package/edgemesh)
[![npm](https://img.shields.io/npm/dt/edgemesh.svg?maxAge=2592000)](https://www.npmjs.com/package/edgemesh)

[![GitHub issues](https://img.shields.io/github/issues-raw/edgemesh/edgemesh.svg?maxAge=2592000)](https://github.com/edgemesh/edgemesh/issues)
[![Closed issues](https://img.shields.io/github/issues-closed-raw/edgemesh/edgemesh.svg?maxAge=2592000)](https://github.com/edgemesh/edgemesh/issues)
[![Gitter](https://img.shields.io/gitter/room/edgemesh/help.svg?maxAge=2592000)](https://gitter.im/edgemesh/help)

❗ Edgemesh is in early beta. 

## Requirements

- Edgemesh requires that your website be secured with ssl.  We like [letsencrypt](https://letsencrypt.org/).
- You will need to create an free account on our [portal](https://edgemesh.com) in order to start meshing.

## Install with npm

1. Add `emsw.js` to your webserver.
2. `npm i edgemesh --save`.
3. Start edgemesh as early as possible in your app.

```javascript
// ES6
import edgemesh from 'edgemesh';
edgemesh();

// ES5
require('edgemesh')();
```

### 🍺 You're done!

## Install with `<script>` tag

### Step 1

1. Add `emsw.js` and `edgemesh.inject.min.js` to your webserver root.
2. Add `<script>` tag to `<head>` element in `index.html`

```html
<script type="text/javascript" src="/edgemesh.inject.min.js" onload="new window.EdgeMesh()" ></script>
```

### 🍺 You're done!

## Options

The edgemesh constructor has a few options.

### `debug`: (default: `false`) 
Turn on debug mode.

> ⚠  This will print all edgemesh activity to the console.  Don't leave it on in production.

### `client`: (default: `sig.edgeno.de`)
The url to `edgemesh.inject.min.js`.

> ⚠  If you decide to self host the edgemesh inject file, you will need to set the `client` option.  It should be the same as the `origin` you registered in our [portal](https://edgemesh.com). Do not specify a protocol (~~https://~~).

### `host`: (default: `sig.edgeno.de`)
The url to edgemesh signaling servers and apis.

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
    type="text/javascript" 
    src="/edgemesh.inject.min.js" 
    onload="new window.EdgeMesh({ client: 'example.com' })">
</script>
```