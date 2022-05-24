"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const sharp = require('sharp');
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'image_utils_logger.log' }),
    ],
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
const resizeImage = ({ width, height, ImgPath, ImgThumbnails, }) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield promises_1.default.readFile(ImgPath).catch(() => null);
    logger.log('error', data);
    if (!data) {
        return Promise.reject();
    }
    const imageBuffer = yield sharp(data)
        .resize(width, height)
        .toBuffer()
        .catch(() => null);
    if (!imageBuffer) {
        return Promise.reject();
    }
    return promises_1.default
        .writeFile(ImgThumbnails, imageBuffer)
        .then(() => {
        return imageBuffer;
    })
        .catch(() => {
        return Promise.reject();
    });
});
exports.default = { resizeImage };
