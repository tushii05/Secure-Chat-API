"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.uploadProfilePictures = uploadProfilePictures;
exports.setDefaultPicture = setDefaultPicture;
exports.deletePicture = deletePicture;
const service = __importStar(require("./users.service"));
async function listUsers(req, res, next) {
    try {
        const page = Number(req.query.page || 1);
        const perPage = Number(req.query.perPage || 20);
        const data = await service.listUsers(page, perPage);
        res.json(data);
    }
    catch (err) {
        next(err);
    }
}
async function uploadProfilePictures(req, res, next) {
    try {
        const userId = Number(req.params.id);
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files' });
        }
        const results = await service.saveProfileImages(userId, files);
        res.status(201).json(results);
    }
    catch (err) {
        next(err);
    }
}
async function setDefaultPicture(req, res, next) {
    try {
        const userId = Number(req.params.id);
        const pictureId = Number(req.params.pictureId);
        await service.setDefault(userId, pictureId);
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
}
async function deletePicture(req, res, next) {
    try {
        const userId = Number(req.params.id);
        const pictureId = Number(req.params.pictureId);
        await service.deletePicture(userId, pictureId);
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
}
