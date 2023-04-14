# Periotris.js

**English** | [中文](README-zh.md)

**Get familiar with the Periodic Table of Elements in a fun way, directly in your browsers.**

![Periotris.js v2.0.1 PWA screenshot](https://user-images.githubusercontent.com/32665105/152916976-93b9617a-7f82-489c-9ede-92f16a2c45e9.png)
_Periotris.js v2.0.1_

[![Gatsby](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml/badge.svg?branch=develop)](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml)

## Play

### Where to play?

Instances of Periotris.js are hosted on GitHub Pages and Vercel.

- GitHub Pages: https://csharpermantle.github.io/periotrisjs
- Vercel: https://periotrisjs.vercel.app/
- Vercel (develop preview): https://periotrisjs-git-develop-csharpermantle.vercel.app/

The game is a [Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps), providing a native-app-like experience. See your browser's manual for more information.

### How to play?

For desktop platforms, keyboard is the recommended way to control the game.

- `W`: Rotate
- `A`: Move left
- `D`: Move right
- `S`: Move down
- `Space`: Instant drop

For touching-enabled platforms, use the finger to play.

- `Tap`: Rotate
- `Swipe left`: Move left
- `Swipe right`: Move right
- `Swipe down`: Move down
- `Long press`: Instant drop

### What to do next?

Periotris.js provides several ways to customize the game. You can:

- Customize the color theme of the game,
- Play other maps,
- Control the speed of the game,
- Change the game's difficulty,
- Customize the periodic table,

... and more!

Most of these settings can be edited on the "Settings" page of the game. The settings are saved in the browser's local storage and are **not** uploaded to any server.

Most settings are saved and validated real-time, so when you make a change to the settings, the game will immediately reflect the change.

If you encounter any problems with your file format, please check the structure of your file.

#### Write your own map

Game maps defines the game area that you need to fill. It specifies how large the game area is, which element should cells represent, and which cells are left blank.

A game map is represented in a text file in the format named [JavaScript Object Notation (JSON)](https://developer.mozilla.org/en-US/docs/Glossary/JSON). You will need to write your own map in the structure listed below.

1. The map file (designated as "map") is a JSON file containing an object as its root (designated as "map object").
2. The map object should contain following properties:
   - `map`: A row-major 2D array containing all blocks. Each block is represented by an object with these properties:
     - `atomicNumber`: An integer indicating the element the cell represents
     - `filledBy`: An integer. `7` for a free block, `8` for an unavailable block.
   - `totalAvailableBlocksCount`: An integer representing the total number of blocks that can be filled in the map, that is, the number of blocks where `filledBy` equals `7`.
   - `playAreaSize`: An object It representing the visible size of the map with two properties:
     - `width`: An integer.
     - `height`: An integer.

For an example file, which is also the default map in the game, see [DefaultMap.json](src/json/DefaultMap.json).

For a formal description of the structure of the map in [JSON Schema](https://json-schema.org/), see [Map.json.schema](src/json/schema/Map.json.schema).

#### Write your own color theme

Color themes define a set of rules that cells should be colored according to.

A color theme file is also represented in JSON. You will need to write your own color theme in the structure listed below.

1. The color theme file (designated as "color theme") is a JSON file containing an object as its root (designated as "color theme object").
2. The color theme object should contain the following properties:
   - `rules`: An array of objects. Each object represents a rule. Each rule is represented by an object with these properties:
     - `atomicNumberRange`: An object indicating the range of elements the rule applies to from `from` to `to` (both inclusive).
     - `color`: A valid CSS color.

For an example file, which is also the default color theme in the game, see [DefaultColorScheme.json](src/json/DefaultColorScheme.json).

For a formal description of the structure of the map in JSON Schema, see [ColorScheme.json.schema](src/json/schema/ColorScheme.json.schema).

## Development

### Clone

```sh
git clone --depth 1 -- https://github.com/CSharperMantle/periotrisjs.git
cd periotrisjs
```

You may omit the `--depth=1` flag if you want a complete commit history rather than a grafted shallow history (which saves disk space). **Reminder:** Do not use 'Download ZIP' button! Make sure that you have your git repository initialized or Periotris.js will fail to determine its revision.

### Install dependencies

Dependencies that need to be installed manually:

- [Node.js v14.x+](https://nodejs.org/)
- [yarn berry+](https://yarnpkg.com/)

Once you have installed all above, run the following commands:

```sh
yarn install --immutable
```

### Host local instances

Run the following command to build and serve a publish-ready site (the same as you get from GH Pages and Vercel instances):

```sh
yarn run build && yarn run serve
```

Or you can run the following command to build and serve a development site:

```sh
yarn run develop
```

Follow the instructions printed in the terminal to enjoy your local instance.

### Test

```sh
yarn run test
```

This command will run all tests and will print the results. Normally all tests should pass.
