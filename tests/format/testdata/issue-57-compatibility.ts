export class SomeClass {
    @deco
    private static someStaticMethod() {
      //
    }
  
    private static someOtherStaticMethod = () => {
      //
    };

  }


export class SomeClassB {
    private someOtherMethod() {
      //
    };

    @deco
    private someMethod() {
      //
    }

  }
  
export abstract class SomeClassC {
    a(){}
    @deco
    b(){}
    static c(){}
    @deco
    static d(){}
}

function deco(...args: unknown[]): any {}
