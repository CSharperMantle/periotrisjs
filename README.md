# Periotris.js

> Get familiar with the Periodic Table of Elements in a fun way, directly in your browsers.

A Progressive Web App-compliant Periotris game built with [React](https://reactjs.org/), [Gatsby](https://www.gatsbyjs.com/) and [Material UI](https://material-ui.com/).

![Periotris.js v2.0.1 PWA screenshot](https://user-images.githubusercontent.com/32665105/152916976-93b9617a-7f82-489c-9ede-92f16a2c45e9.png)
_Figure: Periotris.js v2.0.1 screenshot_

#### Build status

- `develop`: [![Gatsby](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml/badge.svg?branch=develop)](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml)
- `main`: [![Gatsby](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml/badge.svg?branch=main)](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml)
- `CodeQL` on `develop`: [![CodeQL](https://github.com/CSharperMantle/periotrisjs/actions/workflows/codeql.yml/badge.svg?branch=develop)](https://github.com/CSharperMantle/periotrisjs/actions/workflows/codeql.yml)

## Experience Periotris.js

Instances of Periotris.js are hosted on GitHub Pages and Vercel.

- GitHub Pages: [https://csharpermantle.github.io/periotrisjs](https://csharpermantle.github.io/periotrisjs)
- Vercel: [https://periotrisjs.vercel.app/](https://periotrisjs.vercel.app/).
- Vercel (develop preview): [https://periotrisjs-git-develop-csharpermantle.vercel.app/](https://periotrisjs-git-develop-csharpermantle.vercel.app/)

The game can also act as a [Progressive Web Application](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps). This enables it to be installed like a native app on browsers supporting PWAs. Known browsers that support this feature include Microsoft Edge and Firefox.

### In-game controls

#### Keyboard

- `W`: Rotate
- `A`: Move left
- `D`: Move right
- `S`: Move down
- `Space`: Instant drop

#### Pointer gesture

- `Tap`: Rotate
- `Swipe left`: Move left
- `Swipe right`: Move right
- `Swipe down`: Move down
- `Long press`: Instant drop

## Getting started in development

### Clone

Run:

```sh
git clone --depth 1 -- https://github.com/CSharperMantle/periotrisjs.git
cd periotrisjs
```

You may omit the `--depth=1` flag if you want a complete commit history rather than a grafted shallow history (which saves disk space). **Reminder:** Do not use 'Download ZIP' button! Make sure that you have your git repository initialized or Periotris.js will fail to determine its revision.

### Install dependencies

Dependencies that need to be installed manually:

- [Node.js v14.x+](https://nodejs.org/)
- [yarn v2+](https://yarnpkg.com/)

Once you have installed all above, run the following commands:

```sh
yarn install --immutable
```

### Build and serve

Run the following command to build and serve a static, release-ready [Gatsby](https://gatsbyjs.com/) site:

```sh
yarn run build && yarn run serve
```

If you prefer hot-reload, friendly exception messages and other development-friendly features of Gatsby, run the following commands to start a dev server:

```sh
yarn run develop
```

After these commands are executed, you should see in the terminal an address to visit.
The address is usually `http://localhost:8000/` or `http://localhost:9000/` depending on whether your build is for dev or production.

### Test

Run the following to run unit tests:

```sh
yarn run test
```

Normally every test suite should be "PASSED".
