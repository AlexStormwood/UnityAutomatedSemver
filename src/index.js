const core = require('@actions/core');
const path = require("node:path");
const fs = require("node:fs");
const { findProjectSettingsPath } = require('./utils/autoFindProjectSettings');
const {
	ProjectSettingsHelpers,
    SemverUpdateType
} = require("@bigfootds/unity-semver-updater");

let actionInputs = {  

    // ProjectSettings.asset file settings
    projectSettingsPath: null,
    backupAssetFile: true,

    // Semver Logic Determination
    updateMode: SemverUpdateType.PATCH,
    treatBuildAsPatch: true,
    treatRevisionAsQuad: true,

    // Value Overrides
    major: null,
    minor: null,
    patch: null,
    quad: null,
    revision: null,
    build: null,
    releaseLabel: null,
    buildLabel: null,

    // Semver Formatting
    bundleVersion: "{major}.{minor}.{patch}",
    switchDisplayVersion: "{major}.{minor}.{patch}",
    ps4MasterVersion: "{major}.{minor}",
    ps4AppVersion: "{major}.{minor}",
    psp2MasterVersion: "{major}.{minor}",
    psp2AppVersion: "{major}.{minor}",
    metroPackageVersion: "{major}.{minor}.{patch}.{quad}",
    XboxOneVersion: "{major}.{minor}.{patch}.{quad}",
    
    // Semver Formatting Fallbacks
    useBundleVersionForAll: false
}

function getActionInputs(){
    Object.keys(actionInputs).forEach(inputName => {
        let foundInputValue = core.getInput(inputName, {required: false});

        if (foundInputValue) {
            console.log(`Retrieved value ${foundInputValue} for action input property ${inputName}`);
            actionInputs[inputName] = foundInputValue;
        }
    });
}


