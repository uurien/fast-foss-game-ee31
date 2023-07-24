'use strict'

const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')


module.exports = {
    start () {
        http.createServer(function (req, res) {
            // parse URL
            const parsedUrl = url.parse(req.url);
            // extract URL path
            let pathname = `.${parsedUrl.pathname}`;
            // based on the URL path, extract the file extension. e.g. .js, .doc, ...
            if (pathname.endsWith('/')) {
                pathname += 'index.html'
            }
            const ext = path.parse(pathname).ext;

            // maps file extension to MIME typere
            const map = {
                '.ico': 'image/x-icon',
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.json': 'application/json',
                '.css': 'text/css',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.wav': 'audio/wav',
                '.mp3': 'audio/mpeg',
                '.svg': 'image/svg+xml',
                '.pdf': 'application/pdf',
                '.doc': 'application/msword'
            };
            pathname = path.join('..', 'game', pathname)
            fs.exists(pathname, function (exist) {
                if (!exist) {
                    // if the file is not found, return 404
                    res.statusCode = 404;
                    res.end(`File ${pathname} not found!`);
                    return;
                }

                // if is a directory search for index file matching the extension
                if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

                // read file from file system
                fs.readFile(pathname, function (err, data) {
                    if (err) {
                        res.statusCode = 500;
                        res.end(`Error getting the file: ${err}.`);
                    } else {
                        // if the file is found, set Content-type and send data
                        res.setHeader('Content-type', map[ext] || 'text/plain');
                        res.end(data);
                    }
                });
            });
        }).listen(8080)
    }
}