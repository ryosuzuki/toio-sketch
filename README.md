# toio-sketch

## How to Get Started
```
npm install
```

For Mac users

```
HTTPS=true npm start
```

Note that, you need to use `HTTPS=true` when you try with mobile AR.


Then, please check `System Preferences > Network`, and check the IP address.
Make sure to be in the same network. Then, go to the URL.

For example, `https://10.0.1.2:3000/toio-sketch` with your iPad or Android device. Just ignore the warning and visit the website anyway.

Replace `index.html` with `index-8thwall.html` when using iPad or Android. When developing and debugging with the desktop machine, replace `index.html` with `index-desktop.html`


## How to Run with Toio
To synchronize the motion between the canvas and toio.js, you need to run "both" localhost:3000 (client-side) and localhost:4000 (server-side).

Therefore, you should run

```
HTTPS=true npm start
```

which runs the client-side code at `https://localhost:3000/toio-sketch`.
And then open a new tab in Terminal, then

```
node server.js
```

which runs the server-side code at `http://localhost:4000`.



## How to Run with iPad + Toio

A-Frame client runs at localhost:3000 and the toio.js server side runs at localhost:4000. Since A-Frame only works with https, so the server also needs to be exposed as https. There are several ways, but we are using tunnleto.dev for https tunneling. To do so, please do the following.

```
brew install agrinman/tap/tunnelto
tunnelto set-auth --key [YOUR_API_KEY]
tunnelto --subdomain toio-sketch --port 4000
```

You don't need to do that when you debug and develop within a desktop computer. You can just change

```
this.socket = io('https://toio-sketch.tunnelto.dev')
```

to

```
this.socket = io('http://localhost:4000')
```

in `App.js`. Then, it should work in the desktop.

## Physics enabled Demos
To run examples uncomment function calls in Canvas.js componentDidMount()

## Demos Completed (without Toio)
- Slingshot
- Newton's Cradle
- Rube Goldeberg's Machine
- Piston Mechanism
- Pinball
- Pong
- In Situ Actuated TUI
- Rope Control

## Todo
- Adding Toio control to each Demo