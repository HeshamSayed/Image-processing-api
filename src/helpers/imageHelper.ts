import fs from 'fs/promises';
const sharp = require('sharp');
const winston = require('winston');

interface ImgResize {
    width: number;
    height: number;
    ImgPath: string;
    ImgThumbnails: string;
}


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

const resizeImage = async ({
    width,
    height,
    ImgPath,
    ImgThumbnails,
}: ImgResize): Promise<Buffer> => {
    const data: Buffer | null = await fs.readFile(ImgPath).catch(() => null);
    logger.log('error',data)
    if (!data) {
        return Promise.reject();
    }

    const imageBuffer: Buffer | null = await sharp(data)
        .resize(width, height)
        .toBuffer()
        .catch(() => null);

    if (!imageBuffer) {
        return Promise.reject();
    }

    return fs
        .writeFile(ImgThumbnails, imageBuffer)
        .then(() => {
            return imageBuffer;
        })
        .catch(() => {
            return Promise.reject();
        });
};

export default { resizeImage };
