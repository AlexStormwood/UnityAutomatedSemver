
/**
 * An object mapping the data used to construct a semver string for various Unity-supported platforms, alongside some helper methods.
 * @author BigfootDS
 *
 * @export
 * @class
 */
export class UnityProjectVersion {
	private _major!: number;
	private _minor!: number;
	private _patch!: number;
	private _quad!: number;
	private _build!: number;
	private _revision!: number;
	releaseLabel: string;
	buildLabel: string;
	rawString: string;
	treatBuildAsPatch: boolean;
	treatRevisionAsQuad: boolean;

	constructor(
		major: number,
		minor: number,
		patch: number,
		quad: number,
		releaseLabel: string = "",
		buildLabel: string = "",
		rawString: string,
		treatBuildAsPatch: boolean=true,
		treatRevisionAsQuad: boolean=true
	){
		this._major = major;
		this._minor = minor;
		this._patch = patch;
		this._quad = quad;
		this._build = patch; // UWP-specific equivalent.
		this._revision = quad; // UWP-specific equivalent.
		this.releaseLabel = releaseLabel;
		this.buildLabel = buildLabel;
		this.rawString = rawString;
		this.treatBuildAsPatch = treatBuildAsPatch;
		this.treatRevisionAsQuad = treatRevisionAsQuad;
	}

	get major():number{
		return this._major;
	}
	set major(newValue:number){
		this._major = newValue;
		this._minor = 0;
		this._patch = 0;
		this._quad = 0;
		this._build = 0;
		this._revision = 0;
	}

	get minor():number{
		return this._minor;
	}
	set minor(newValue:number){
		this._minor = newValue;
		this._patch = 0;
		this._quad = 0;
		this._build = 0;
		this._revision = 0;
	}

	get patch():number{
		return this._patch;
	}
	set patch(newValue:number){
		this._patch = newValue;
		if (this.treatBuildAsPatch){
			this._build = this.patch;
		}

		this._quad = 0;
		this._revision = 0;
	}

	get quad():number{
		return this._quad;
	}
	set quad(newValue:number){
		this._quad = newValue;
		if (this.treatRevisionAsQuad){
			this._revision = newValue;
		}
	}

	get build():number{
		return this._build;
	}
	set build(newValue:number){
		this._build = newValue;
		if (this.treatBuildAsPatch){
			this._patch = this.build;
		}

		this._quad = 0;
		this._revision = 0;
	}

	get revision():number{
		return this._revision;
	}
	set revision(newValue:number){
		this._revision = newValue;
		if (this.treatRevisionAsQuad){
			this._quad = newValue;
		}
	}


	
	/**
	 * Increment the major version number of this object by one, and reset the lower-tier version numbers to zero as per semver rules.
	 * @author BigfootDS
	 */
	bumpMajor(){
		this.major++;
		this.minor = 0;
		this.patch = 0;
		this.quad = 0;
		this.build = 0;
		this.revision = 0;
	}

	/**
	 * Increment the minor version number of this object by one, and reset the lower-tier version numbers to zero as per semver rules.
	 * @author BigfootDS
	 */
	bumpMinor(){
		this.minor++;
		this.patch = 0;
		this.quad = 0;
		this.build = 0;
		this.revision = 0;
	}

	/**
	 * Increment the patch version number of this object by one, and reset the lower-tier version numbers to zero as per semver rules.
	 * If this instance has `treatBuildAsPatch` set to `true`, then that will also increment.
	 * @author BigfootDS
	 */
	bumpPatch(){
		this.patch++;
		if (this.treatBuildAsPatch){
			this.build = this.patch;
		}

		this.quad = 0;
		this.revision = 0;
	}

	/**
	 * Increment the quad version number of this object by one, and reset the lower-tier version numbers to zero as per semver rules.
	 * If this instance has `treatRevisionAsQuad` set to `true`, then that will also increment.
	 * @author BigfootDS
	 */
	bumpQuad(){
		this.quad++;
		if (this.treatRevisionAsQuad){
			this.revision = this.quad;
		}
	}


	
	/**
	 * Create a per-the-spec semver string from this instance's data.
	 * @author BigfootDS
	 *
	 * @returns {string} A semver string with standard properties. Per the semver spec, this is just `major.minor.patch-releaseLabel+buildLabel` with values from the instance.
	 */
	toString() : string {
		let output:string = "";

		output = `${this.major}.${this.minor}.${this.patch}`;

		if (this.releaseLabel){
			output += `-${this.releaseLabel}`
		}

		if (this.buildLabel){
			output += `+${this.buildLabel}`
		}

		return output;
	}

	
	/**
	 * Generate a semver string based on the instance's data.
	 * @author BigfootDS
	 *
	 * @param {[string]} [formatRule="{major}.{minor}.{patch}"] Optional. Specify a custom format rule for the semver string. If no format rule is provided, it will use the default `major.minor.patch` format per the semver spec.
	 * @returns {string} A semver string that follows the format rule if one was provided, or a default semver string per the spec if no format rule is provided.
	 */
	toFormattedOutput(formatRule: string = "{major}.{minor}.{patch}") : string {
		let output: string = "";

		formatRule = formatRule.replace("{major}", "${this.major}");
		formatRule = formatRule.replace("{minor}", "${this.minor}");
		formatRule = formatRule.replace("{patch}", "${this.patch}");
		formatRule = formatRule.replace("{quad}", "${this.quad}");
		formatRule = formatRule.replace("{revision}", "${this.revision}");
		formatRule = formatRule.replace("{build}", "${this.build}");

		formatRule = formatRule.replace("{releaseLabel}", "${this.releaseLabel}");
		formatRule = formatRule.replace("{buildLabel}", "${this.buildLabel}");


		output = eval("`" + formatRule + "`");


		return output;
	}
}