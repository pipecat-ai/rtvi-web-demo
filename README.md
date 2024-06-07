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

---

## TODO:

- Compile style modules with media queries
- Move layout styles to layout.css
- Use global media query to change common variables (font size, gutter etc)
- Rename "styles.module.css" to component specific