# RTVI Patient Intake Demo

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

`VITE_SHOW_SPLASH`

Show an initial splash screen (Splash.tsx).

**Please note: if you disable the splash page, devices will likely not load until you issue a user intent to the page. It is recommend to obtain user intent via a click somewhere before device selection**


## Regarding HMR

Whilst this app works well with hot reloading, the underlying WebRTC dependencies on some transports will throw errors if they are reinitialized. Check your console for warnings if something doesn't appear to be working.

## What libraries does this use?

### Vite / React

We've used [Vite](https://vitejs.dev/) to simplify the development and build experience.

### Tailwind CSS

We use [Tailwind](https://tailwindcss.com/) so the UI is easy to theme quickly, and reduce the number of CSS classes used throughout the project.

### Radix

For interactive components, we make use of [Radix](https://www.radix-ui.com/).
