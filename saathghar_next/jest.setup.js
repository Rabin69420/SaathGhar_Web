import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

class TextEncoderStream {
  constructor() {
    this.readable = {};
    this.writable = {};
  }
}
class TextDecoderStream {
  constructor() {
    this.readable = {};
    this.writable = {};
  }
}
global.TextEncoderStream = TextEncoderStream;
global.TextDecoderStream = TextDecoderStream;

global.structuredClone = global.structuredClone || ((val) => JSON.parse(JSON.stringify(val)));
let WebStream;
try {
  WebStream = require('node:stream/web').ReadableStream;
} catch (e) {
  try {
    WebStream = require('stream/web').ReadableStream;
  } catch (err) {}
}
if (WebStream) {
  global.ReadableStream = global.ReadableStream || WebStream;
}

const primitives = require('next/dist/compiled/@edge-runtime/primitives');
global.Request = primitives.Request;
global.Response = primitives.Response;
global.Headers = primitives.Headers;
global.fetch = primitives.fetch;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

