# create-convention

A CLI tool for generating convention files

It fetches templates from the create-convention github repo for config files: https://github.com/codevilot/create-convention

## Usage

Caution: This package requires Node.js version 18 or higher.

```sh
npx create-convention
```

## create-convention includes

- prettierrc
- eslintrc
- gitignore
- prettierignore

## If you want to add customized template, Push Request files

```sh
example: airbnb

/template/airbnb.gitignore
/template/airbnb.prettierrc
/template/airbnb.gitignore
```

### After approval, you can use it as follows.

```sh
npx create-convention airbnb
```
