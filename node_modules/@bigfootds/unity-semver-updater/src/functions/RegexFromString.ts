import { stringRegexMatcherForBuildLabel, stringRegexMatcherForMajor, stringRegexMatcherForMinor, stringRegexMatcherForPatch, stringRegexMatcherForQuad, stringRegexMatcherForReleaseLabel } from "../utils/constants";


export function makeRegexpFromStringFormat (stringRule: string): RegExp {
	let formatRule: string = stringRule;


	// console.log("Format rule before regex escaping:\n"+formatRule);
	formatRule = formatRule.replace(/[.*?^$()|[\]\\]/g, '\\$&');
	formatRule = formatRule.replace(/[+]/g, '\\\$&');
	// console.log("Format rule after regex escaping:\n"+formatRule);

	formatRule = formatRule.replace("{major}", stringRegexMatcherForMajor);
	formatRule = formatRule.replace("{minor}", stringRegexMatcherForMinor);
	formatRule = formatRule.replace("{patch}", stringRegexMatcherForPatch);
	formatRule = formatRule.replace("{quad}", stringRegexMatcherForQuad);

	formatRule = formatRule.replace("{releaseLabel}", stringRegexMatcherForReleaseLabel);
	formatRule = formatRule.replace("{buildLabel}", stringRegexMatcherForBuildLabel);

	

	let formatRuleAsLiteral: string = eval("`" + formatRule + "`");

	return new RegExp(formatRuleAsLiteral, "gm");
}