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


## What libraries does this use?

### Vite / React

We've used [Vite](https://vitejs.dev/) to simplify the development and build experience. 

### Tailwind CSS

We use [Tailwind](https://tailwindcss.com/) so the UI is easy to theme quickly, and reduce the number of CSS classes used throughout the project.

### Radix

For interactive components, we make use of [Radix](https://www.radix-ui.com/).

