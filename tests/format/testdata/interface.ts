interface A {
	b: string;
	c:  unknown;
	a: string;
}

interface B {
	x: string;
	a(): string;
	z(): string;
	b(): never;
	c: number;
}