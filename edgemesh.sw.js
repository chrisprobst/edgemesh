/**
 * Edgemesh Service Worker
 * 
 * @module emsw 
 * 
 */

// event constants
var DOM_LOADED = 'DOM_LOADED',
    DOM_UNLOADED = 'DOM_UNLOADED',
    MESH_INTERCEPT = 'MESH_INTERCEPT';
// service worker version
self.version = 1.0;
// supported extensions
self.supportedExtensions = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'svg', 'webp'];
// the state of the edgemesh DOM is stored here
var state = {};
// when the service worker installs
self.addEventListener('install', (event) => {
    // Set up initial state
    state.dom_loaded = false;
    state.fetch_active = false;
    state.pending_assets = {};
    // Skip waiting
    event.waitUntil(self.skipWaiting());

});
// postmessage event handler

self.addEventListener('activate', (event) => {

    event.waitUntil(self.clients.claim());

});

self.addEventListener('message', (event) => {
    switch(event.data.channel) {
        // called when the DOM is loaded
        case DOM_LOADED:
            // set loaded state
            state.dom_loaded = true;
            // process pending queue
            respondMesh(state.pending_assets)
                .then(() => {
                    state.pending_assets = {};
                });
            break;
        // called when the DOM is closed
        case DOM_UNLOADED:
            // reset state
            state.dom_loaded = false;
            state.fetch_active = false;
            break;
    }
});
// Handle Fetch event
self.addEventListener('fetch', (event) => {

    // Look for edgemesh script
    let isEdgemesh = event.request.url.indexOf('edgemesh.client.min.js') !== -1;
    // set fetch to active when script is found
    if(isEdgemesh) {
        state.fetch_active = true;
        state.dom_loaded = false;
    }
    // capture fetch events 
    if (state.fetch_active) {
        // Get url from event
        let url = event.request.url;

        // Get extension
        let urlArray = url.split('.'),
            fileExtension = urlArray[urlArray.length - 1].toLowerCase();

        if (self.supportedExtensions.indexOf(fileExtension) !== -1 && state.pending_assets) {
            
            let location = getLocation(url),
                origin_id = hash(location.hostname),
                asset_id = hash(location.pathname);

            respondBlank(event);

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
    }
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

var respondBlank = (event) => {
    event.respondWith( new Response( dataURItoBlob(onePixel)));
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

var dataURItoBlob = (dataURI)=> {
  
  let byteString = atob(dataURI.split(',')[1]);
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], {type: mimeString});

}

const onePixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi+P//PwNAgAEACPwC/tuiTRYAAAAASUVORK5CYII=';