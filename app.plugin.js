const { withDangerousMod, withProjectBuildGradle, withGradleProperties } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Add JitPack repository so react-native-track-player's kotlinaudio dependency resolves
function withJitpack(config) {
  return withProjectBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes('jitpack.io')) {
      config.modResults.contents = config.modResults.contents.replace(
        /allprojects\s*\{[\s\S]*?repositories\s*\{/,
        (match) => match + '\n        maven { url "https://jitpack.io" }'
      );
    }
    return config;
  });
}

// Force new architecture OFF — react-native-track-player does not support new arch.
// Expo SDK 55 ignores the app.json "newArchEnabled" key and defaults to true,
// so we must override it here in gradle.properties directly.
function withOldArch(config) {
  return withGradleProperties(config, (config) => {
    config.modResults = config.modResults.filter(
      (item) => item.key !== 'newArchEnabled'
    );
    config.modResults.push({ type: 'property', key: 'newArchEnabled', value: 'false' });
    return config;
  });
}

// Downgrade Gradle from 9.0.0 to 8.14.2.
// foojay-resolver-convention 0.5.0 (bundled in @react-native/gradle-plugin) is
// incompatible with Gradle 9 — it references JvmVendorSpec.IBM_SEMERU which was
// removed in Gradle 9. Gradle 8.x is fully supported by RN 0.83.
function withGradle8(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const wrapperPropsPath = path.join(
        config.modRequest.platformProjectRoot,
        'gradle/wrapper/gradle-wrapper.properties'
      );
      if (fs.existsSync(wrapperPropsPath)) {
        let contents = fs.readFileSync(wrapperPropsPath, 'utf8');
        contents = contents.replace(
          /distributionUrl=.*gradle-.*\.zip/,
          'distributionUrl=https\\://services.gradle.org/distributions/gradle-8.14.2-bin.zip'
        );
        fs.writeFileSync(wrapperPropsPath, contents);
      }
      return config;
    },
  ]);
}

// Fix react-native-track-player MusicModule.kt for React Native 0.83 compatibility.
//
// Fix 1 — Kotlin 2.1+ null-safety: Arguments.fromBundle() rejects null Bundle.
// Fix 2 — TurboModule interop crash: functions written as Kotlin expression bodies
//   (fun foo() = scope.launch { }) have JVM return type Job instead of void.
//   RN 0.83's TurboModuleInteropUtils rejects any async @ReactMethod with a non-void
//   return type, crashing the JS runtime before the app renders. Converting to block
//   bodies (fun foo() { scope.launch { } }) makes the return type Unit (void).
function fixScopeLaunchBodies(contents) {
  const lines = contents.split('\n');
  const result = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.includes(') = scope.launch {')) {
      // Single-line expression body: fun foo() = scope.launch { ... }
      // Convert to block body so JVM return type is Unit, not Job
      result.push(line.replace(') = scope.launch {', ') { scope.launch {'));
      i++;
      // Count braces to find the matching closing } of the scope.launch block
      let braceCount = 1;
      while (i < lines.length && braceCount > 0) {
        const bodyLine = lines[i];
        for (let j = 0; j < bodyLine.length; j++) {
          if (bodyLine[j] === '{') braceCount++;
          if (bodyLine[j] === '}') braceCount--;
        }
        if (braceCount === 0) {
          result.push(bodyLine + ' }'); // close the outer function body
        } else {
          result.push(bodyLine);
        }
        i++;
      }
    } else if (line.trimEnd().endsWith(') =') && lines[i + 1]?.trimStart().startsWith('scope.launch {')) {
      // Two-line expression body:
      //   fun foo(...) =
      //       scope.launch { ... }
      // Replace trailing '=' with '{' to make it a block body
      result.push(line.replace(/\s*=\s*$/, ' {'));
      i++;
      result.push(lines[i]); // push 'scope.launch {' line unchanged
      i++;
      let braceCount = 1;
      while (i < lines.length && braceCount > 0) {
        const bodyLine = lines[i];
        for (let j = 0; j < bodyLine.length; j++) {
          if (bodyLine[j] === '{') braceCount++;
          if (bodyLine[j] === '}') braceCount--;
        }
        if (braceCount === 0) {
          result.push(bodyLine + ' }'); // close scope.launch block + outer function body
        } else {
          result.push(bodyLine);
        }
        i++;
      }
    } else {
      result.push(line);
      i++;
    }
  }
  return result.join('\n');
}

