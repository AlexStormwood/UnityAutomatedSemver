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



