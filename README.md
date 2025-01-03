# thermalib-expo

ETI Bluetherm LE Protocol 1.1 integration

# API documentation

- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/thermalib-expo/)
- [Documentation for the main branch](https://docs.expo.dev/versions/unversioned/sdk/thermalib-expo/)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install thermalib-expo
```

### Configure for Android

### Configure for iOS

Run `npx pod-install` after installing the npm package.

### Running this project

Build the library

```bash
npm run build # typescript
# in a separate terminal
npm run prepare
npm run prepub
npm run pods
```

Run the test project

```bash
cd example
npm run prebuild
npm run pods
npm run android # or ios

```

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide](https://github.com/expo/expo#contributing).
