# Griptape.js contributing guide

Hi there. If you want to contribute to Griptape.js, please check out this guide. It has a detail description of
everything you need to get started.

## Development Setup

Here you will find everything you need to setup your development environment.

You will need [Node.js](https://nodejs.org/en/) version 12+ and [Yarn](https://classic.yarnpkg.com/en/) version 1.x.

After installing all dependencies, here is a description at a very high level the workflow you need to follow to start
contributing:

1. Checkout to the dev branch:

```sh
cd griptape.js
git checkout dev
```

1. [Link](https://classic.yarnpkg.com/en/docs/cli/link/) your project with `yarn link`:

```sh
# ./griptape.js

yarn link
```

2. Run `yarn dev` to watch your changes while:

```sh
# ./griptape.js

yarn dev
```

3. In other directory, create a new project and link it `yarn link @stakeordie/griptape.js`:

```sh
yarn create @vitejs/app my-app
cd my-app
yarn link @stakeordie/griptape.js
yarn dev
```

4. Test in the linked project your changes.

## Scripts

### `yarn build`

Build the project.


### `yarn dev`

Build the project and watch changes.
