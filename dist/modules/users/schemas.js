"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersSchema = void 0;
const zod_1 = require("zod");
exports.listUsersSchema = zod_1.z.object({ page: zod_1.z.string().optional(), perPage: zod_1.z.string().optional() });
