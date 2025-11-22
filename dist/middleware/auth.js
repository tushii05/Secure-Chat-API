"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuth = ensureAuth;
exports.requireRole = requireRole;
const jwt_1 = require("../utils/jwt");
function ensureAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer '))
        return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    try {
        const payload = (0, jwt_1.verifyAccess)(token);
        req.user = { id: payload.sub, role: payload.role };
        next();
    }
    catch (e) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        if (req.user.role !== role && req.user.role !== 'ADMIN')
            return res.status(403).json({ message: 'Forbidden' });
        next();
    };
}
