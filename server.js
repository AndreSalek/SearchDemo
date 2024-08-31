"use strict"
var express = require('express');
var url = require('url');
const path = require('path');

const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 8080;

const googleApi = 'https://www.googleapis.com/customsearch/v1'
// Removed - should not be distributed
// https://developers.google.com/custom-search/v1/overview
const apiKey = process.env.APIKEY || ''
const engineId = process.env.ENGINEID || ''

const server = express();
server.use(express.static(__dirname));

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

server.get('/search', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let target = createApiUrl(req.query.q);
    //res.json(getJson());
    fetch(target)
        .then((result) => {
            if (result.ok) {
                return result.json().then(data => {
                    res.json(data)
                })
            }
            else if (result.status == 400) {
                res.statusCode = 400;
                return res.json({ "error": "Request could not be processed. Try again." });
            }
            else if (result.status == 429)
            {
                res.statusCode = result.status;
                res.json({ "error": "API quota exceeded daily limit" })
            }
            else throw new Error('Error while processing request');
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({ "error": "Internal server error" });
        })
});

server.listen(port, hostname, () => {
    console.log (`Listening on ${hostname}:${port}`)
})

function createApiUrl(query) {
    let url = new URL(googleApi);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('cx', engineId);
    url.searchParams.append('q', query);
    url.searchParams.append('fields', 'items(htmlTitle,link,snippet,pagemap/cse_thumbnail,pagemap/metatags,pagemap/cse_image)');

    return url;
}
