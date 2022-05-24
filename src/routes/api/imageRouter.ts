import express, { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import imageHelper from '../../helpers/imageHelper';
import { Stats } from 'fs';
const winston = require('winston');

const imageRouter = express.Router();



imageRouter.get('/', async (req: Request, res: Response): Promise<void> => {
    const filename = req.query.filename;
    const height = req.query.height ? parseInt(req.query['height'] as string, 10) : null;
    const width = req.query.width ? parseInt(req.query['width'] as string, 10) : null;


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


    logger.log('error',req)

    if (!filename || !height || !width)  {
        res.status(400).send('Please make sure url contains correct filename, height and width params');
        return;
    }

    if (!filename || !height || !width)  {
        res.status(400).send('Please make sure url contains correct filename, height and width params');
        return;
    }


    const ImgPath = `${path.resolve(__dirname, `../../../images/${filename}.jpg`)}`;

    const ImgThumbnails = `${path.resolve(__dirname, `../../../images/thumbnails/${filename}-${height}x${width}.jpg`)}`;

    const fullImage: Stats | null = await fs.stat(ImgPath).catch(() => {
        res.status(404).send('Image does not exist');
        return null;
    });

    if (!fullImage) {
        return;
    }

    const existingThumb: Stats | null = await fs.stat(ImgThumbnails).catch(() => {
        return null;
    });

    if (existingThumb) {
        fs.readFile(ImgThumbnails)
            .then((thumbData: Buffer) => {
                res.status(200).contentType('jpg').send(thumbData);
            })
            .catch(() => {
                res.status(500).send('Something went wrong , please try again later');
            });
    } else {
        imageHelper
            .resizeImage({
                ImgPath,
                ImgThumbnails,
                height,
                width,
            })
            .then((resizedImage: Buffer) => {
                res.status(200).contentType('jpg').send(resizedImage);
            })
            .catch(() => {
                res.status(500).send('Something went wrong , please try again later');
            });
    }
});

export default imageRouter;
