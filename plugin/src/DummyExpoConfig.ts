/**
 * A default Expo Gradle config that can be used for testing.
 */
export const DummyExpoConfig = `apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"

def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()

/**
 * This is the configuration block to customize your React Native Android app.
 * By default you don't need to apply any configuration, just uncomment the lines you need.
 */
react {
    entryFile = file(["node", "-e", "require('expo/scripts/resolveAppEntry')", projectRoot, "android", "absolute"].execute(null, rootDir).text.trim())
    reactNativeDir = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()
    hermesCommand = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsolutePath() + "/sdks/hermesc/%OS-BIN%/hermesc"
    codegenDir = new File(["node", "--print", "require.resolve('@react-native/codegen/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()

    // Use Expo CLI to bundle the app, this ensures the Metro config
    // works correctly with Expo projects.
    cliFile = new File(["node", "--print", "require.resolve('@expo/cli', { paths: [require.resolve('expo/package.json')] })"].execute(null, rootDir).text.trim())
    bundleCommand = "export:embed"

    /* Folders */
     //   The root of your project, i.e. where "package.json" lives. Default is '../..'
    // root = file("../../")
    //   The folder where the react-native NPM package is. Default is ../../node_modules/react-native
    // reactNativeDir = file("../../node_modules/react-native")
    //   The folder where the react-native Codegen package is. Default is ../../node_modules/@react-native/codegen
    // codegenDir = file("../../node_modules/@react-native/codegen")

    /* Variants */
    //   The list of variants to that are debuggable. For those we're going to
    //   skip the bundling of the JS bundle and the assets. By default is just 'debug'.
    //   If you add flavors like lite, prod, etc. you'll have to list your debuggableVariants.
    // debuggableVariants = ["liteDebug", "prodDebug"]

    /* Bundling */
    //   A list containing the node command and its flags. Default is just 'node'.
    // nodeExecutableAndArgs = ["node"]

    //
    //   The path to the CLI configuration file. Default is empty.
    // bundleConfig = file(../rn-cli.config.js)
    //
    //   The name of the generated asset file containing your JS bundle
    // bundleAssetName = "MyApplication.android.bundle"
    //
    //   The entry file for bundle generation. Default is 'index.android.js' or 'index.js'
    // entryFile = file("../js/MyApplication.android.js")
    //
    //   A list of extra flags to pass to the 'bundle' commands.
    //   See https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle
    // extraPackagerArgs = []

    /* Hermes Commands */
    //   The hermes compiler command to run. By default it is 'hermesc'
    // hermesCommand = "$rootDir/my-custom-hermesc/bin/hermesc"
    //
    //   The list of flags to pass to the Hermes compiler. By default is "-O", "-output-source-map"
    // hermesFlags = ["-O", "-output-source-map"]

    /* Autolinking */
    autolinkLibrariesWithApp()
}

/**
 * Set this to true to Run Proguard on Release builds to minify the Java bytecode.
 */
def enableProguardInReleaseBuilds = (findProperty('android.enableProguardInReleaseBuilds') ?: false).toBoolean()


def jscFlavor = 'org.webkit:android-jsc:+'

android {
    ndkVersion rootProject.ext.ndkVersion

    buildToolsVersion rootProject.ext.buildToolsVersion
    compileSdk rootProject.ext.compileSdkVersion

    namespace 'com.mobione.saas'
    defaultConfig {
        applicationId 'com.mobione.saas'
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
    }
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug
            shrinkResources (findProperty('android.enableShrinkResourcesInReleaseBuilds')?.toBoolean() ?: false)
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            crunchPngs (findProperty('android.enablePngCrunchInReleaseBuilds')?.toBoolean() ?: true)
        }
    }
    packagingOptions {
        jniLibs {
            useLegacyPackaging (findProperty('expo.useLegacyPackaging')?.toBoolean() ?: false)
        }
    }
    androidResources {
        ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:!CVS:!thumbs.db:!picasa.ini:!*~'
    }
}

// android.packagingOptions.pickFirsts=/LICENSE,**/picasa.ini
["pickFirsts", "excludes", "merges", "doNotStrip"].each { prop ->
    // Split option: 'foo,bar' -> ['foo', 'bar']
    def options = (findProperty("android.packagingOptions.$prop") ?: "").split(",");
    // Trim all elements in place.
    for (i in 0..<options.size()) options[i] = options[i].trim();    
    options -= ""

    if (options.length > 0) {
        println "android.packagingOptions.$prop += $options ($options.length)"
        // Ex: android.packagingOptions.pickFirsts += '**/SCCS/**'
        options.each {
            android.packagingOptions[prop] += it
        }
    }
}

dependencies {
    // The version of react-native is set by the React Native Gradle Plugin
    implementation("com.facebook.react:react-android")

    def isGifEnabled = (findProperty('expo.gif.enabled') ?: "") == "true";
    def isWebpEnabled = (findProperty('expo.webp.enabled') ?: "") == "true";
    def isWebpAnimatedEnabled = (findProperty('expo.webp.animated') ?: "") == "true";

    if (isGifEnabled) {
        // For animated gif support
        implementation("com.facebook.fresco:animated-gif:\${reactAndroidLibs.versions.fresco.get()}")
    }

    if (isWebpEnabled) {
        // For webp support
        implementation("com.facebook.fresco:webpsupport:\${reactAndroidLibs.versions.fresco.get()}")
        if (isWebpAnimatedEnabled) {
            // Animated webp support
            implementation("com.facebook.fresco:animated-webp:\${reactAndroidLibs.versions.fresco.get()}")
        }
    }

    if (hermesEnabled.toBoolean()) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }
}
`;

/**
 * Expo config with the dependencies modified.
 */
