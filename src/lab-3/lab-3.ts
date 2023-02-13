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

const lab3 = () => {
  parseBitmap(path.join(__dirname, '_сarib_TC.bmp')).then(({ dv, bitmap }) => {
    dv.setUint32(18, bitmap.infoHeader.biHeight, true);
    dv.setUint32(22, bitmap.infoHeader.biWidth, true);

    const row_padded = (bitmap.infoHeader.biWidth * 3 + 3) & ~3;

    const bytes = [] as { r: number; g: number; b: number }[][];

    for (let i = 0; i < bitmap.infoHeader.biWidth; i++) {
      bytes[i] = [];
      for (let j = 0; j < bitmap.infoHeader.biHeight; j++) {
        const pos = row_padded * j + i * 3 + bitmap.fileHeader.bfOffBits;
        console.log('pos', pos);

        const r = dv.getUint8(pos);
        const g = dv.getUint8(pos + 1);
        const b = dv.getUint8(pos + 2);
        bytes[i].push({ r, g, b });
      }
    }

    // const revBytes = [] as typeof bytes;
    // for (let i = 0; i < bytes.length; i++) {
    //   for (let j = 0; j < bytes[i].length; j++) {
    //     if (!revBytes[j]) {
    //       revBytes[j] = [];
    //     }
    //     revBytes[j][i] = bytes[i][j];
    //   }
    // }

    // let pos = bitmap.fileHeader.bfOffBits;
    // for (let i = 0; i < revBytes.length; i++) {
    //   for (let j = 0; j < revBytes[i].length; j++) {
    //     // const randIndex = lodash.random(0, revBytes[i].length - 1, false);

    //     const el = revBytes[i][j];
    //     // dv.setUint8(pos, el.r);
    //     // dv.setUint8(pos + 1, el.g);
    //     // dv.setUint8(pos + 2, el.b);
    //     dv.setUint8(pos, el.r);
    //     dv.setUint8(pos + 1, el.g);
    //     dv.setUint8(pos + 2, el.b);
    //     pos += 3;
    //   }
    // }

    let pos = bitmap.fileHeader.bfOffBits;
    for (let i = 0; i < bytes.length; i++) {
      for (let j = 0; j < bytes[i].length; j++) {
        const el = bytes[i][j];
        dv.setUint8(pos, el.r);
        dv.setUint8(pos + 1, el.g);
        dv.setUint8(pos + 2, el.b);
        pos += 3;
      }
    }

    console.log('bytes', bytes[0].length);
    // console.log('revBytes', revBytes[0].length);

    console.log('bitmap', bitmap);
    fs.writeFile(path.join(__dirname, 'test_TC.bmp'), dv);
  });
};

export { lab3 };
