export class TestClass {
    get visible() {}
    get theme() {}
    set visible(value){}
}

class A {
    a = 1;
    get b() {}
    set c(value) {}
    d = 2;
    set b(value) {}
}
