abstract class A {
    private a: unknown;
    public b: unknown;
    c(): void{}
    static d: unknown;
    e: unknown;
    static f(): void{};
    private static g: unknown;
    constructor() {}
    h: unknown;
    public i(): void{}
    [j: number]: unknown;
    readonly k: unknown;
    private l(): void {};
    protected m(): void {};
    n(): void {};
    @deco
    o(): void{};
    @deco
    private p: unknown;
    @deco
    @deco
    @deco
    q: unknown;
    @deco
    protected r(): void {};
    abstract s(): void;
    abstract t: unknown;
    abstract u(): void;
    private v(): void {};
    private set w(_: unknown) {};
    protected set x(_: unknown) {};
    abstract set y(_: unknown);
    get z(): 0 { return 0 };
}

class Visibility {
    private z = 0;
    #y = 0;
    #x() { return 0 }
    public w = 0;
    protected v = 0;
    #u = () => 0;
    private t = () => 0;
    get s() { return 0 }
    protected set r(_: 0) {}
    set #q(_: 0) {}
    public p() { return 0 };
    o = 0;
    private constructor() {}
    get n() { return 0 };
    private get m() { return 0 };
    get #l() { return 0 };
}


function deco(a: unknown, b: unknown): void {
}