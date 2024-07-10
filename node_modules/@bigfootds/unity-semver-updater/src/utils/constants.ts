export enum SemverUpdateType {
	MAJOR = "major",
	MINOR = "minor",
	PATCH = "patch",
	QUAD = "quad"
};

export const regexSemverSpec: RegExp = /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/

export const regexSemverWithQuadAndExtensions: RegExp = /(?<major>[0-9]\d*)\.(?<minor>[0-9]\d*)(?:\.(?<patch>[0-9]\d*))?(?:\.(?<quad>[0-9]\d*))?(?:-(?<releaseLabel>(?:[0-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildLabel>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/gm;


export const regexFindBundleVersionWithQuad: RegExp = /\bbundleVersion: (?<major>[0-9]\d*)\.(?<minor>[0-9]\d*)(?:\.(?<patch>[0-9]\d*))?(?:\.(?<quad>[0-9]\d*))?(?:-(?<releaseLabel>(?:[0-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildLabel>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
export const regexFindSwitchReleaseVersionWithQuad: RegExp = /\bswitchReleaseVersion: (?<major>[0-9]\d*)\.(?<minor>[0-9]\d*)(?:\.(?<patch>[0-9]\d*))?(?:\.(?<quad>[0-9]\d*))?(?:-(?<releaseLabel>(?:[0-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildLabel>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
export const regexFindSwitchDisplayVersionWithQuad: RegExp = /\bswitchDisplayVersion: (?<major>[0-9]\d*)\.(?<minor>[0-9]\d*)(?:\.(?<patch>[0-9]\d*))?(?:\.(?<quad>[0-9]\d*))?(?:-(?<releaseLabel>(?:[0-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildLabel>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
export const regexFindPs4MasterVersionWithQuad: RegExp = /\bps4MasterVersion: (?<major>[0-9]\d*)\.(?<minor>[0-9]\d*)(?:\.(?<patch>[0-9]\d*))?(?:\.(?<quad>[0-9]\d*))?(?:-(?<releaseLabel>(?:[0-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildLabel>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
export const regexFindPs4AppVersionWithQuad: RegExp = /\bps4AppVersion: (?<major>[0-9]\d*)\.(?<minor>[0-9]\d*)(?:\.(?<patch>[0-9]\d*))?(?:\.(?<quad>[0-9]\d*))?(?:-(?<releaseLabel>(?:[0-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildLabel>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
export const regexFindMetroPackageVersionWithQuad: RegExp = /\bmetroPackageVersion: (?<major>[0-9]\d*)\.(?<minor>[0-9]\d*)(?:\.(?<patch>[0-9]\d*))?(?:\.(?<quad>[0-9]\d*))?(?:-(?<releaseLabel>(?:[0-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildLabel>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
export const regexFindXboxOneVersionWithQuad: RegExp = /\bXboxOneVersion: (?<major>[0-9]\d*)\.(?<minor>[0-9]\d*)(?:\.(?<patch>[0-9]\d*))?(?:\.(?<quad>[0-9]\d*))?(?:-(?<releaseLabel>(?:[0-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildLabel>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
export const regexFindPsp2MasterVersionWithQuad: RegExp = /\bpsp2MasterVersion: (?<major>[0-9]\d*)\.(?<minor>[0-9]\d*)(?:\.(?<patch>[0-9]\d*))?(?:\.(?<quad>[0-9]\d*))?(?:-(?<releaseLabel>(?:[0-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildLabel>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
export const regexFindPsp2AppVersionWithQuad: RegExp = /\bpsp2AppVersion: (?<major>[0-9]\d*)\.(?<minor>[0-9]\d*)(?:\.(?<patch>[0-9]\d*))?(?:\.(?<quad>[0-9]\d*))?(?:-(?<releaseLabel>(?:[0-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildLabel>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;

export const stringRegexMatcherForMajor: string = `(?<major>[0-9]\\d*)`;
export const stringRegexMatcherForMinor: string = `(?<minor>[0-9]\\d*)`;
export const stringRegexMatcherForPatch: string = `(?<patch>[0-9]\\d*)`;
export const stringRegexMatcherForQuad: string = `(?<quad>[0-9]\\d*)`;
export const stringRegexMatcherForReleaseLabel: string = `(?<releaseLabel>(?:[0-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*)`;
export const stringRegexMatcherForBuildLabel: string = `(?<buildLabel>(?:[0-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*)`;
export const stringRegexMatcherBaseForCustomBundleVersion: string = `\\bbundleVersion: `;

export const regexFindBundleVersionToEndOfLine: RegExp = /bundleVersion:.*/gm

export const findLineXboxOneVersion: RegExp = /XboxOneVersion: (\(?<major>[0-9]\d*)\.(?<minor>[0-9]\d*)(?:\.(?<patch>[0-9]\d*))?(?:\.(?<quad>[0-9]\d*))?(?:-(?<releaseLabel>(?:[0-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildLabel>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/