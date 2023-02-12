import fs from 'fs/promises';
import path from 'path';
// #pragma pack (1)
// #include <stdio.h>
// struct head {
// unsigned short id;
// unsigned long f_size;
// unsigned short rez1, rez2;
// unsigned long bm_offset;
// unsigned long h_size;
// long width;
// long height;
// unsigned short planes;
// unsigned short bitperpixel;
// unsigned long compression;
// unsigned long sizeimage;
// unsigned long hres;
// unsigned long vres;
// unsigned long clrused;
// unsigned long clrimp;
// } head_file;
// main() {
// int i,n,s=0;
// unsigned char buffer[1024];
// unsigned char palitra[256][4];
// FILE *f1;
// f1=fopen("cat256.bmp","rb");
// fread(&head_file,sizeof(head_file),1,f1);
// printf("sizeof(head_file)=%d id = %c%c fsize=%d\n",sizeof(head_file),
// head_file.id&255, head_file.id>>8,head_file.f_size);
// printf("width = %d height = %d bitperpixel = %d clrused = %d \
// n",head_file.width, head_file.height, head_file.bitperpixel, head_file.clrused);
// s=sizeof(head_file);
// for(i=0; i<(head_file.bm_offset-sizeof(head_file))/4; i++) {
// s+=4;
// fread(palitra[i],4,1,f1);
// }
// do {
// n=fread(buffer,1,1024,f1);
// s+=n;
// } while(n==1024);
// printf("fsize=%d",s);
// fclose(f1);
// }

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

fs.readFile(path.join(__dirname, 'CAT256.BMP')).then(buffer => {
  console.log('buffer', buffer);
  const ba = [...buffer];
  console.log('buffer arr', ba);
  console.log('test', buffer.buffer);
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

  let start = bitmap['fileHeader']['bfOffBits'] as number;
  // let start = 54
  const stride = Math.floor(
    ((bitmap['infoHeader']['biBitCount'] * bitmap['infoHeader']['biWidth'] +
      31) /
      32) *
      4
  );
  const pixels = new Uint8Array(buffer, Math.floor(start / 8));
  const rgb = [];
  console.log('bitmap.infoHeader.biHeight', bitmap.infoHeader.biHeight);
  console.log('bitmap.infoHeader.biWidth', bitmap.infoHeader.biWidth);

  for (let i = start; i < bitmap.fileHeader.bfSize; i += 3) {
    // const r = ba[i];
    // const g = ba[i + 1];
    // const b = ba[i + 2];
    const r = dv.getUint8(i);
    const g = dv.getUint8(i + 1);
    const b = dv.getUint8(i + 2);
    const middle = Math.floor((r + g + b) / 3);
    // console.log('middle', middle);
    // dv.setUint32(i, middle, true);
    // console.log('middle', middle);

    dv.setUint8(i, middle);
    dv.setUint8(i + 1, middle);
    dv.setUint8(i + 2, middle);
    // dv.setUint8(i, 10);
    // dv.setUint8(i + 1, 10);
    // dv.setUint8(i + 2, 10);
    // const r1 = dv.getUint8(i);
    // const g1 = dv.getUint8(i + 1);
    // const b1 = dv.getUint8(i + 2);
    // console.log(`${r1}, ${g1}, ${b1}`);

    // dv.setUint8(i, 179);
    // dv.setUint8(i + 1, 179);
    // dv.setUint8(i + 2, 179);

    // ba[i] = middle;
    // ba[i + 1] = middle;
    // ba[i + 2] = middle;
  }

  // for (let y = 0; y < bitmap.infoHeader.biHeight; y++) {
  //   for (let x = 0; x < bitmap.infoHeader.biWidth; x++) {
  //     // console.log('start', start);

  //     // for (let y = 0; y < 10; y++) {
  //     //   for (let x = 0; x < 10; x++) {
  //     // for(i=0; i<(head_file.bm_offset-sizeof(head_file))/4; i++) {
  //     //   s+=4;
  //     //   fread(palitra[i],4,1,f1);
  //     //   }
  //     const index = x * 3 + stride * y;
  //     const r = pixels[index];
  //     const g = pixels[index + 1];
  //     const b = pixels[index + 2];
  //     const middle = Math.floor((r + g + b) / 3);
  //     // console.log('middle', middle);

  //     pixels[index] = middle;
  //     pixels[index + 1] = middle;
  //     pixels[index + 2] = middle;
  //     // const r = dv.getUint8(start++);
  //     // const g = dv.getUint8(start++);
  //     // const b = dv.getUint8(start++);
  //     // rgb.push({ r, g, b });
  //     // pixels.s
  //   }
  // }
  // const res = [...new Uint8Array(dv.buffer, 0, start), ...pixels];

  // bitmap['pixels'] = pixels;
  // console.log('start', start);
  // console.log('dv', dv);
  console.log('bitmap', bitmap);
  console.log('rgb', rgb);

  // console.log('pixels', pixels);
  // console.log('pixels[0]', pixels[0]);

  // const arrB = new ArrayBuffer(buffer.read);

  // fs.writeFile('test.bmp', [...[buffer].slice(0, start), pixels]);
  // fs.writeFile('test.bmp', new Uint8Array(ba));
  fs.writeFile('test.bmp', dv);
});
