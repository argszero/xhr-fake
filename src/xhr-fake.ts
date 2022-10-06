

class Controoler {
    blockerList: Set<Fake>;
    constructor() {
        this.blockerList = new Set();
    }
    fake(regExp: RegExp, responseProvider: (req:Request) => string): Fake {
        const blocker = new Fake(regExp, responseProvider);
        this.blockerList.add(blocker);
        return blocker;
    }


}

export const xhr = new Controoler();

class FakeXMLHttpRequest extends XMLHttpRequest {
    url!: string | URL;
    _responseText: string|null = null;
    _readyState: number = -100;
    _header: Map<string, string> = new Map<string, string>();
    open(method: string, url: string | URL): void {
        console.log('open ', url);
        this.url = url;
        for (const blocker of xhr.blockerList) {
            if (blocker.matches(url)) {
                console.log("open match url", this.url)
                return;
            }
        }
        super.open(method, url);
    }
    setRequestHeader(name: string, value: string): void {
        this._header.set(name, value);
        for (const blocker of xhr.blockerList) {
            if (blocker.matches(this.url)) {
                return;
            }
        }
        super.setRequestHeader(name, value);
    }
    send(body?: Document | XMLHttpRequestBodyInit): void {
        for (const blocker of xhr.blockerList) {
            if (blocker.matches(this.url)) {
                blocker.end(this.url, this._header, body);
                xhr.blockerList.delete(blocker);
                this.responseText = blocker.responseText();
                this._end();
                return;
            }
        }
        super.send(body);
    }

    set responseText(responseText: string) {
        this._responseText = responseText;
    }
    get responseText() {
        if (this._responseText === null) {
            return super.responseText;
        } else {
            console.log("get responseText", this._responseText)
            return this._responseText;
        }
    }
    get status() {
        return 200;
    }
    set readyState(readyState: number) {
        this._readyState = readyState;
    }
    get readyState() {
        if (this._readyState === -100) {
            return super.readyState;
        } else {
            return this._readyState;
        }
    }
    _end() {
        console.log("faker end");
        this.readyState = 4;
        let event = new CustomEvent("build", { detail: 3 });
        if (super.onreadystatechange) {
            super.onreadystatechange(event);
        }
    }
}
window.XMLHttpRequest = FakeXMLHttpRequest;

interface Request {
    url: string | URL;
    _header: Map<string, string>;
    body?: Document | XMLHttpRequestBodyInit;
}

class Fake {

    regExp: RegExp;
    responseProvider: (req:Request) => string;
    endResolveSet = new Set<(value: { url: string | URL; _header: Map<string, string>; body?: Document | XMLHttpRequestBodyInit; } | PromiseLike<{ url: string | URL; _header: Map<string, string>; body: Document | XMLHttpRequestBodyInit; }>) => void>();
    request!: Request;

    constructor(regExp: RegExp, responseProvider: (req:Request) => string) {
        this.regExp = regExp;
        this.responseProvider = responseProvider;
    }

    matches(url: string | URL) {
        const result = this.regExp.test(url.toString());
        return result;
    }
    responseText() {
        return this.responseProvider(this.request);
    }
    end(url: string | URL, _header: Map<string, string>, body?: Document | XMLHttpRequestBodyInit) {
        this.request = { url, _header, body };
        for (const resolve of this.endResolveSet) {
            resolve(this.request);
        }
    }
    getRequest(timeout: number) {
        return new Promise<{ url: string | URL; _header: Map<string, string>; body?: Document | XMLHttpRequestBodyInit; }>((resolve, _reject) => {
            if (this.request) {
                resolve(this.request);
            } else {
                this.endResolveSet.add(resolve);
                setTimeout(() => resolve(this.request), timeout);
            }
        });
    }
}



//example
// let block = xhr.block(/tesst/,()=>JSON.stringify({}));
// ...
// const request = block.getRequest();
