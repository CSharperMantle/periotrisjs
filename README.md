# Periotris.js

A Progressive Web App-compliant Periotris game built with [React](https://reactjs.org/), [Gatsby](https://www.gatsbyjs.com/) and [Material UI](https://material-ui.com/).

![Periotris.js v1.3.2 PWA screenshot](https://user-images.githubusercontent.com/32665105/129712653-04dbe225-dd75-4143-ad22-7b0385b6b866.png)
*FIGURE 1: Periotris.js v1.3.2 screenshot, captured in a standalone PWA window in Microsoft Edge*

## Build status

| develop                                                                                                                                                                                      | main                                                                                                                                                                                      | CodeQL on develop                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![Gatsby](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml/badge.svg?branch=develop)](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml) | [![Gatsby](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml/badge.svg?branch=main)](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml) | [![CodeQL](https://github.com/CSharperMantle/periotrisjs/actions/workflows/codeql.yml/badge.svg?branch=develop)](https://github.com/CSharperMantle/periotrisjs/actions/workflows/codeql.yml) |

## Getting started

### Way One: Play in browsers directly

An instance of Periotris.js is hosted on GitHub Pages as a Progressive Web Application ([PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)). Try it [here](https://csharpermantle.github.io/periotrisjs).

**Tips:** The app runs best on screens larger than 1024*768. If you are using mobile browsers please switch to *landscape mode* for better experience.


### Way Two: Build the project

#### Clone

Run:

```sh
git clone https://github.com/CSharperMantle/periotrisjs.git --depth=1
cd periotrisjs
```

You may omit the `--depth=1` flag if you want a complete history rather than a grafted shallow history.

#### Install dependencies

The project need [**Node.js v14.x+**](https://nodejs.org/) environment to run. Please refer to their documents for installation guide on Node.js.

Once you have installed correct Node version, run the following:

```sh
npm install # for runtime deps
npm install -g gatsby-cli # for convenience in running Gatsby commands
```

#### Build

Run the following commands to build and serve a static, release-ready [Gatsby](https://gatsbyjs.com/) site:

```sh
gatsby build && gatsby serve
# ...or...
npm run build
gatsby serve
```

If you prefer hot-reload, friendly exception notice and other development-friendly features of Gatsby, run the following to start a dev server:

```sh
gatsby develop
```

After these commands are executed, you should see in the terminal an address to visit.

#### _OPTIONAL:_ Test

Run the following to start [`jest`](https://jestjs.io/) unit testing framework:

```sh
npm run test
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
