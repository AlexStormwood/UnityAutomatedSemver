# Unity Automated Semver
 Github Action to increment relevant project settings "version" numbers per semantic versioning.



## Inputs

This is the data that you must set up in your own workflow file to use this action properly.

### semver-update-type

When calling this action, you can specify the type of semver update you'd like to perform. Suitable values are:

* major - This increments the first number in a "major.minor.patch" version string
* minor - This increments the second number in a "major.minor.patch" version string
* patch - This increments the third number in a "major.minor.patch" version string

## Outputs 

This is the data that you can use after this action has completed, in other actions & scripts.

### semver-number 

This represents the semantic version string _after_ this action has been performed - it will reflect the new, updated version string.



## Example Usage

In your repository containing a Unity project, you should have a Github Actions workflow file set up in your `.github/workflows` directory. Name it whatever you want. The example code below updates the patch number in every commit made to the repository.

```yaml
name: Update Unity project semantic versioning

on: [push]

jobs:
  create:
    name: Update semver
    runs-on: ubuntu-latest
    
    steps:
      # You must ALWAYS checkout your repo so that actions in the workflow can use it.
      - name: Checkout 
        uses: actions/checkout@v2

      - name: Find ProjectSettings.asset & increment its bundleVersion number
        uses: AlexHolderDeveloper/UnityAutomatedSemver@v1.0.0 # Change v1.0.0 to whatever tag is newer in the AlexHolderDeveloper/UnityAutomatedSemver repository.
        id: semver-update
        with:
          semver-update-type: 'patch' # Change this string to any suitable string mentioned in the Inputs section of this action's readme to suit your needs.
      
      # Validate that the number has been incremented correctly.
      - name: Get the new semver number
        run: echo "The new semver number for this Unity project is ${{ steps.semver-update.outputs.semver-number }}"

      # Commit & push the updated semver number back into the repo. Yes, you have to fetch & pull in your local workstation after this step is done.
      - name: Push changed files back to repo
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "Updated semver via automated action."
          commit_options: '--no-verify --signoff'
```