export const ExpoConfigModified = `apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"

def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()

/**
 * This is the configuration block to customize your React Native Android app.
 * By default you don't need to apply any configuration, just uncomment the lines you need.
 */
react {
    entryFile = file(["node", "-e", "require('expo/scripts/resolveAppEntry')", projectRoot, "android", "absolute"].execute(null, rootDir).text.trim())
    reactNativeDir = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()
    hermesCommand = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsolutePath() + "/sdks/hermesc/%OS-BIN%/hermesc"
    codegenDir = new File(["node", "--print", "require.resolve('@react-native/codegen/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()

    // Use Expo CLI to bundle the app, this ensures the Metro config
    // works correctly with Expo projects.
    cliFile = new File(["node", "--print", "require.resolve('@expo/cli', { paths: [require.resolve('expo/package.json')] })"].execute(null, rootDir).text.trim())
    bundleCommand = "export:embed"

    /* Folders */
     //   The root of your project, i.e. where "package.json" lives. Default is '../..'
    // root = file("../../")
    //   The folder where the react-native NPM package is. Default is ../../node_modules/react-native
    // reactNativeDir = file("../../node_modules/react-native")
    //   The folder where the react-native Codegen package is. Default is ../../node_modules/@react-native/codegen
    // codegenDir = file("../../node_modules/@react-native/codegen")

    /* Variants */
    //   The list of variants to that are debuggable. For those we're going to
    //   skip the bundling of the JS bundle and the assets. By default is just 'debug'.
    //   If you add flavors like lite, prod, etc. you'll have to list your debuggableVariants.
    // debuggableVariants = ["liteDebug", "prodDebug"]

    /* Bundling */
    //   A list containing the node command and its flags. Default is just 'node'.
    // nodeExecutableAndArgs = ["node"]

    //
    //   The path to the CLI configuration file. Default is empty.
    // bundleConfig = file(../rn-cli.config.js)
    //
    //   The name of the generated asset file containing your JS bundle
    // bundleAssetName = "MyApplication.android.bundle"
    //
    //   The entry file for bundle generation. Default is 'index.android.js' or 'index.js'
    // entryFile = file("../js/MyApplication.android.js")
    //
    //   A list of extra flags to pass to the 'bundle' commands.
    //   See https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle
    // extraPackagerArgs = []

    /* Hermes Commands */
    //   The hermes compiler command to run. By default it is 'hermesc'
    // hermesCommand = "$rootDir/my-custom-hermesc/bin/hermesc"
    //
    //   The list of flags to pass to the Hermes compiler. By default is "-O", "-output-source-map"
    // hermesFlags = ["-O", "-output-source-map"]

    /* Autolinking */
    autolinkLibrariesWithApp()
}

/**
 * Set this to true to Run Proguard on Release builds to minify the Java bytecode.
 */
def enableProguardInReleaseBuilds = (findProperty('android.enableProguardInReleaseBuilds') ?: false).toBoolean()


def jscFlavor = 'org.webkit:android-jsc:+'

android {
    ndkVersion rootProject.ext.ndkVersion

    buildToolsVersion rootProject.ext.buildToolsVersion
    compileSdk rootProject.ext.compileSdkVersion

    namespace 'com.mobione.saas'
    defaultConfig {
        applicationId 'com.mobione.saas'
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
    }
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug
            shrinkResources (findProperty('android.enableShrinkResourcesInReleaseBuilds')?.toBoolean() ?: false)
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            crunchPngs (findProperty('android.enablePngCrunchInReleaseBuilds')?.toBoolean() ?: true)
        }
    }
    packagingOptions {
        jniLibs {
            useLegacyPackaging (findProperty('expo.useLegacyPackaging')?.toBoolean() ?: false)
        }
    }
    androidResources {
        ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:!CVS:!thumbs.db:!picasa.ini:!*~'
    }
}

// android.packagingOptions.pickFirsts=/LICENSE,**/picasa.ini
["pickFirsts", "excludes", "merges", "doNotStrip"].each { prop ->
    // Split option: 'foo,bar' -> ['foo', 'bar']
    def options = (findProperty("android.packagingOptions.$prop") ?: "").split(",");
    // Trim all elements in place.
    for (i in 0..<options.size()) options[i] = options[i].trim();    
    options -= ""

    if (options.length > 0) {
        println "android.packagingOptions.$prop += $options ($options.length)"
        // Ex: android.packagingOptions.pickFirsts += '**/SCCS/**'
        options.each {
            android.packagingOptions[prop] += it
        }
    }
}

dependencies {
    // The version of react-native is set by the React Native Gradle Plugin
    implementation("com.facebook.react:react-android")
    implementation("com.android.support:localbroadcastmanager:28.0.0")
    implementation("androidx.localbroadcastmanager:localbroadcastmanager:1.0.0")

    def isGifEnabled = (findProperty('expo.gif.enabled') ?: "") == "true";
    def isWebpEnabled = (findProperty('expo.webp.enabled') ?: "") == "true";
    def isWebpAnimatedEnabled = (findProperty('expo.webp.animated') ?: "") == "true";

    if (isGifEnabled) {
        // For animated gif support
        implementation("com.facebook.fresco:animated-gif:\${reactAndroidLibs.versions.fresco.get()}")
    }

    if (isWebpEnabled) {
        // For webp support
        implementation("com.facebook.fresco:webpsupport:\${reactAndroidLibs.versions.fresco.get()}")
        if (isWebpAnimatedEnabled) {
            // Animated webp support
            implementation("com.facebook.fresco:animated-webp:\${reactAndroidLibs.versions.fresco.get()}")
        }
    }

    if (hermesEnabled.toBoolean()) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }
}
`;
