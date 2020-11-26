'use strict';

const sharp = require('sharp');

const makeThumbnail = async (size, file, thumbname) => {
  console.log('makeThumbnail', file, thumbname);
  const thumbnail = await sharp(file).resize(size.width, size.height).toFile(thumbname);
  return thumbnail;
};

module.exports = {
  makeThumbnail
};