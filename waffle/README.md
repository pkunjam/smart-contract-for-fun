## Steps for Using Waffle

`Follow below steps in order to understand how to use Waffle right from scratch`

1. Create project structure

```
mkdir using-waffle
cd using-waffle
mkdir build
mkdir contracts
mkdir test
```

2. Installing Dependencies

```
npm i ethereum-waffle -D
npm i chai -D
npm i mocha -D
```

3. Create the waffle-config.json

```
{
  "sourcePath": "./contracts",
  "targetPath": "./build",
  "npmPath": "./node_modules",
  "legacyOutput": "true",
  "outputHumanReadableAbi": "true"
}
```

4. Add scripts into package.json

```
"scripts": {
    "compile": "waffle ./waffle.config.json",
    "test": "mocha"
  }
```

5. Run Tests

```
npm run compile
npm run test
```

`Follow below steps in order start using waffle`

1. git clone https://github.com/balajipachai/smart-contract-for-fun.git
2. cd smart-contract-for-fun
3. git checkout master
4. cd waffle
5. npm install
6. npm run compile
7. npm run test
