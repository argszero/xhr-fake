

type Mapping = (url: string | URL, body: Body) => boolean;

class Controoler {
    fakeList: Set<Fake>;
    constructor() {
        this.fakeList = new Set();
    }
    fake(mapping: Mapping, responseProvider: (req: FakeRequest) => FakeResponse): Fake {
        const fake = new Fake(mapping, responseProvider);
        this.fakeList.add(fake);
        return fake;
    }
}

export const xhr = new Controoler();

class FakeXMLHttpRequest extends XMLHttpRequest {
    url!: string | URL;
    _responseText: string | null = null;
    _readyState: number = -100;
    _header: Map<string, string> = new Map<string, string>();
    _status = 200;
    _method: string = "GET";
    _opened: boolean = false;
    open(method: string, url: string | URL): void {
        this.url = url;
        this._method = method;
    }
    setRequestHeader(name: string, value: string): void {
        this._header.set(name, value);
        if (this._opened) {
            super.setRequestHeader(name, value);
        }
    }
    send(body?: Document | XMLHttpRequestBodyInit | null): void {
        for (const fake of xhr.fakeList) {
            if (fake.mapping(this.url, body)) {
                fake.end(this.url, this._header, body);
                xhr.fakeList.delete(fake);
                const fakeResponse = fake.response();
                this.responseText = fakeResponse.body;
                this._status = fakeResponse.status;
                this._end();
                return;
            }
        }
        if (!this._opened) {
            this._opened = true;
            super.open(this._method, this.url);
            this._header.forEach((value, key) => super.setRequestHeader(key, value));
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
        return this._status;
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

interface FakeRequest {
    url: string | URL;
    _header: Map<string, string>;
    body?: Body;
}
class FakeResponse {
    status: number = 200;
    body: string = "{}";
    headers?: Headers = new Headers({});
}

type Body = Document | XMLHttpRequestBodyInit | BodyInit | null | undefined;

class Fake {

    mapping: Mapping;
    responseProvider: (req: FakeRequest) => FakeResponse;
    endResolveSet = new Set<(value: { url: string | URL; _header: Map<string, string>; body?: Body; } | PromiseLike<{ url: string | URL; _header: Map<string, string>; body: Document | XMLHttpRequestBodyInit; }>) => void>();
    request!: FakeRequest;

    constructor(mapping: Mapping, responseProvider: (req: FakeRequest) => FakeResponse) {
        this.mapping = mapping;
        this.responseProvider = responseProvider;
    }

    response() {
        return this.responseProvider(this.request);
    }
    end(url: string | URL, _header: Map<string, string>, body?: Body) {
        this.request = { url, _header, body };
        for (const resolve of this.endResolveSet) {
            resolve(this.request);
        }
    }
    getRequest(timeout: number) {
        return new Promise<{ url: string | URL; _header: Map<string, string>; body?: Body; }>((resolve, _reject) => {
            if (this.request) {
                resolve(this.request);
            } else {
                this.endResolveSet.add(resolve);
                setTimeout(() => resolve(this.request), timeout);
            }
        });
    }
}


const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
    let [resource, config] = args;
    let url = resource + '';

    for (const fake of xhr.fakeList) {
        if (fake.mapping(url, config?.body)) {
            fake.end(url, JSON.parse(JSON.stringify(config?.headers || null)), config?.body);
            xhr.fakeList.delete(fake);
            return new Promise<Response>((resolve, _reject) => {
                const response = fake.response();
                const responseText = response.body;
                resolve({
                    status: response.status,
                    json: async () => JSON.parse(responseText),
                    text: async () => responseText,
                    headers: response.headers,
                } as Response);
            });
        }
    }
    const response = await originalFetch(resource, config);
    return response;
};
