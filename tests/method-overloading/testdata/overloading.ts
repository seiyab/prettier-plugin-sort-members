class Foo {
    add(a: number, b: number): number;
    add(a: string, b: string): string;
    @decorator
    add(a: number | string, b: number | string): number | string {
        if (typeof a === 'number' && typeof b === 'number') {
        return a + b;
        } else if (typeof a === 'string' && typeof b === 'string') {
        return a + b;
        } else {
        throw new Error('Invalid arguments');
        }
    }
    
    static add(a: number, b: number): number {
        return a + b;
    };
    

    static sub(a: string, b: string): string;
    static sub(a: number, b: number): number;
    @decorator
    static sub(a: any, b: any): unknown {
        return a - b;
    }
    
    sub(a: number, b: number): number {
        return a - b;
    } 
    
    ['baz'](x: number): number;
    baz(x: string): string;
    ['baz'](x: boolean): boolean;
    baz(x: unknown): unknown {
        return x;
    }
    
    bar(x: number): number {
        return x + 1;
    }
}
