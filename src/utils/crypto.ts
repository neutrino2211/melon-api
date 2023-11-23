// const rounder = require("rounder-crypto-node/build/Release/rounder.node")

import md5 from "md5";

function num2str(n: number): string {
    return md5(n.toString())
}

function cyrb128(str: string) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
}

function xoshiro128ss(a: number, b: number, c: number, d: number) {
    return function() {
        var t = b << 9, r = b * 5; r = (r << 7 | r >>> 25) * 9;
        c ^= a; d ^= b;
        b ^= c; a ^= d; c ^= t;
        d = d << 11 | d >>> 21;
        return (r >>> 0) / 4294967296;
    }
}



const rounder = {
    _k1: 0,
    _k2: 0,
    _inbetween: 0,
    _rand: () => 0,

    init(k1: number, k2: number) {
        this._k1 = k1;
        this._k2 = k2;
        this._inbetween = this._k1 ^ this._k2;
        const r = cyrb128(num2str(this._inbetween))
        this._rand = xoshiro128ss(r[0], r[1], r[2], r[3])
        this.next();
    },

    next() {
        this._inbetween = this._rand() ^ this._k2;
        this._k2 = this._inbetween;
        this._k1 ^= this._k2;
    },

    get_factor(): number {
        return this._inbetween % 0xFF;
    },

    crypt(n: number): number {
        return this.get_factor() ^ (n % 0xFF);
    }
};

export class Crypt {
    
    constructor(private keys: [number, number]) {
        rounder.init(keys[0], keys[1]);
    }

    crypt(str: string, escapeCode: boolean = true): string {
        rounder.init(this.keys[0], this.keys[0]);
        let r = "";
        for (let i = 0; i < str.length; i++) {
            let char = str[i];
            const charCode = rounder.crypt(char.codePointAt(0)!!);
            rounder.next();

            r += String.fromCodePoint(charCode % 0xfe);   
        }
        return r;
    }

    encrypt_uri(str: string, escapeCode?: boolean): string {
        const r = this.crypt(str, escapeCode)
        return encodeURIComponent(r);
    }

    decrypt_uri(str: string, escapeCode?: boolean): string {
        const r = this.crypt(decodeURIComponent(str), escapeCode);
        return r
    }
}

export function generateAccessToken(userId: string, expiresIn: number, userSecret: string): string {
    const secretPartOne = userSecret.slice(0, 16);
    const secretPartTwo = userSecret.slice(16);

    const secrets: [number, number] = [Number("0x" + secretPartOne), Number("0x" + secretPartTwo)];

    console.log(secrets, secretPartOne, secretPartTwo)

    const c = new Crypt(secrets);
    const p1 = c.encrypt_uri(userId)
    const p2 = c.encrypt_uri((Date.now() + expiresIn).toString())

    return p1 + ":" + p2;
}

export function decoupleAccessToken(token: string, userSecret: string) {
    const secretPartOne = userSecret.slice(0, 16);
    const secretPartTwo = userSecret.slice(16);

    const secrets: [number, number] = [Number("0x" + secretPartOne), Number("0x" + secretPartTwo)];

    const c = new Crypt(secrets);

    const tokenSplits = token.split(":")
    const tokenUserId = c.decrypt_uri(tokenSplits[0]);
    const expiresIn = c.decrypt_uri(tokenSplits[1]);

    return {
        userId: tokenUserId,
        expiresIn: expiresIn
    }
}

export function generateDataToken(userId: string, data: any, userSecret: string): string {
    let token = generateAccessToken(userId, 1000 * 60 * 15, userSecret);

    const secretPartOne = userSecret.slice(0, 16);
    const secretPartTwo = userSecret.slice(16);

    const secrets: [number, number] = [Number("0x" + secretPartOne), Number("0x" + secretPartTwo)];

    const c = new Crypt(secrets);

    token += ":" + c.encrypt_uri(JSON.stringify(data));

    return token
}

export function decoupleDataToken(token: string, userSecret: string) {
    const secretPartOne = userSecret.slice(0, 16);
    const secretPartTwo = userSecret.slice(16);

    const secrets: [number, number] = [Number("0x" + secretPartOne), Number("0x" + secretPartTwo)];

    const c = new Crypt(secrets);

    const tokenSplits = token.split(":")

    const tokenData = decoupleAccessToken(tokenSplits[0] + ":" + tokenSplits[1], userSecret);

    const tokenMetaData = JSON.parse(c.decrypt_uri(tokenSplits[2]));

    return {
        ...tokenData,
        meta: tokenMetaData
    }
}