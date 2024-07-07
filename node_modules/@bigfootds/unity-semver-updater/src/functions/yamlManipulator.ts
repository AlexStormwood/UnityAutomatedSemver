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
	regexFindXboxOneVersionWithQuad 
} from '../utils/constants';
import { UnityProjectVersion } from "../utils/UnityProjectVersion";
import { PlayerSettingsVersionStrings } from '../utils/types';


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
	 * @returns {string} The semver value assigned to the bundleVersion property of the targeted `ProjectSettings.asset` file.
	 */
	static async getExistingBundleVersion(targetFilePath: string): Promise<UnityProjectVersion>{

		let fileAsItWasRead: string = await readTargetFile(targetFilePath);

		let regexResult: RegExpExecArray|string = regexFindBundleVersionWithQuad.exec(fileAsItWasRead) || "";

		let regexResultGroups: {[key: string]: string}|undefined = (regexResult as RegExpExecArray).groups;

		return new UnityProjectVersion(
			Number.parseInt(regexResultGroups?.major || "0") || 0, 
			Number.parseInt(regexResultGroups?.minor || "0") || 0,
			Number.parseInt(regexResultGroups?.patch || "0") || 0,
			Number.parseInt(regexResultGroups?.quad || "0") || 0,
			regexResultGroups?.releaseLabel || "",
			regexResultGroups?.buildLabel || "",
			regexResult[0].toString()
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
	 * @returns {boolean} True on a smooth, successful write. False if anything went wrong.
	 */
	static async writeToProjectSettings(targetFilePath: string, targetPropertyCollection: PlayerSettingsVersionStrings): Promise<boolean>{
		let success = false;

		let fileAsItWasRead: string = await readTargetFile(targetFilePath);

		let fileModified: string = fileAsItWasRead;


		let targetPropEntries = Object.entries(targetPropertyCollection);
		for (let index = 0; index < targetPropEntries.length; index++) {
			const targetProp = targetPropEntries[index];
			
			// console.log(`Key: ${targetProp[0]}, Value: ${targetProp[1]}`);

			switch (targetProp[0]) {
				case "bundleVersion":
					fileModified = fileModified.replace(regexFindBundleVersionWithQuad, `${targetProp[0]}: ${targetProp[1]}`);
					break;
				case "switchReleaseVersion":
					fileModified = fileModified.replace(regexFindSwitchReleaseVersionWithQuad, `${targetProp[0]}: ${targetProp[1]}`);
					break;
				case "switchDisplayVersion":
					fileModified = fileModified.replace(regexFindSwitchDisplayVersionWithQuad, `${targetProp[0]}: ${targetProp[1]}`);
					break;
				case "ps4MasterVersion":
					fileModified = fileModified.replace(regexFindPs4MasterVersionWithQuad, `${targetProp[0]}: ${targetProp[1]}`);
					break;
				case "ps4AppVersion":
					fileModified = fileModified.replace(regexFindPs4AppVersionWithQuad, `${targetProp[0]}: ${targetProp[1]}`);
					break;
				case "metroPackageVersion":
					fileModified = fileModified.replace(regexFindMetroPackageVersionWithQuad, `${targetProp[0]}: ${targetProp[1]}`);
					break;
				case "XboxOneVersion":
					fileModified = fileModified.replace(regexFindXboxOneVersionWithQuad, `${targetProp[0]}: ${targetProp[1]}`);
					break;
				case "psp2MasterVersion":
					fileModified = fileModified.replace(regexFindPsp2MasterVersionWithQuad, `${targetProp[0]}: ${targetProp[1]}`);
					break;
				case "psp2AppVersion":
					fileModified = fileModified.replace(regexFindPsp2AppVersionWithQuad, `${targetProp[0]}: ${targetProp[1]}`);
					break;
				default:
					break;
			}
		}


		
		let result = await fsPromises.writeFile(targetFilePath, fileModified);

		
		if (result === undefined){
			success = true;
		}

		return success;
	}
}




