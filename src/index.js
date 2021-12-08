const core = require('@actions/core');
const github = require('@actions/github');
const yaml = require('js-yaml');
const fs = require('fs');
const find = require('find');

/**
 * Find and returns the first path that contains a ProjectSettings.asset file
 * @returns string the path to the unity ProjectSettings/ProjectSettings.asset file ... hopefully
 */
function findProjectSettingsPath(){
    let foundFileNames = find.fileSync(/\b(ProjectSettings.asset)\b/, process.env.GITHUB_WORKSPACE);
    console.log(`We found these relevant files: \n ${foundFileNames}`);
    return foundFileNames[0];
}

async function modifyUnityProjSemVer() {
    // 1. find ProjectSettings.asset
    console.log("env.GITHUB_WORKSPACE points to this value: " + process.env.GITHUB_WORKSPACE);
    let projectSettingsFilePath = "";
    if(core.getInput("project-settings-path")){
        console.log("project-settings-path input detected...")
        projectSettingsFilePath = process.env.GITHUB_WORKSPACE + "/" + core.getInput("project-settings-path");
    }else{
        console.log("ProjectSettingsPath input NOT detected...attempting to automatically find ProjectSettings/ProjectSettings.asset")
        projectSettingsFilePath = findProjectSettingsPath();
    }
    console.log("Path to ProjectSettings.asset using env.GITHUB_WORKSPACE: ---------\n" + projectSettingsFilePath + "\n---------------")
    // 2. make a copy of that file
    let copiedFileContents = '';

    fs.copyFile(projectSettingsFilePath, "tempfile.yaml", (error) => {
        if (error) {
            console.log(`Error found:\n${error}`);
        } else {
            console.log("Successfully copied file! Reading it back in now...")
            copiedFileContents = fs.readFileSync("tempfile.yaml", "utf8");
            copiedFileAsArray = copiedFileContents.split('\n');

            // 3. strip the first 4 lines from the copy
            copiedFileAsArray.splice(0, 3);
            copiedFileContents = copiedFileAsArray.join('\n')
            fs.unlinkSync('tempfile.yaml');

            // 4. parse the modified copy as yaml
            // 5. convert that yaml to json
            const doc = yaml.safeLoad(copiedFileContents, json = true);
            console.log("----------")
            console.log("Verifying that existing data can be read: " + doc.PlayerSettings.bundleVersion)
            var semverAsObj = {
                major: 0,
                minor: 0,
                patch: 0
            }
            bundleVersionAsArray = doc.PlayerSettings.bundleVersion.split(".");
            semverAsObj.major = parseInt(bundleVersionAsArray[0]);
            semverAsObj.minor = parseInt(bundleVersionAsArray[1]);
            semverAsObj.patch = parseInt(bundleVersionAsArray[2]);


            // 6. Get commit tag
            var commitTag = core.getInput('semver-update-type').toLowerCase();
            console.log("core.getInput('semver-update-type').toLowerCase() ----------------->" + commitTag)

            // 7. Increment specific number based on commit tag
            switch (commitTag) {
                case "patch":
                    console.log("yep, was a patch!");
                    semverAsObj.patch++;
                    break;
                case "minor":
                    console.log("we did a minor tag commit!");
                    semverAsObj.minor++;
                    semverAsObj.patch = 0;
                    break;
                case "major":
                    console.log("MAJOR patch omg!");
                    semverAsObj.major++;
                    semverAsObj.minor = 0;
                    semverAsObj.patch = 0;
                    break;
                default:
                    core.setFailed("major, minor or patch must be specified as semver-update-type.");
                    break;
            }

            console.log(`Semver is now: ${JSON.stringify(semverAsObj)}`);

            // 8. Convert semver obj back into string
            let newSemver = `${semverAsObj.major}.${semverAsObj.minor}.${semverAsObj.patch}`;
            core.setOutput("semver-number", newSemver);
            let newSemverAsString = `bundleVersion: ` + newSemver;

            // 9. Insert string back into ProjectSettings.asset file
            fs.readFile(projectSettingsFilePath, "utf8", (error, data) => {
                if (error){
                    return console.log(`Something went wrong reading the original ProjectSetting.asset! Error message follows: \n${error}`);
                }

                var result = data.replace(/\b(bundleVersion\: )(([0-9]+).([0-9]+).([0-9]+))\b/, newSemverAsString);
                fs.writeFile(projectSettingsFilePath, result, 'utf8', (error) => {
                    if (error){
                        return console.log(`Something went wrong inserting the new semver into the original ProjectSetting.asset! Error message follows: \n${error}`);
                    }
                })

            })

        }
    })
}

modifyUnityProjSemVer();