function withRntpFix(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const musicModulePath = path.join(
        config.modRequest.projectRoot,
        'node_modules/react-native-track-player/android/src/main/java/com/doublesymmetry/trackplayer/module/MusicModule.kt'
      );
      if (fs.existsSync(musicModulePath)) {
        let contents = fs.readFileSync(musicModulePath, 'utf8');
        let changed = false;

        // Fix 1: Kotlin null-safety for Arguments.fromBundle
        if (contents.includes('Arguments.fromBundle(musicService.tracks[index].originalItem)')) {
          contents = contents.replace(
            'Arguments.fromBundle(musicService.tracks[index].originalItem)',
            'Arguments.fromBundle(musicService.tracks[index].originalItem ?: Bundle())'
          );
          changed = true;
        }
        if (contents.includes('musicService.tracks[musicService.getCurrentTrackIndex()].originalItem\n')) {
          contents = contents.replace(
            'musicService.tracks[musicService.getCurrentTrackIndex()].originalItem\n',
            'musicService.tracks[musicService.getCurrentTrackIndex()].originalItem ?: Bundle()\n'
          );
          changed = true;
        }

        // Fix 2: Convert expression bodies to block bodies so @ReactMethod return type is void
        if (contents.includes(') = scope.launch {') || /\) =\s*\n\s*scope\.launch\s*\{/.test(contents)) {
          contents = fixScopeLaunchBodies(contents);
          changed = true;
        }

        if (changed) {
          fs.writeFileSync(musicModulePath, contents);
        }
      }

      // Fix 3: MusicService.emit() calls reactNativeHost which throws in Expo SDK 55
      // bridgeless mode. Replace with a getReactContext() helper that falls back to
      // the new-arch ReactHost API.
      const musicServicePath = path.join(
        config.modRequest.projectRoot,
        'node_modules/react-native-track-player/android/src/main/java/com/doublesymmetry/trackplayer/service/MusicService.kt'
      );
      if (fs.existsSync(musicServicePath)) {
        let svc = fs.readFileSync(musicServicePath, 'utf8');
        if (svc.includes('reactNativeHost.reactInstanceManager.currentReactContext')) {
          // Replace both occurrences in emit() and emitList()
          svc = svc.replace(
            /reactNativeHost\.reactInstanceManager\.currentReactContext/g,
            'getReactContext()'
          );
          // Insert getReactContext() helper before getTaskConfig
          const helper = `    // Returns the current React context, compatible with both old and new (bridgeless) architecture.
    // In Expo SDK 55 / RN 0.83, reactNativeHost throws in bridgeless mode; fall back to reactHost.
    private fun getReactContext(): com.facebook.react.bridge.ReactContext? {
        return try {
            @Suppress("DEPRECATION")
            reactNativeHost.reactInstanceManager.currentReactContext
        } catch (e: Exception) {
            try {
                (application as? com.facebook.react.ReactApplication)
                    ?.reactHost
                    ?.currentReactContext
            } catch (e2: Exception) {
                null
            }
        }
    }

    `;
          svc = svc.replace(
            '    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig {',
            helper + '    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig {'
          );
          fs.writeFileSync(musicServicePath, svc);
        }
      }

      return config;
    },
  ]);
}

// Add ProGuard/R8 keep rules for react-native-track-player.
// RNTP's own proguard-rules.txt has no -keep directives, so R8 in a release
// AAB build strips and renames com.doublesymmetry.** classes, breaking the
// JS-to-native bridge and causing an immediate launch crash.
function withProguardRules(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const proguardPath = path.join(
        config.modRequest.platformProjectRoot,
        'app/proguard-rules.pro'
      );
      const rules = `
# react-native-track-player — keep native module classes visible to R8
-keep class com.doublesymmetry.** { *; }
-dontwarn com.doublesymmetry.**
-keep class com.github.doublesymmetry.** { *; }
-dontwarn com.github.doublesymmetry.**
`;
      if (fs.existsSync(proguardPath)) {
        const existing = fs.readFileSync(proguardPath, 'utf8');
        if (!existing.includes('com.doublesymmetry')) {
          fs.appendFileSync(proguardPath, rules);
        }
      }
      return config;
    },
  ]);
}

function withAdiRegistration(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const assetsDir = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/assets'
      );
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      fs.copyFileSync(
        path.join(config.modRequest.projectRoot, 'assets/adi-registration.properties'),
        path.join(assetsDir, 'adi-registration.properties')
      );
      return config;
    },
  ]);
}

module.exports = function withPlugins(config) {
  config = withJitpack(config);
  config = withOldArch(config);
  config = withGradle8(config);
  config = withRntpFix(config);
  config = withProguardRules(config);
  config = withAdiRegistration(config);
  return config;
};
