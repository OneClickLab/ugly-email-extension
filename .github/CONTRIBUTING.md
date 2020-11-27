# Ugly Email Contributing Guide

Hi! I'm really excited that you are interested in contributing to Ugly Email. Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Code of Conduct](https://github.com/OneClickLab/ugly-email-extension/blob/dev/.github/CODE_OF_CONDUCT.md)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)

## Pull Request Guidelines

- The `master` branch is just a snapshot of the latest stable release. All development should be done in dedicated branches. **Do not submit PRs against the `master` branch.**

- Checkout a topic branch from the relevant branch, e.g. `dev`, and merge back against that branch.

- Work in the `src` folder and **DO NOT** checkin `dist` in the commits.

- It's OK to have multiple small commits as you work on the PR - GitHub will automatically squash it before merging.

- Make sure `npm test` passes. (see [development setup](#development-setup))

- If adding a new feature:
  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:
  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

## Development Setup
You will need [Node.js](http://nodejs.org) **version 8+**.

After cloning the repo, run:

``` bash
$ npm install # install the dependencies of the project
```

### Commonly used NPM scripts

``` bash
# watch and auto re-build dist directory
$ npm run dev

# build all dist files, including npm packages
$ npm run build

# run the full test suite, including linting/type checking
$ npm test
```

There are some other scripts available in the `scripts` section of the `package.json` file.

The default test script will do the following: lint with ESLint -> unit tests with coverage . **Please make sure to have this pass successfully before submitting a PR.** Although the same tests will be run against your PR on the CI server, it is better to have it working locally.

## Project Structure
- **`assets`** - contains assets used for building the final extension packages.
  - **`assets/icons`** - contains icons that used only for packaging.
- **`scripts`** - contains build/package related scripts.
- **`src`** - contains the source code.
  - **`utils`** - contains utilities shared across the entire codebase.
  - **`services`** - contains services shared across the entire codebase.
- **`src`** - contains the test code.
- **`vendor`** - contains the 3rd party vendor related code.
  - `vendor/gmail-js.ts` - extending the gmail.js NPM package.
