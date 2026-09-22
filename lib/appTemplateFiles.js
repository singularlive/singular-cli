var fs = require('fs');
var path = require('path');

function findFileCaseInsensitive(directory, expectedFileName) {
  var entries = fs.readdirSync(directory);
  var expectedLowerCase = expectedFileName.toLowerCase();
  var fallbackName = null;

  for (var i = 0; i < entries.length; i++) {
    if (entries[i] === expectedFileName) {
      return path.join(directory, entries[i]);
    }

    if (fallbackName === null && entries[i].toLowerCase() === expectedLowerCase) {
      fallbackName = entries[i];
    }
  }

  return fallbackName === null ? null : path.join(directory, fallbackName);
}

module.exports = {
  findFileCaseInsensitive: findFileCaseInsensitive
};
