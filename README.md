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


## Physics enabled Demos
To run examples uncomment function calls in Canvas.js componentDidMount()

## Demos Completed
- Slingshot
- Newton's Cradle
- Rube Goldeberg's Machine
- Piston Mechanism

## Demos Remaining
- Pinball
- Pong
- In Situ Actuated TUI
- Rope Control