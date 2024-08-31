# SearchDemo
This project uses Google's "Custom Search JSON API" to access internet search results, displays them and let's you save first page results as XML(XHTML) file on your machine.

## How to run

After cloning this repository, create new process.env file in project's directory with following variables:
```
HOSTNAME=value;
PORT=value;
APIKEY=value;
ENGINEID=value;
```

"APIKEY" and "ENGINEID" can be obtained here:
Creating search engine: https://programmablesearchengine.google.com/controlpanel/create

Obtaining API key: https://developers.google.com/custom-search/v1/introduction

After this setup, just execute these two commands(requires [Node.js](https://nodejs.org/en)). 
These will install dependencies and run project.
```
npm install 
npm start
```

Finally, visit "HOSTNAME:PORT" url in browser.