const glob = require('@actions/glob');



/**
 * Find and returns all file paths that point to a ProjectSettings.asset file.
 * @async
 * @returns {Promise<String[]>} Array of file paths for ProjectSettings.asset files in the GitHub workspace. You'll probably wanna use the [0]th result of this function.
 */
async function findProjectSettingsPath(){
    const patterns = ['**/ProjectSettings.asset']
    const globber = await glob.create(patterns.join('\n'))
    let foundFileNames = await globber.glob()
    console.log(`We found these relevant files: \n ${foundFileNames}`);
    return foundFileNames;
}

module.exports = {
	findProjectSettingsPath
}