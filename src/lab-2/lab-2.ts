import fs from 'fs/promises';
import path from 'path';
import lodash from 'lodash';

type Bitmap = {
  fileHeader: {
    bfType: number;
    bfSize: number;
    bfReserved1: number;
    bfReserved2: number;
    bfOffBits: number;
  };
  infoHeader: {
    biSize: number;
    biWidth: number;
    biHeight: number;
    biPlanes: number;
    biBitCount: number;
    biCompression: number;
    biSizeImage: number;
    biXPelsPerMeter: number;
    biYPelsPerMeter: number;
    biClrUsed: number;
    biClrImportant: number;
  };
};

const parseBitmap = async (filePath: string) => {
  const res = await fs.readFile(filePath);

  const dv = new DataView(res.buffer);
  const bitmap = { fileHeader: {}, infoHeader: {} } as Bitmap;
  bitmap['fileHeader']['bfType'] = dv.getUint16(0, true);
  bitmap['fileHeader']['bfSize'] = dv.getUint32(2, true);
  bitmap['fileHeader']['bfReserved1'] = dv.getUint16(6, true);
  bitmap['fileHeader']['bfReserved2'] = dv.getUint16(8, true);
  bitmap['fileHeader']['bfOffBits'] = dv.getUint32(10, true);

  bitmap['infoHeader']['biSize'] = dv.getUint32(14, true);
  bitmap['infoHeader']['biWidth'] = dv.getUint32(18, true);
  bitmap['infoHeader']['biHeight'] = dv.getUint32(22, true);
  bitmap['infoHeader']['biPlanes'] = dv.getUint16(26, true);
  bitmap['infoHeader']['biBitCount'] = dv.getUint16(28, true);
  bitmap['infoHeader']['biCompression'] = dv.getUint32(30, true);
  bitmap['infoHeader']['biSizeImage'] = dv.getUint32(34, true);
  bitmap['infoHeader']['biXPelsPerMeter'] = dv.getUint32(38, true);
  bitmap['infoHeader']['biYPelsPerMeter'] = dv.getUint32(42, true);
  bitmap['infoHeader']['biClrUsed'] = dv.getUint32(46, true);
  bitmap['infoHeader']['biClrImportant'] = dv.getUint32(50, true);
  return { dv, bitmap };
};

const lab2_256 = () => {
  parseBitmap(path.join(__dirname, 'CAT256.bmp')).then(({ dv, bitmap }) => {
    const palitra = [];
    for (let i = 54; i < bitmap.fileHeader.bfOffBits; i += 4) {
      palitra.push({
        r: dv.getUint8(i),
        g: dv.getUint8(i + 1),
        b: dv.getUint8(i + 2),
      });
    }

    const palitraIndex = lodash.random(0, palitra.length, false);
    const borderSize = 15;
    const row_padded = (bitmap.infoHeader.biWidth + 3) & ~3;

    console.log('bitmap', bitmap);
    console.log('row_padded', row_padded);

    for (let i = 0; i < bitmap.infoHeader.biWidth; i++) {
      for (let j = 0; j < bitmap.infoHeader.biHeight; j++) {
        if (
          i < borderSize ||
          i >= bitmap.infoHeader.biWidth - borderSize ||
          j < borderSize ||
          j >= bitmap.infoHeader.biHeight - borderSize
        ) {
          const pos = row_padded * j + i + bitmap.fileHeader.bfOffBits;
          dv.setUint8(pos, palitraIndex);
        }
      }
    }

    fs.writeFile(path.join(__dirname, 'test.bmp'), dv);
  });
};

const lab2_TC = () => {
  parseBitmap(path.join(__dirname, '_сarib_TC.bmp')).then(({ dv, bitmap }) => {
    const row_padded = (bitmap.infoHeader.biWidth * 3 + 3) & ~3;
    const borderSize = 15;
    const r = lodash.random(0, 255, false);
    const g = lodash.random(0, 255, false);
    const b = lodash.random(0, 255, false);

    for (let i = 0; i < bitmap.infoHeader.biWidth; i++) {
      for (let j = 0; j < bitmap.infoHeader.biHeight; j++) {
        if (
          i < borderSize ||
          i >= bitmap.infoHeader.biWidth - borderSize ||
          j < borderSize ||
          j >= bitmap.infoHeader.biHeight - borderSize
        ) {
          const pos = row_padded * j + i * 3 + bitmap.fileHeader.bfOffBits;
          dv.setUint8(pos, r);
          dv.setUint8(pos + 1, g);
          dv.setUint8(pos + 2, b);
        }
      }
    }
    console.log('bitmap', bitmap);
    console.log('row_padded', row_padded);
    fs.writeFile(path.join(__dirname, 'test_TC.bmp'), dv);
  });
};

export { lab2_256, lab2_TC };
