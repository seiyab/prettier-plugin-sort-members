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

interface C {
	z: 0;
	a: string;

	b: string;
	aa: 0;
	m(): unknown;

	c: string;
}

interface D {
	a: string;
	b: string;

	c: 0;

	am(): 0;
	bm(): 0;
}