class AccessorTest {
    accessor a;
    @decorate
    private accessor b;
    private accessor c;
    protected static accessor d;
    static accessor #e;
    accessor f;
    static accessor g;
    constructor(){}
    h;
    i(): void{}
    set j(_: unknown) {};
    get j(): unknown { return 0 };
    @decorate
    @decorate
    accessor k;
    @decorate
    private l;
    accessor m = 0;
}

function decorate(..._: unknown[]): void {
}
