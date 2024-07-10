import fsPromises from 'fs/promises';
import { 
	regexFindBundleVersionWithQuad, 
	regexFindMetroPackageVersionWithQuad, 
	regexFindPs4AppVersionWithQuad, 
	regexFindPs4MasterVersionWithQuad, 
	regexFindPsp2AppVersionWithQuad, 
	regexFindPsp2MasterVersionWithQuad, 
	regexFindSwitchDisplayVersionWithQuad, 
	regexFindSwitchReleaseVersionWithQuad, 
	regexFindXboxOneVersionWithQuad, 
	regexSemverWithQuadAndExtensions
} from '../utils/constants';
import { UnityProjectVersion } from "../utils/UnityProjectVersion";
import { PlayerSettingsVersionStrings } from '../utils/types';
import { makeRegexpFromStringFormat } from './RegexFromString';


async function readTargetFile(targetFilePath: string): Promise<string>{
	let fileAsItWasRead: string = await fsPromises.readFile(targetFilePath, { encoding: 'utf8' });

	return fileAsItWasRead;
}

export class ProjectSettingsHelpers {

	/**
	 * Parse a targeted `ProjectSettings.asset` file and retrieve its stored `bundleVersion` property. 
	 * 
	 * This property typically is used as the "Version" of a Unity project in that project's player settings.
	 * @author BigfootDS
	 *
	 * @export
	 * @async
	 * @param {string} targetFilePath An absolute file path to a `ProjectSettings.asset` file for a Unity project.
	 * @param {string} valueFormat A string that will get processed and turned into regex to find an existing project's semver version.
	 * @returns {string} The semver value assigned to the bundleVersion property of the targeted `ProjectSettings.asset` file, in a helper format for multiple Unity-supported platforms.
	 */
	static async getExistingBundleVersion(targetFilePath: string, valueFormat: string = `bundleVersion: ${regexSemverWithQuadAndExtensions.source}`): Promise<UnityProjectVersion|null>{

		console.log("Will use this regex to find existing semver data in the target file:\n" + valueFormat);

		let fileAsItWasRead: string = await readTargetFile(targetFilePath);

		let regexResult: RegExpExecArray|string = makeRegexpFromStringFormat(valueFormat).exec(fileAsItWasRead) || "";
		if (regexResult == ""){
			console.log("Custom format for semver regex did not find anything. Falling back to 'default plus release label plus build label plus quad number' regex instead.");
			regexResult =  regexFindBundleVersionWithQuad.exec(fileAsItWasRead) || "";
		}

		if (regexResult == ""){
			return null;
		}

		let regexResultGroups: {[key: string]: string}|undefined = (regexResult as RegExpExecArray).groups;

		return new UnityProjectVersion(
			Number.parseInt(regexResultGroups?.major || "0") || 0, 
			Number.parseInt(regexResultGroups?.minor || "0") || 0,
			Number.parseInt(regexResultGroups?.patch || "0") || 0,
			Number.parseInt(regexResultGroups?.quad || "0") || 0,
			regexResultGroups?.releaseLabel || "",
			regexResultGroups?.buildLabel || "",
			regexResult ? regexResult[0].toString() : ""
		);
	}

	/**
	 * Write a collection of version strings to the ProjectSettings asset file.
	 * @author BigfootDS
	 *
	 * @export
	 * @async
	 * @param {string} targetFilePath Path to the `ProjectSettings.asset` file.
	 * @param {PlayerSettingsVersionStrings} targetPropertyCollection Structured object of version strings and numbers, per whatever the supported Unity platforms need.
	 * @param {string} searchFormat A string that will get processed and turned into regex to find an existing project's semver version.
	 * @returns {boolean} True on a smooth, successful write. False if anything went wrong.
	 */
	static async writeToProjectSettings(targetFilePath: string, targetPropertyCollection: PlayerSettingsVersionStrings, searchFormat: string = regexSemverWithQuadAndExtensions.source): Promise<boolean>{
		let success = false;

		let fileAsItWasRead: string = await readTargetFile(targetFilePath);

		let fileModified: string = fileAsItWasRead;

		let propertiesNotUpdated: string[] = [];

		let targetPropEntries = Object.entries(targetPropertyCollection);
		for (let index = 0; index < targetPropEntries.length; index++) {
			const targetProp = targetPropEntries[index];
			
			switch (targetProp[0]) {
				case "bundleVersion":
				case "switchReleaseVersion":
				case "switchDisplayVersion":
				case "ps4MasterVersion":
				case "ps4AppVersion":
				case "metroPackageVersion":
				case "XboxOneVersion":
				case "psp2MasterVersion":
				case "psp2AppVersion":
				case "supportedProperty":
					let customFormatRegexp: RegExp = makeRegexpFromStringFormat(`${targetProp[0]}: ` + searchFormat);
					// console.log(customFormatRegexp);
					let tempFileModified: string = fileModified.replace(customFormatRegexp, `${targetProp[0]}: ${targetProp[1]}`)
					
					if (fileModified != tempFileModified){
						fileModified = tempFileModified;
						break;
					}
				default:
					propertiesNotUpdated.push(targetProp[0])
					break;
			}
		}
		if (propertiesNotUpdated.length > 0){
			console.log("These properties were not found or did not have existing values found in a matching format, and thus were not updated:\n" + propertiesNotUpdated);
		}
		
		let result = await fsPromises.writeFile(targetFilePath, fileModified);

		
		if (result === undefined){
			success = true;
		}

		return success;
	}
}




