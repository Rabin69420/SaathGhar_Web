import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost/",
    pretendToBeVisual: true,
});

const { window } = dom;

const domGlobals: Record<string, unknown> = {
    window,
    document: window.document,
    navigator: window.navigator,
    HTMLElement: window.HTMLElement,
    HTMLDivElement: window.HTMLDivElement,
    HTMLAnchorElement: window.HTMLAnchorElement,
    HTMLButtonElement: window.HTMLButtonElement,
    HTMLInputElement: window.HTMLInputElement,
    HTMLTextAreaElement: window.HTMLTextAreaElement,
    HTMLSelectElement: window.HTMLSelectElement,
    SVGElement: window.SVGElement,
    Element: window.Element,
    Node: window.Node,
    DocumentFragment: window.DocumentFragment,
    Event: window.Event,
    MouseEvent: window.MouseEvent,
    KeyboardEvent: window.KeyboardEvent,
    getComputedStyle: window.getComputedStyle,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    requestAnimationFrame: (cb: FrameRequestCallback) => setTimeout(cb, 0),
    cancelAnimationFrame: (id: number) => clearTimeout(id),
};

for (const [key, value] of Object.entries(domGlobals)) {
    if (!(key in globalThis)) {
        (globalThis as Record<string, unknown>)[key] = value;
    }
}

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    }),
});

const { cleanup } = await import("@testing-library/react");
await import("./test-setup-jest-dom");
afterEach(cleanup);
