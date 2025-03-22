class Foo {
    foo(arg: number): number;
    foo(arg: string): string;
    @decorator
    foo(arg: any): any {
      return arg;
    }
  }
