# Pipecat Runner + Bot + WebUI Template

Some docs regarding how all this fits together: [here](/docs/)

## Getting setup

Create a virtualenv

`pip install requirements.txt`

`mv env.example .env` (enter keys)

`python bot_runner.py --host localhost`

## Adding the test UI

Set `SERVE_STATIC` to `True` in `bot_runner.py` (L37)

Build the UI:

```
cd web-ui/
yarn 
yarn run build
cd ..
python bot_runner.py --host localhost
```

Navigate to https://localhost:7860

## Serving UI externally from Bot Runner

Set `SERVE_STATIC` to `False` in `bot_runner.py` (L37)

Run the UI:

```
cd web-ui/
yarn 
mv env.example .env.development.local
```

Set `VITE_SERVER_URL` in `.env` to the URL of the API

```
yarn run dev
```

Navigate to https://localhost:5173 (ensure the API is running on `VITE_SERVER_URL` including the specified port)