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

`VITE_SERVER_URL`

A server URL to trigger when starting a session (e.g. a Pipecat bot_runner) that instantiates a new agent at the specified room URL.  Note: If this is not set, the app will assume you will manually start your bot at the same room URL (and show a warning on the config screen in dev mode.)

VITE_MANUAL_ROOM_ENTRY=... #optional: require user to specify a room URL to join 
VITE_MANUAL_START_BOT= # Do not require or call the server URL (start your bot manually)
VITE_OPEN_MIC= # Can the user speak freely, or do they need to wait their turn? 
VITE_USER_VIDEO= #Does the app require the user's webcam?
VITE_DAILY_API_URL=https://api.daily.co/v1
VITE_SHOW_SPLASH=1 # Show a splash page with marketing info
VITE_SHOW_CONFIG= # Show demo config options first


## What libraries does this use?

### Vite / React

We've used [Vite](https://vitejs.dev/) to simplify the development and build experience. 

### Tailwind CSS

We use [Tailwind](https://tailwindcss.com/) so the UI is easy to theme quickly, and reduce the number of CSS classes used throughout the project.

### Radix

For interactive components, we make use of [Radix](https://www.radix-ui.com/).

