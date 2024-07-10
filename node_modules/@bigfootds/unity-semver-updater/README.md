# @bigfootds/unity-semver-updater

NodeJS tool to update a Unity project's version to a specified format - typically the semver format.

The intention is that this package exists separate from any automation workflow actions that might use it, so we can quickly prototype and iterate on the logic without the hassle of running automated workflows. Looking at you, GitHub Actions, and how painful it is to run things locally.

For example, this GitHub Action will be converted to use this package as the core of its logic soon:

- [AlexStormwood/UnityAutomatedSemver](https://github.com/AlexStormwood/UnityAutomatedSemver)

If you wanna use this package in your own actions, or you just wish to modify it or archive it or do whatever with it, you can do so - this package is licensed with MIT license!

## Installation

Install this package from the NPM registry into your NodeJS project by running: 

`npm install @bigfootds/unity-semver-updater`

## Usage

```js
const { findProjectSettingsPath } = require("../src/utils/autoFindProjectSettings"); // not part of the library - logic to glob files is not part of this package

const {
	ProjectSettingsHelpers
} = require("@bigfootds/unity-semver-updater");

async function app (){

	let targetFiles = await findProjectSettingsPath();
	let targetFile = targetFiles[0];

	let result = await ProjectSettingsHelpers.getExistingBundleVersion(targetFile);

	console.log("String formatter example:");

	// Default, per the semver spec:
	console.log(result.toString());
	console.log(result.toFormattedOutput());

	// Custom formats:
	console.log(result.toFormattedOutput("{major}-banana-{minor}"));

	// Typical version number structures per the Unity docs:
	let valuesToWrite = {
		bundleVersion: result.toFormattedOutput("{major}.{minor}.{patch}-{releaseLabel}+{buildLabel}"),
		buildNumber: {
			Standalone: Number.parseInt(result.toFormattedOutput("{major}{minor}{patch}")),
			iPhone: Number.parseInt(result.toFormattedOutput("{major}{minor}{patch}")),
			tvOS: Number.parseInt(result.toFormattedOutput("{major}{minor}{patch}"))
		},
		switchReleaseVersion: Number.parseInt(result.toFormattedOutput("{major}{minor}{patch}")),
		switchDisplayVersion: result.toFormattedOutput("{major}.{minor}.{patch}"),
		ps4MasterVersion: result.toFormattedOutput("{major}.{minor}"),
		ps4AppVersion: result.toFormattedOutput("{major}.{minor}"),
		metroPackageVersion: result.toFormattedOutput("{major}.{minor}.{patch}.{build}"),
		XboxOneVersion: result.toFormattedOutput("{major}.{minor}.{patch}.{build}"),
		psp2MasterVersion: result.toFormattedOutput("{major}.{minor}"),
		psp2AppVersion: result.toFormattedOutput("{major}.{minor}")
	}

	// Write a PlayerSettingsVersionStrings instance to the ProjectSettings.asset file:
	let writeResult = await ProjectSettingsHelpers.writeToProjectSettings(targetFile, valuesToWrite);

	// Boolean file update result:
	console.log("Write result: " + writeResult);
}

app();
```

When the above code is run and the `ProjectSettings.asset` file contains `bundleVersion: 0.1.0.0-rc1`, this will be the output:

```
String formatter example:
0.1.0-rc1
0.1.0
0-banana-1
Write result: true
```
