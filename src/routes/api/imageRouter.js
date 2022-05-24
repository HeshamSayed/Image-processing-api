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
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const imageHelper_1 = __importDefault(require("../../helpers/imageHelper"));
const winston = require('winston');
const imageRouter = express_1.default.Router();
imageRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = req.query.filename;
    const height = req.query.height ? parseInt(req.query['height'], 10) : null;
    const width = req.query.width ? parseInt(req.query['width'], 10) : null;
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [
            new winston.transports.File({ filename: 'router.log' }),
        ],
    });
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple(),
        }));
    }
    logger.log('error', req);
    if (!filename || !height || !width) {
        res.status(400).send('Please make sure url contains correct filename, height and width params');
        return;
    }
    if (!filename || !height || !width) {
        res.status(400).send('Please make sure url contains correct filename, height and width params');
        return;
    }
    const ImgPath = `${path_1.default.resolve(__dirname, `../../../images/${filename}.jpg`)}`;
    const ImgThumbnails = `${path_1.default.resolve(__dirname, `../../../images/thumbnails/${filename}-${height}x${width}.jpg`)}`;
    const fullImage = yield promises_1.default.stat(ImgPath).catch(() => {
        res.status(404).send('Image does not exist');
        return null;
    });
    if (!fullImage) {
        return;
    }
    const existingThumb = yield promises_1.default.stat(ImgThumbnails).catch(() => {
        return null;
    });
    if (existingThumb) {
        promises_1.default.readFile(ImgThumbnails)
            .then((thumbData) => {
            res.status(200).contentType('jpg').send(thumbData);
        })
            .catch(() => {
            res.status(500).send('Something went wrong , please try again later');
        });
    }
    else {
        imageHelper_1.default
            .resizeImage({
            ImgPath,
            ImgThumbnails,
            height,
            width,
        })
            .then((resizedImage) => {
            res.status(200).contentType('jpg').send(resizedImage);
        })
            .catch(() => {
            res.status(500).send('Something went wrong , please try again later');
        });
    }
}));
exports.default = imageRouter;
