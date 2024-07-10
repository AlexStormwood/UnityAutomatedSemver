



/**
 * Object containing additional properties for specific platforms' build metadata. Used by PlayerSettings.
 * @author BigfootDS
 *
 * @export
 */
export type BuildNumber = {
	Standalone: number|null,
	iPhone: number|null,
	tvOS: number|null
}


/**
 * An object containing only the relevant properties from the Unity `ProjectSettings.asset` file that should be updated to reflect a project's version.
 * @author BigfootDS
 *
 * @export
 */
export type PlayerSettingsVersionStrings = {
	bundleVersion: string|null,
	buildNumber: BuildNumber|null, // Bunch of internal numbers.
	switchReleaseVersion: number|null, // This is like a build number.
	switchDisplayVersion: string|null,
	ps4MasterVersion: string|null,
	ps4AppVersion: string|null,
	metroPackageVersion: string|null,
	XboxOneVersion: string|null,
	psp2MasterVersion: string|null,
	psp2AppVersion: string|null
}


