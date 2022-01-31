# Periotris.js

> Get familiar with the Periodic Table of Elements in a fun way, directly in your browsers.

A Progressive Web App-compliant Periotris game built with [React](https://reactjs.org/), [Gatsby](https://www.gatsbyjs.com/) and [Material UI](https://material-ui.com/).

![Periotris.js v1.3.2 PWA screenshot](https://user-images.githubusercontent.com/32665105/129712653-04dbe225-dd75-4143-ad22-7b0385b6b866.png)
_FIGURE 1: Periotris.js v1.3.2 screenshot, captured in a standalone PWA window in Microsoft Edge_

## Build status

- `develop` (Active development branch): [![Gatsby](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml/badge.svg?branch=develop)](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml)
- `main` (Stable release branch): [![Gatsby](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml/badge.svg?branch=main)](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml)
- `CodeQL` (Code security scanner): [![CodeQL](https://github.com/CSharperMantle/periotrisjs/actions/workflows/codeql.yml/badge.svg?branch=develop)](https://github.com/CSharperMantle/periotrisjs/actions/workflows/codeql.yml)
- `CodeClimate` (Code quality scanner): [![Maintainability](https://api.codeclimate.com/v1/badges/ae11798505dd181ae9a5/maintainability)](https://codeclimate.com/github/CSharperMantle/periotrisjs/maintainability)

## Getting started

### The popular way: play in browsers directly

Instances of Periotris.js are hosted on GitHub Pages and Vercel. Try it on [GitHub Pages](https://csharpermantle.github.io/periotrisjs) or [Vercel](https://periotrisjs.vercel.app/).

The game can also act as a [Progressive Web Application](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps). This enables it to be installed like a native app on browsers supporting PWAs. Known browsers that support this feature include Microsoft Edge and Firefox.

**Tips:** The app runs best on screens larger than 1024\*768. If you are using mobile browsers please switch to landscape for better experience.

### The geek way: build the project

#### Clone

Run (if you have not done it previously):

```sh
git clone https://github.com/CSharperMantle/periotrisjs.git --depth=1
cd periotrisjs
```

You may omit the `--depth=1` flag if you want a complete commit history rather than a grafted shallow history (which saves disk space).

#### Install dependencies

Dependencies that need to be installed manually:

- [Node.js v14.x+](https://nodejs.org/)
- [yarn v1](https://classic.yarnpkg.com/en/docs/install) **Important: yarn v2 is untested.**
- [Rust v1.50+](https://www.rust-lang.org/learn/get-started)
- [wasm-pack v1+](https://rustwasm.github.io/)

Once you have installed all above, run the following commands:

```sh
yarn install # for runtime deps
yarn global add gatsby-cli # for running Gatsby CLI commands
```

#### Build and serve

Run the following command to build and serve a static, release-ready [Gatsby](https://gatsbyjs.com/) site:

```sh
yarn run build && yarn run serve
```

If you prefer hot-reload, friendly exception notice and other development-friendly features of Gatsby, run the following commands to start a dev server:

```sh
yarn run develop
```

After these commands are executed, you should see in the terminal an address to visit.
The address is usually `http://localhost:8000/` or `http://localhost:9000/` depending on whether your build is for dev or production.

#### _OPTIONAL:_ Test

Run the following to start [`jest`](https://jestjs.io/) unit testing framework:

```sh
yarn global add jest # for jest framework
yarn run test
```

You should see green outputs like 'success' in the terminal after a while.

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
