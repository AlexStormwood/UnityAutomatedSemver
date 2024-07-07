const { findProjectSettingsPath } = require("../src/utils/autoFindProjectSettings");

test("Find project settings asset file automatically in working directory.", async () => {
	let foundFiles = await findProjectSettingsPath();

	expect(foundFiles.length).toBeGreaterThanOrEqual(1);
})