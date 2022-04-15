# Eletron File Browser Demo
![image](https://user-images.githubusercontent.com/2889732/163595054-5d9abbcd-ee75-4dea-9b54-4f22530636b7.png)
Video: https://user-images.githubusercontent.com/2889732/163595685-494c6883-5654-4841-bd0c-1cc213fc840c.mov

## Features
- Browse directories using Column layout
- Keyboard navigation
  -  UP and Down for navigation in the column
  -  LEFT to go back to previous folder
  -  RIGHT or ENTER to expand the folder
- Symlink is supported
- Unreadable file will be marked as red
- Files are sorted at the bottom
- Hidden files are hidden (!)

## Project

### Development

Install dependencies
```
$ yarn
```

Run development mode
```
$ yarn dev
```
#### Configuration
There are 2 configurable options can be set via env, for development purpose

##### DEFAULT_ROOT
Root for the browser to start with, default start from "/". The value should be path to the root

e.g.
```
DEFAULT_ROOT=/project/projectX yarn dev
```

##### DEBUG:
To enable debug log. The value is nonnull, preferably "1" or "TRUE"

```
DEBUG=1 yarn dev
```
### Build
Prerequisite: Install dependencies

```
yarn build
```
Then find the excutable file in `/dist` folder
