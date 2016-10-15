/**
 * Edgemesh Service Worker
 * @author Randy Lebeau
 * 
 */

var CACHE_NAME = 'dependencies-cache';
var STORAGE_URL = 'https://sig.edgeno.de';
var REQUIRED_FILES = [
	STORAGE_URL + '/1px.png',
];

var DOM_LOADED = 'DOM_LOADED',
    DOM_UNLOADED = 'DOM_UNLOADED',
    MESH_INTERCEPT = 'MESH_INTERCEPT';

var DEBUG = false;

self.version = 1.0;
self.supportedExtensions = ['jpg', 'gif', 'png', 'bmp', 'svg', 'webp'];

var state = {};

self.addEventListener('install', (event) => {
    // Set up initial state
    state.dom_loaded = false;
    state.pending_assets = {};


    // Set up file cache
    event.waitUntil(caches.open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll(REQUIRED_FILES);
        })
        .then(() => {
            return self.skipWaiting();
        })
        .catch((err) => {
            console.log(err);
        }));
});

// Set up postmessage handler
self.addEventListener('message', (event) => {
    switch(event.data.channel) {
        case DOM_LOADED:
            state.dom_loaded = true;
            // Process queue
            respondMesh(state.pending_assets)
                .then(() => {
                    state.pending_assets = {};
                });
            break;
        case DOM_UNLOADED:
            state.dom_loaded = false;
            break;
    }
});

// Handle Fetch event
self.addEventListener('fetch', (event) => {

    // Get url from event
    let url = event.request.url;

    // Get extension
    let urlArray = url.split('.'),
        fileExtension = urlArray[urlArray.length - 1].toLowerCase();

    if (self.supportedExtensions.indexOf(fileExtension) !== -1 && state.pending_assets) {
        
        let location = getLocation(url),
            origin_id = hash(location.hostname),
            asset_id = hash(location.pathname);

        respondBlank(event, caches);

        if(!state.dom_loaded) {
            // DOM isnt ready.  Push into queue
            state.pending_assets[url] = origin_id + '|' + asset_id;
        } else {
            let asset = {};
            asset[url] = origin_id + '|' + asset_id;
            respondMesh(asset);
        }
    } else {
        // Not a mesh file.  Skip.
        event.respondWith(fetch(event.request));
    }
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

var respondMesh = (assets) => {
    return new Promise((resolve, reject) => {
        self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
                client.postMessage({
                    channel: MESH_INTERCEPT,
                    value: { assets }
                });
            });
            resolve();
        });
    });
}

var respondBlank = (event, caches) => {
    event.respondWith(
        caches.match(STORAGE_URL + '/1px.png')
            .then((response) => {
                // Cache hit - return the response from the cached version
                if (response) {
                    return response;
                } else {
                    // No cache hit, fetch!
                    fetch(STORAGE_URL + '/1px.png', {
                        mode: 'no-cors'
                    });
                }
            })
    );
}

var hash = (key) => {
	let hash = 0, i, char, len;
	if (key.length == 0) return hash;
    for (i = 0; i < key.length; i++) {
        char = key.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

var getLocation = (href) => {
    // TODO investigate why Canary intercepts chrom-extension hostname (specifically for ghostery extension)
    let match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
    }
}