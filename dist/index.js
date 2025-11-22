"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const sockets_1 = __importDefault(require("./sockets"));
const config_1 = __importDefault(require("./config"));
const prismaClient_1 = __importDefault(require("./prismaClient"));
async function start() {
    try {
        await prismaClient_1.default.$connect();
        console.log("Connected to DB");
        const server = http_1.default.createServer(app_1.default);
        (0, sockets_1.default)(server);
        console.log("Socket.io attached");
        server.listen(config_1.default.port, () => {
            console.log(`Server running on port ${config_1.default.port}`);
        });
    }
    catch (error) {
        console.error("Server failed to start:", error);
        process.exit(1);
    }
}
start();
