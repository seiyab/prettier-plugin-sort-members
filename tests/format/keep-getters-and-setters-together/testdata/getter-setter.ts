export class TestClass {
    get visible(): boolean { return true;}
    set visible(_val: boolean) {}
    get theme(): string { return "light";}
  }
  
class A {
    a: number;
    b: string;
    get c(): boolean { return true; }
    get d(): string { return "d"; }
    set c(_val: boolean) {}
    set d(_val: string) {}
    get e(): boolean { return false; }
}