async function app(){
    // 0. Prepare and get data from environment
    console.log("env.GITHUB_WORKSPACE points to this value: " + process.env.GITHUB_WORKSPACE);
    getActionInputs();
    console.log("Action inputs object now has this data:\n" + JSON.stringify(actionInputs, null, 4));


    // 1. Find ProjectSettings.asset
    let absoluteProjectSettingsFilePath = "";
    if(actionInputs.projectSettingsPath){
        console.log("projectSettingsPath input detected...")
        absoluteProjectSettingsFilePath = path.resolve(process.env.GITHUB_WORKSPACE,actionInputs.projectSettingsPath);
    }else{
        console.log("projectSettingsPath input NOT detected...attempting to automatically find ProjectSettings.asset...");
        absoluteProjectSettingsFilePath = await findProjectSettingsPath();
        absoluteProjectSettingsFilePath = absoluteProjectSettingsFilePath[0] ? absoluteProjectSettingsFilePath[0] : null;
    }
    console.log("Path to ProjectSettings.asset:\n\t" + absoluteProjectSettingsFilePath);


    // 2. Load that file into a local obj
    let foundProjectSettings = await ProjectSettingsHelpers.getExistingBundleVersion(absoluteProjectSettingsFilePath);
    foundProjectSettings.treatBuildAsPatch = actionInputs.treatBuildAsPatch;
    foundProjectSettings.treatRevisionAsQuad = actionInputs.treatRevisionAsQuad;

    console.log("Existing semver data:\n" + JSON.stringify(foundProjectSettings, null, 4));
    

    // 3. Update the semver numbers using the updateMode logic
    switch (actionInputs.updateMode){
        case SemverUpdateType.MAJOR:
            foundProjectSettings.bumpMajor();
            break;
        case SemverUpdateType.MINOR:
            foundProjectSettings.bumpMinor();
            break;
        case SemverUpdateType.PATCH:
            foundProjectSettings.bumpPatch();
            break;
        case SemverUpdateType.QUAD:
            foundProjectSettings.bumpQuad();
            break;
        default: 
            console.log("Invalid updateMode set for the action input, doing nothing.")
            break;
    }


    // 4. Update the semver numbers using any override values from the action inputs
   let valueOverrideTypes = ["major", "minor", "patch", "quad", "revision", "build", "releaseLabel", "buildLabel"];
    valueOverrideTypes.forEach(overrideValueType => {
        if (actionInputs[overrideValueType]){
            foundProjectSettings[overrideValueType] = actionInputs[overrideValueType];
        }
    });

    if (actionInputs.treatBuildAsPatch){
        foundProjectSettings.build = foundProjectSettings.patch;
    }

    if (actionInputs.treatRevisionAsQuad){
        foundProjectSettings.revision = foundProjectSettings.quad;
    }

    console.log("Applied any relevant overrides from action inputs to semver data - data may or may not have changed. Semver data is now:\n" + JSON.stringify(foundProjectSettings, null, 4));


    // 5. Backup the file if the user wants to do that
    if (actionInputs.backupAssetFile == "true"){
        fs.copyFileSync(
            absoluteProjectSettingsFilePath,
            absoluteProjectSettingsFilePath.substring(0, absoluteProjectSettingsFilePath.lastIndexOf("/")) + "ProjectSettings-BACKUP.asset"
        );
    }


    // 6. Write the data back into ProjectSettings.asset
    let valuesToWrite = {
        bundleVersion: foundProjectSettings.toFormattedOutput(actionInputs.bundleVersion),
    };
    if (actionInputs.useBundleVersionForAll == "true"){
        valuesToWrite = {
            bundleVersion: valuesToWrite.bundleVersion,
            buildNumber: {
                Standalone: valuesToWrite.bundleVersion,
                iPhone: valuesToWrite.bundleVersion,
                tvOS: valuesToWrite.bundleVersion
            },
            switchReleaseVersion: valuesToWrite.bundleVersion,
            switchDisplayVersion: valuesToWrite.bundleVersion,
            ps4MasterVersion: valuesToWrite.bundleVersion,
            ps4AppVersion: valuesToWrite.bundleVersion,
            metroPackageVersion: valuesToWrite.bundleVersion,
            XboxOneVersion: valuesToWrite.bundleVersion,
            psp2MasterVersion: valuesToWrite.bundleVersion,
            psp2AppVersion: valuesToWrite.bundleVersion
        }    
    } else {
        valuesToWrite = {
            bundleVersion: foundProjectSettings.toFormattedOutput(actionInputs.bundleVersion),
            buildNumber: {
                Standalone: Number.parseInt(foundProjectSettings.toFormattedOutput("{major}{minor}{patch}")),
                iPhone: Number.parseInt(foundProjectSettings.toFormattedOutput("{major}{minor}{patch}")),
                tvOS: Number.parseInt(result.toFormattedOutput("{major}{minor}{patch}"))
            },
            switchReleaseVersion: Number.parseInt(foundProjectSettings.toFormattedOutput("{major}{minor}{patch}")),
            switchDisplayVersion: foundProjectSettings.toFormattedOutput(actionInputs.switchDisplayVersion),
            ps4MasterVersion: foundProjectSettings.toFormattedOutput(actionInputs.ps4MasterVersion),
            ps4AppVersion: foundProjectSettings.toFormattedOutput(actionInputs.ps4AppVersion),
            metroPackageVersion: foundProjectSettings.toFormattedOutput(actionInputs.metroPackageVersion),
            XboxOneVersion: foundProjectSettings.toFormattedOutput(actionInputs.XboxOneVersion),
            psp2MasterVersion: foundProjectSettings.toFormattedOutput(actionInputs.psp2MasterVersion),
            psp2AppVersion: foundProjectSettings.toFormattedOutput(actionInputs.psp2AppVersion)
        }
    
    }
    
    console.log("Going to write these properties into their relevant places in the ProjectSettings asset file now:\n" + JSON.stringify(valuesToWrite, null, 4));
    let writeResult = await ProjectSettingsHelpers.writeToProjectSettings(absoluteProjectSettingsFilePath, valuesToWrite);
    console.log("Write result: " + writeResult);

    // 7. Set output values for the action
    core.setOutput("semver-string", valuesToWrite.bundleVersion);
    core.setOutput("semver-number", valuesToWrite.bundleVersion);
    core.setOutput("semver-full-data", JSON.stringify(foundProjectSettings))
}

app();