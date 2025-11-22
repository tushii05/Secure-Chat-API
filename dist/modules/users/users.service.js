"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.saveProfileImages = saveProfileImages;
exports.setDefault = setDefault;
exports.deletePicture = deletePicture;
const prismaClient_1 = __importDefault(require("../../prismaClient"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const HttpError_1 = require("../../utils/HttpError");
async function listUsers(page = 1, perPage = 20) {
    const skip = (page - 1) * perPage;
    const users = await prismaClient_1.default.user.findMany({
        skip,
        take: perPage,
        select: { id: true, email: true, name: true }
    });
    const total = await prismaClient_1.default.user.count();
    return { data: users, page, perPage, total };
}
async function saveProfileImages(userId, files) {
    const records = [];
    for (const file of files) {
        const url = `/uploads/${file.filename}`;
        const rec = await prismaClient_1.default.userProfileImage.create({ data: { userId, url, isDefault: false } });
        records.push(rec);
    }
    return records;
}
async function setDefault(userId, pictureId) {
    const picture = await prismaClient_1.default.userProfileImage.findUnique({ where: { id: pictureId } });
    if (!picture || picture.userId !== userId) {
        throw new HttpError_1.HttpError(403, 'Cannot set default: picture does not belong to user');
    }
    await prismaClient_1.default.$transaction([
        prismaClient_1.default.userProfileImage.updateMany({ where: { userId }, data: { isDefault: false } }),
        prismaClient_1.default.userProfileImage.update({ where: { id: pictureId }, data: { isDefault: true } })
    ]);
}
async function deletePicture(userId, pictureId) {
    const pic = await prismaClient_1.default.userProfileImage.findUnique({ where: { id: pictureId } });
    if (!pic || pic.userId !== userId)
        throw new HttpError_1.HttpError(404, 'Not found');
    try {
        await promises_1.default.unlink(path_1.default.join(process.cwd(), pic.url));
    }
    catch (e) {
        console.warn('Failed to delete file:', pic.url, e);
    }
    await prismaClient_1.default.userProfileImage.delete({ where: { id: pictureId } });
}
