module.exports = function(options) {
    var host = options.host || 'https://sig.edgeno.de';
    var client = options.client || document.location.hostname;
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');

    script.type = 'text/javascript';
    script.onload = function() {
        new window.Edgemesh({ 
            debug: options.debug || false,
            host: host,
            client: client 
        });
    }
    script.src = 'https://' + client + '/edgemesh.inject.min.js';
    head.appendChild(script);
}