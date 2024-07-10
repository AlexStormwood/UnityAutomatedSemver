# Unity Automated Semver

Github Action to increment relevant project settings "version" numbers per semantic versioning.

Read more about semantic versioning and its spec on the website: [https://semver.org/](https://semver.org/)



## Example Usage

In your repository containing a Unity project, you should have a Github Actions workflow file set up in your `.github/workflows` directory. Name it whatever you want (as long as it ends in ".yml"!). After letting this action run, you then have to sort out committing & pushing the changed file(s) to your repo from within the workflow. The example code below shows all of this; it updates the patch number in every push made to the repository. 

Currently, the big downside to this process is that all developers working on the repo must then fetch & pull the changes made by this action. No one should be editing the `ProjectSettings.asset` file anyway so this shouldn't cause any merge or pull/push issues, but still worth noting.

```yaml
name: Update Unity project semantic versioning

on: [push, workflow_dispatch]

jobs:
    create:
        name: Update semver
        runs-on: ubuntu-latest

        steps:
            # You must ALWAYS checkout your repo so that actions in the workflow can use it.
            - name: Checkout
              uses: actions/checkout@v4

            - name: Find ProjectSettings.asset & increment its bundleVersion number
              uses: AlexStormwood/UnityAutomatedSemver@v2.0.0 # Change v1.1.1 to whatever tag is newer in the AlexStormwood/UnityAutomatedSemver repository.
              id: semver-update
              with:
                  updateMode: "patch" # Change this string to any suitable string mentioned in the Inputs section of this action's readme to suit your needs.
                  projectSettingsPath: "ProjectSettings/ProjectSettings.asset" # optional: specify the exact location of the ProjectSettings file, otherwise action will attempt to automatically find it.

            # Validate that the number has been incremented correctly.
            - name: Get the new semver value
              run: echo "The new semver number for this Unity project is ${{ steps.semver-update.outputs.semver-string }}"

            - name: Get the full semver data from the action
              run: echo "Full semver data is ${{ steps.semver-update.outputs.semver-full-data }}"

            # Commit & push the updated semver number back into the repo. Yes, you have to fetch & pull in your local workstation after this step is done.
            - name: Push changed files back to repo
              uses: stefanzweifel/git-auto-commit-action@v5
              with:
                  commit_message: "Updated semver via automated action."
                  commit_options: "--no-verify --signoff"
```


You could even use other actions to determine the semver bump type, and pass that result into your usage of this action. The example below is suitable for projects that make GitHub Releases for each Unity semver update, since the additional action used determines the semver bump type by looking at releases in the repository alongside your git commit messages (use conventional commits!).

```yml
            # Determines semver bump type to use since the last GitHub release occurred
            - name: Determine the semver bump type
              id: determined_bump_version
              uses: mathieudutour/github-tag-action@v6.2
              with:
                github_token: ${{ secrets.GITHUB_TOKEN }}
                default_bump: patch
                # dry_run: true # If this is set to true, no release tag is created. 


            - name: Find ProjectSettings.asset & increment its bundleVersion number
              uses: AlexStormwood/UnityAutomatedSemver@v2.0.0
              id: semver-update
              with:
                  updateMode: ${{steps.determined_bump_version.outputs.release_type }} # Will be major, minor, or patch, depending on commits since last GitHub release.
                  projectSettingsPath: "ProjectSettings/ProjectSettings.asset" 
```


And if you just want to apply labels to an existing version, such as creating a nightly build, you can try out this:

```yml
            - name: Find ProjectSettings.asset & increment its bundleVersion number
              uses: AlexStormwood/UnityAutomatedSemver@v2.0.0 
              id: semver-update
              with:
                  updateMode: "no-bump" # Anything other than major, minor, patch or quad will actually NOT do a number bump. 
                  releaseLabel: "rc1"
                  buildLabel: "nightly" # Even if the updateMode is invalid, you can still add a release and/or build label to the output. 
                  bundleVersion: "{major}.{minor}.{patch}-{releaseLabel}+{buildLabel}" #Specify a custom format for the semver to make sure your data comes through.
                  projectSettingsPath: "ProjectSettings/ProjectSettings.asset" 
```

### For Large Projects

If your project takes a long time to checkout in git, you may benefit from doing a sparse checkout when running this action. We don't need your entire Unity project to be checked out into the action runner's workspace, we just need the `ProjectSettings.asset` file to be somewhere in the action runner's workspace.

For example, if the ProjectSettings folder is in the root of the repo, then this variation of the checkout step will checkout just that folder. Since it includes the `ProjectSettings.asset` file within that folder, and no paths are changed by a sparse checkout, the rest of a workflow using this action can remain unchanged.

```yaml
 - name: Checkout 
        uses: actions/checkout@v4
        with:
          sparse-checkout: ProjectSettings
```

As long as the `ProjectSettings.asset` file exists somewhere in the action runner's workspace, this action will find it and be able to update it.






## Inputs

This is the data that you must set up in your own workflow file to use this action properly.

All inputs are optional, as the action has logic and fallbacks to figure out essential data. 

To reiterate: **ALL inputs are optional**.

If no inputs are provided, the action will attempt to:

- automatically find a `ProjectSettings.asset` file in the given workspace directory (the directory that the GitHub Action runs in and contains the repository that you've checked out)
- increment its PATCH number
- write the new semver string back into the `ProjectSettings.asset` file using platform-appropriate version numbering
  - this does basically mean that nothing will change for PlayStation platforms, as their version numbering does not seem to use PATCH numbers explicitly.

### projectSettingsPath (optional)

The path to the ProjectSettings/ProjectSettings.asset file for your unity project. 

If this is not specified, then the action will attempt to automatically find it within the GitHub Action runner's workspace. If you've checked out one single valid Unity project, it'll find the right file automatically. If multiple Unity projects are checked out, the first* `ProjectSettings.asset` file found will be used.

`* I have no idea what "first" will be here, and can't picture any reason to have multiple Unity projects within a single repo - so this should be fine.`

### backupAssetFile (optional)

Make a copy of the `ProjectSettings.asset` file, named as `ProjectSettings-BACKUP.asset`, which reflects the original file _before_ any of this action's modifications were applied.

Useful for keeping a copy of the file if you're still sorting out exactly what version formatting you want to use - just keep in mind that this is not gonna help you if you run this action twice and then check the backup. Run the action, check the backup, copy the backup out to somewhere else, and _then_ run the action again!

### updateMode (optional)

When calling this action, you can specify the type of semver update you'd like to perform. Suitable values are:

* major 
* minor
* patch
* quad

These properties have a priority order.  Whichever property is chosen will increment by one, and reset the lower-priority values to zero.

For example, if you have a semver string like "1.2.3", and set this input value to "major", then the new semver string will be "2.0.0".

This is because semver strings follow this priority rule:

`major -> minor -> patch`

Quads - the fourth number in a semver string - are not part of the semver spec, but are still required by some platforms such as Xbox and Microsoft Store. Since they are not in the semver spec, they will be treated as lowest priority items in that numbering system. So, the full version number priority flow for this action is:

`major -> minor -> patch -> quad`

#### There is no automatic mode in this action.

If you want to write a workflow that automatically updates your Unity project's semver based on your conventional commit message history, then you must combine additional steps or actions into your workflow to figure out what type of semver update must be made _before_ running this action.

### treatBuildAsPatch (optional)

Defaults to true.

This property allows your patch and build numbers to be identical. This is useful if you're doing a multi-platform project, where you need the build number for UWP platforms and the patch number for non-UWP platforms, and still use the same numbers across each platform.

For comparison of patch and build in common semver formats:
- `major.minor.patch`
- `major.minor.build.revision`

Patches are higher priority than builds since patches are in the semver spec and builds are not, so if build and patch both have data, then build be assigned the value that patch has. The patch value never gets overwritten by the build value.

For 99.9999% of use cases, just leave this as-is.

### treatRevisionAsQuad (optional)

Defaults to true.

If you, for whatever reason, need your revision number to be something other than the value in the 4th position of the semver string, set this to false.

For 99.9999% of use cases, just leave this as-is.


### major (optional)

If you want to hard-code this property to specific number, set this to a number. 

This value is applied _after_ any semver incrementing operation has completed, so it will override any value set to it.

### minor (optional)

If you want to hard-code this property to specific number, set this to a number. 

This value is applied _after_ any semver incrementing operation has completed, so it will override any value set to it.

### patch (optional)

If you want to hard-code this property to specific number, set this to a number. 

This value is applied _after_ any semver incrementing operation has completed, so it will override any value set to it.

### build (optional)

If you want to hard-code this property to specific number, set this to a number. 

This value is applied _after_ any semver incrementing operation has completed, so it will override any value set to it.

### revision (optional)

If you want to hard-code this property to specific number, set this to a number. 

This value is applied _after_ any semver incrementing operation has completed, so it will override any value set to it.

### releaseLabel (optional)

The string to assign to the `releaseLabel` value used in the semver string.

### buildLabel (optional)

The string to assign to the `releaseLabel` value used in the semver string.

Note that this is NOT the `build` property that is used by other inputs. `build` must be a number, `buildLabel` is a string.



### bundleVersion (optional)

The semver output format that will be applied to the `ProjectSettings.asset` file's `bundleVersion` property, defined in a string.

This is the "Version" property that you'll typically see near the start of the Player settings editor window within the Unity editor, right after "Company Name" and "Product Name".

By default, this has a value of: `"{major}.{minor}.{patch}"`

### useBundleVersionForAll (optional)

If you want all per-platform game version properties in a `ProjectSettings.asset` file to use the bundleVersion/version semver format, set this to `true` - but keep in mind, some platforms really do have specific requirements about their app/game versioning.

By default, this has a value of `false`

### switchDisplayVersion (optional)

The semver output format that will be applied to the `ProjectSettings.asset` file's `switchDisplayVersion` property, defined in a string.

By default, this has a value of: `"{major}.{minor}.{patch}"`

### ps4MasterVersion (optional)

The semver output format that will be applied to the `ProjectSettings.asset` file's `ps4MasterVersion` property, defined in a string.

By default, this has a value of: `"{major}.{minor}"`

### ps4AppVersion (optional)

The semver output format that will be applied to the `ProjectSettings.asset` file's `ps4AppVersion` property, defined in a string.

By default, this has a value of: `"{major}.{minor}"`

### psp2MasterVersion (optional)

The semver output format that will be applied to the `ProjectSettings.asset` file's `psp2MasterVersion` property, defined in a string.

By default, this has a value of: `"{major}.{minor}"`

### psp2AppVersion (optional)

The semver output format that will be applied to the `ProjectSettings.asset` file's `psp2AppVersion` property, defined in a string.

By default, this has a value of: `"{major}.{minor}"`

### metroPackageVersion (optional)

The semver output format that will be applied to the `ProjectSettings.asset` file's `metroPackageVersion` property, defined in a string.

By default, this has a value of: `"{major}.{minor}.{patch}.{quad}"`

### XboxOneVersion (optional)

The semver output format that will be applied to the `ProjectSettings.asset` file's `XboxOneVersion` property, defined in a string.

By default, this has a value of: `"{major}.{minor}.{patch}.{quad}"`

## Outputs 

This is the data that you can use after this action has completed, in other actions & scripts.


### semver-string

This represents the semantic version string _after_ this action has been performed - it will reflect the new, updated version string.

### semver-number 

Alias of `semver-string`, just to avoid breaking existing workflows that might depend on this output.

May get removed one day - as long as it's clear that this output is a string data type, and not a number data type.

### semver-full-data

JSON string representing the object storing all semver properties found or calculated by this action.

Useful if your Unity project's semver strings don't need all the data, but your action workflows have other jobs or steps that need all the data.

## Platform Version String Info

Since Unity supports a variety of platforms, and those platforms have different expectations of a version string, you may want to structure the action's string format per the following.

- Android: 
  - `${major}.${minor}.${patch}`
- iOS, tvOS, visionOS: 
  - `${major}.${minor}.${patch}`
- Standalone (Windows, Linux, macOS) or Dedicated Server<sup>1</sup>: 
  - `${major}.${minor}.${patch}-${releaseLabel}+${buildLabel}`
- Nintendo Switch<sup>1</sup>: 
  - `${major}.${minor}.${patch}-${releaseLabel}+${buildLabel}`
- UWP (Microsoft Store and Xbox One): 
  - `${major}.${minor}.${build}.${revision}`
- PlayStation Portable, 4 & 5<sup>2</sup>: 
  - `${major}.${minor}`
- WebGL:
  - Nothing specifically stated in the Unity manual. Go crazy, try any of the above formats.

1. These platforms can also work just fine with `${major}.${minor}.${patch}` format, or omit either or all of the releaseLabel or buildLabel properties.
2. I ([Alex](https://github.com/AlexStormwood)) don't have access to PlayStation game development documentation and thus have no idea what their rules are, beyond whatever the Unity Manual and ProjectSettings.asset file expose normally. If the version string must be in some other format than "1.2", let us know!

You may want to use a thorough format syntax with all properties to store all information in the version string and save that to your project when doing branch merges. Then when you do per-platform build automation workflows, you could modify the version number with platform-specific syntax _without saving it_ so that your per-platform builds have appropriate version strings.

If a property that needs to be updated is not listed above, please [make an issue](https://github.com/AlexStormwood/UnityAutomatedSemver/issues/new/choose) and let us know.



## To-Do List

* General code optimizations
* Double-check & implement support for non-standard Unity target platforms (in case not all target platforms respect the bundleVersion property)
* Create more example workflows
