import path from 'path';
import imageHelper from '../../helpers/imageHelper';

const ImgPath = path.resolve(__dirname, '../../../images/ui.jpg');
const ImgThumbnails = path.resolve(__dirname, '../../../images/thumbnails/ui.jpg');

describe('The imageResizer function', (): void => {
    it('returns a buffer if image sucessfully resized', async () => {
        const imageBuffer: Buffer = await imageHelper.resizeImage({
            height: 100,
            width: 150,
            ImgPath,
            ImgThumbnails,
        });
        expect(imageBuffer).toBeInstanceOf(Buffer);
    });

    it('rejects promise if an error occured', async (): Promise<void> => {
        await expectAsync(
            imageHelper.resizeImage({
                height: 100,
                width: 150,
                ImgPath: '',
                ImgThumbnails,
            }),
        ).toBeRejected();
    });
});
