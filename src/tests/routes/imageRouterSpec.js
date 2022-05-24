"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_size_1 = __importDefault(require("image-size"));
const index_1 = __importDefault(require("../../index"));
const supertest_1 = __importDefault(require("supertest"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
describe('GET /api/images', () => {
    it('returns 400 if called without parameters', (done) => {
        (0, supertest_1.default)(index_1.default).get('/api/images').expect(400, done);
    });
    it('returns 400 if called with a missing parameter', (done) => {
        (0, supertest_1.default)(index_1.default).get('/api/images?filename=test&height=100').expect(400, done);
    });
    it('returns 404 if called correctly but image does not exist', (done) => {
        (0, supertest_1.default)(index_1.default).get('/api/images?filename=test&height=100&width=100').expect(404, done);
    });
    it('returns 200 if called correctly and image exist', (done) => {
        (0, supertest_1.default)(index_1.default).get('/api/images?filename=ui&height=100&width=100').expect(200, done);
    });
    it('created a thumb version of the image', (done) => {
        (0, supertest_1.default)(index_1.default)
            .get('/api/images?filename=ui&height=100&width=100')
            .then(() => {
            promises_1.default.stat(path_1.default.resolve(__dirname, '../../../images/thumbnails/ui-100x100.jpg')).then((fileStat) => expect(fileStat).not.toBeNull());
            done();
        });
    });
    it('ceate image with the correct height and width', (done) => {
        (0, supertest_1.default)(index_1.default)
            .get('/api/images?filename=ui&height=100&width=150')
            .then(() => {
            const dimensions = (0, image_size_1.default)(path_1.default.resolve(__dirname, '../../../images/thumbnails/ui-100x100.jpg'));
            expect(dimensions.height).toEqual(100);
            expect(dimensions.width).toEqual(150);
            done();
        });
    });
});
