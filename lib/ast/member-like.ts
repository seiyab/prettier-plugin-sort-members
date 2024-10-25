import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import * as BabelTypes from "@babel/types";

export const MemberLikeNodeTypesArray = [
	// ts-es-tree
	AST_NODE_TYPES.AccessorProperty,
	AST_NODE_TYPES.PropertyDefinition,
	AST_NODE_TYPES.MethodDefinition,
	AST_NODE_TYPES.TSAbstractMethodDefinition,
	AST_NODE_TYPES.TSAbstractPropertyDefinition,
	AST_NODE_TYPES.TSConstructSignatureDeclaration,
	AST_NODE_TYPES.TSIndexSignature,
	AST_NODE_TYPES.TSMethodSignature,
	AST_NODE_TYPES.TSPropertySignature,

	// babel-ast
	"ClassAccessorProperty",
	"ClassMethod",
	"ClassPrivateMethod",
	"ClassPrivateProperty",
	"ClassProperty",
	"TSDeclareMethod",
] as const;

export const MemberTypes = Object.fromEntries(
	MemberLikeNodeTypesArray.map((type) => [type, type]),
) as { [K in MemberType]: K };

export type MemberType = (typeof MemberLikeNodeTypesArray)[number];

type TSESTreeMemberNode =
	| TSESTree.AccessorProperty
	| TSESTree.MethodDefinition
	| TSESTree.PropertyDefinition
	| TSESTree.TSAbstractMethodDefinition
	| TSESTree.TSAbstractPropertyDefinition
	| TSESTree.TSConstructSignatureDeclaration
	| TSESTree.TSIndexSignature
	| TSESTree.TSMethodSignature
	| TSESTree.TSPropertySignature;

type BabelMemberNode =
	| BabelTypes.ClassAccessorProperty
	| BabelTypes.ClassMethod
	| BabelTypes.ClassPrivateMethod
	| BabelTypes.ClassPrivateProperty
	| BabelTypes.ClassProperty
	| BabelTypes.TSDeclareMethod;

export type MemberNode<K extends MemberType = MemberType> = (
	| TSESTreeMemberNode
	| BabelMemberNode
) & { type: K };
