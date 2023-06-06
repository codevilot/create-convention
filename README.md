# create-gitignore

A CLI tool for generating convention files

It fetches templates from the create-convention github repo for config files: https://github.com/codevilot/create-convention

## Usage(If there is no .git folder)

```sh
git init
npx create-convention
```

## Usage(If there is .git folder)

```sh
npx create-convention
```

## create-gitignore includes

- prettierrc
- eslintrc
- gitignore
- husky

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
