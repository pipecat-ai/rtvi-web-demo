# RTVI Web Demo


## Getting setup

Setup your .env.local

```
cp env.example .env.local
```

Install deps and build the UI:

```
yarn 
yarn run dev
```

Navigate to the URL shown in your terminal window.



## Configuring your env

`VITE_BASE_URL`

The location of your bot running infrastructure. A default is provided for you to test. 

If you want to run your own infrastructure, please be aware that `navigator` requires SSL / HTTPS when not targeting `localhost`.

## Regarding HMR

Whilst this app works well with hot reloading, the underlying WebRTC dependencies on some transports will throw errors if they are reinitialized. Check your console for warnings if something doesn't appear to be working.

## User intent

When not in local development, browsers require user intent before allowing access to media devices (such as webcams or mics.) We show an initial splash page which requires a user to click a button before requesting any devices from the navigator object. Removing the `Splash.tsx` willcause an error when the app is not served locally which you can see in the web console. Be sure to get user intent in your apps first!

## What libraries does this use?

### Vite / React

We've used [Vite](https://vitejs.dev/) to simplify the development and build experience. 

### Tailwind CSS

We use [Tailwind](https://tailwindcss.com/) so the UI is easy to theme quickly, and reduce the number of CSS classes used throughout the project.

### Radix

For interactive components, we make use of [Radix](https://www.radix-ui.com/).

