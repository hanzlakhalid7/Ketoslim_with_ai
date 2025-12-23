// Test environment polyfills that must run before any test code.
// Keeps polyfills separate so they run early via Jest `setupFiles`.

// Polyfill TextEncoder/TextDecoder using Node's util (if missing)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require('util');
if (typeof (global as any).TextEncoder === 'undefined') {
  (global as any).TextEncoder = util.TextEncoder;
}
if (typeof (global as any).TextDecoder === 'undefined') {
  (global as any).TextDecoder = util.TextDecoder;
}

// requestSubmit shim for jsdom
if (typeof HTMLFormElement !== 'undefined' && !(HTMLFormElement.prototype as any).requestSubmit) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (HTMLFormElement.prototype as any).requestSubmit = function (this: HTMLFormElement) {
    this.submit();
  };
}

export {};
