import { NodeTypes } from ".";
import {
	MemberNode,
	MemberType,
	MemberLikeNodeTypesArray,
} from "./member-like";

(function _() {
	/* eslint-disable @typescript-eslint/no-unused-expressions */
	check<MemberType, NodeTypes>;
	check<MemberNode["type"], MemberType>;
	check<MemberType, MemberNode["type"]>;
	check<typeof MemberLikeNodeTypesArray, readonly MemberType[]>;
	check<MemberType, (typeof MemberLikeNodeTypesArray)[number]>;
	/* eslint-enable @typescript-eslint/no-unused-expressions */

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function check<S extends T, T>(_a: T, _b: S): never {
		throw new Error("Just for type check");
	}
})();
