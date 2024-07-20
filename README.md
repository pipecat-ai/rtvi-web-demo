# Pipecat Client Web UI

Some docs regarding how all this fits together: [here](/docs/)

## Getting setup


Install deps and build the UI:

```
mv env.example .env.development.local
yarn 
yarn run build

```

Navigate to https://localhost:5173

## Configuring your env

`VITE_APP_TITLE`

Name of your bot e.g. "Simple Chatbot" (shown in HTML and intro)

`VITE_BASE_URL`

A server URL to trigger when starting a session (e.g. a Pipecat bot_runner) that instantiates a new agent at the specified room URL.  Note: If this is not set, the app will assume you will manually start your bot at the same room URL (and show a warning on the config screen in dev mode.)

`VITE_MANUAL_ROOM_ENTRY`

Disable automatic room creation. User must enter a room URL to join or pass through `room_url` query string.

`VITE_SHOW_SPLASH`

Show an initial splash screen (Splash.tsx).

`VITE_SHOW_CONFIG`

Show app settings before device configuration, useful for debugging.

`VITE_OPEN_MIC`

Not currently in use

`VITE_USER_VIDEO`

Not currently in use


## What libraries does this use?

### Vite / React

We've used [Vite](https://vitejs.dev/) to simplify the development and build experience. 

### Tailwind CSS

We use [Tailwind](https://tailwindcss.com/) so the UI is easy to theme quickly, and reduce the number of CSS classes used throughout the project.

### Radix

For interactive components, we make use of [Radix](https://www.radix-ui.com/).

