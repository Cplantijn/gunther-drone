Gunther's Dashboard
===================
Control "Gunther", your personal Parrot Rolling Spider Drone!

This is a small project I worked on over the weekend while trying to learn React.js. It is rather messy, but this project runs a node/express server that catches POST requests from the client to control your Rolling Spider AR Drone. 

The entire front-end (besides the banner) is created with React.js and complemented by Bootstrap 3 styling.

I would like to thank FluffyJack for creating his [awesome library](https://github.com/FluffyJack/node-rolling-spider) that this depends upon.

Features
---------
From the app, inside your browser, you can...

- Search and connect to nearby Rolling Spider AR Drones by UUID.
- Take Off & Land
- Forward, Backwards, Strafing, Turning, Flips, and a Kill Switch
- View battery levels, updated every 5 seconds


Instructions
------------

*Requirements*

- Bluetooth enabled device
- node v.10 +
- A Parrot Rolling Spider Drone
- NPM

*Instructions*

* clone this repo to a directory
* run `npm install`
* run `gulp`


