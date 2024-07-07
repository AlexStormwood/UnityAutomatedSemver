const YAML = require("yaml");
const fsPromises = require('fs/promises');

require("./ProjectSettingsAsType.js");

const unityYamlPrefix = `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!129 &1\n`;


/**
 * Load the ProjectSettings.asset file found at the specified path and return an object.
 * 
 * Essential values for this action's versioning functionality are noted in the ProjectSettings return type.
 * @author BigfootDS
 *
 * @async
 * @param yamlFilePath
 * @returns {import("./ProjectSettingsAsType.js").ProjectSettings}
 */
async function loadYamlAsObject(yamlFilePath){

    await fsPromises.copyFile(yamlFilePath, "tempfile.yaml");

	let copiedFile = await fsPromises.readFile("tempfile.yaml", { encoding: 'utf8' });

	let yamlAsObj = YAML.parse(copiedFile);

	return yamlAsObj;
}


/**
 * Because Unity's ProjectSettings file uses UnityYAML, with weird objects-as-strings values for things like the defaultCursor, we can't just do a simple "load YAML as object, update update, write object as YAML" and call it a day.
 * No - instead, we must find the lines we want to update and replace their string contents with our own string contents.
 * @author BigfootDS
 *
 * @async
 * @param {string} newBundleVersionString The new bundleVersion for the project. Should look like "1.0.0" or "1.2.3.0-rc1".
 * @param {string} originalYamlFilePath The absolute path to the "ProjectSettings.asset" file that must be updated.
 * @returns
 */
async function writeBundleVersionToExistingYaml(newBundleVersionString, originalYamlFilePath){
	let yamlString = YAML.stringify(objectData);
	yamlString = unityYamlPrefix + yamlString;

	await fsPromises.writeFile(yamlFilePath, yamlString);
}

module.exports = {
	loadYamlAsObject,
	writeBundleVersionToExistingYaml
}