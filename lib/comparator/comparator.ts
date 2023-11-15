export const Order = {
	Less: -1,
	Equal: 0,
	Greater: 1,
};
export type Order = (typeof Order)[keyof typeof Order];
