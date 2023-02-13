import fs from 'fs/promises';
import path from 'path';

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

export function lab1() {
  fs.readFile(path.join(__dirname, 'CAT256.BMP')).then(buffer => {
    const dv = new DataView(buffer.buffer);
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

    // меняем палитру
    for (let i = 54; i < bitmap.fileHeader.bfOffBits; i += 4) {
      const r = dv.getUint8(i);
      const g = dv.getUint8(i + 1);
      const b = dv.getUint8(i + 2);
      const middle = Math.floor((r + g + b) / 3);
      dv.setUint8(i, middle);
      dv.setUint8(i + 1, middle);
      dv.setUint8(i + 2, middle);
    }
    console.log('bitmap', bitmap);
    fs.writeFile(path.join(__dirname, 'test.bmp'), dv);
  });
}
