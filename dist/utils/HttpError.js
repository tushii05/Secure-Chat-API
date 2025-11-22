"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
// src/utils/HttpError.ts
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
exports.HttpError = HttpError;
