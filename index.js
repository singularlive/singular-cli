#! /usr/bin/env node

var fs = require('fs');
var zipdir = require('zip-dir');
var nodeZipDir = require('node-zip-dir');
var xhr = require('superagent');
var rmdir = require('rmdir');

var WIDGET_DEPLOY_URL = 'https://alpha.singular.live/widgets/deploy';
var APP_DEPLOY_URL = 'https://alpha.singular.live/widgets/deploy';
//deployUrl = 'http://localhost:3000/widgets/deploy';

// Get user arguments
var userArgs = process.argv.slice(2);
var command = userArgs[0];

//console.log(userArgs);
if (!command) {
  helpMe();
}

function helpMe() {
  console.log('Available commands from singular-cli');
  console.log('singular createwidget <widget-name> - Init Singular Widget boiler plate');
  console.log('singular deploywidget <widget-folder-name> - Deploy Singular Widget');
  console.log('singular createapp <app-name> - Init Singular App boiler plate');
  console.log('singular deployapp <app-folder-name> - Deploy Singular App');
}
// Shared functions

// To parse binary data from xhr
function binaryParser(res, callback) {
  res.setEncoding('binary');
  res.data = '';
  res.on('data', function (chunk) {
    res.data += chunk;
  });
  res.on('end', function () {
    callback(null, new Buffer(res.data, 'binary'));
  });
}

// Download latest code from github and unzip it
function downloadFromGit(folderName, gitFolder, gitUrl, callback) {
  xhr.get(gitUrl)
  .buffer()
  .parse(binaryParser)
  .end(function(err, resp) {
    if (err) {
      callback(err);
    } else {
      //resp.body is the buffer
      //resp.data is the raw data
      fs.writeFileSync("./boilerplate.zip", resp.body);
      var tempFolderName = 'temp' + new Date().valueOf();

      nodeZipDir.unzip('./boilerplate.zip', tempFolderName).then(function() {

        // Move files in folder outside
        var sourcePath = './' + tempFolderName + '/' + gitFolder;
        var targetPath = './' + folderName;

        fs.renameSync(sourcePath, targetPath);
        fs.unlink('./boilerplate.zip');

        rmdir(tempFolderName, function (err, dirs, files) {
          if (err) {
            callback(err);
          } else {
            callback();
          }
        });

      }).catch(function(err) {
        callback('Error' + err);    
      });
    }
  });
}

if (command.toLowerCase() == 'createwidget') {
  
  // Folder name is required
  if (!userArgs[1]) {
    console.log('Please use singular createwidget <widget-name>');
    return;
  }

  var folderName = userArgs[1];

  // Download git from widget-development-boilerplate
  downloadFromGit(folderName, 'widget-development-boilerplate-master', 'https://github.com/singularlive/widget-development-boilerplate/archive/master.zip', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Singular Widget - ' + folderName + ' has been created');
    }
  });

} else if (command.toLowerCase() == 'createapp') {

  // Folder name is required
  if (!userArgs[1]) {
    console.log('Please use singular createapp <app-name>');
    return;
  }

  var folderName = userArgs[1];

  // Download git from widget-development-boilerplate
  downloadFromGit(folderName, 'app-development-boilerplate-master', 'https://github.com/singularlive/app-development-boilerplate/archive/master.zip', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Singular App - ' + folderName + ' has been created');
    }
  });

} else if (command.toLowerCase() == 'deploywidget') {

  // Folder name is required
  if (!userArgs[1]) {
    console.log('Please use singular deploywidget <widget-name>');
    return;
  }

  var folderName = userArgs[1];
  var folderPrefix = './' + folderName + '/';

  console.log('-----------------------------------------------');
  console.log('Singular.Live widget deploy');

  try {
    var config = fs.readFileSync(folderPrefix + 'deploykey.json', {encoding: 'utf8'});
    var configJson = JSON.parse(config);
    if (!configJson.deploykey) {
      console.error('ERROR: Cannot find deploy key in deploykey.json');
      return;
    }
  }
  catch (e) {
    console.error('ERROR: Cannot access deploykey.json: ' + e);
    return;
  }

  console.log('Validating files in directory "source"');

  // Check for output.html and icon.png
  try {
    var stats = fs.lstatSync(folderPrefix + 'source');

    if (stats.isDirectory()) {
      try {
        var outputHtmlFile = fs.lstatSync(folderPrefix + 'source/output.html');
      } catch(e) {
        console.error('ERROR: Cannot find file "source/output.html"');
        return;
      }
      try {
        var iconPngFile = fs.lstatSync(folderPrefix + 'source/icon.png');
      } catch(e) {
        console.error('ERROR: Cannot find file "source/icon.png"');
        return;
      }
    } else {
      console.error('ERROR: "source" is not a directory');
      return;
    }
  } catch(e) {
    console.error('ERROR: Cannot find directory "source"');
    return;
  }

  // Check if there's widget.json
  var widgetJson = null;
  if (fs.existsSync(folderPrefix + 'source/widget.json')) {
    try {
      widgetJson = fs.readFileSync(folderPrefix + 'source/widget.json', {encoding: 'utf8'});
      var validJson = JSON.parse(widgetJson);
    }
    catch (e) {
      console.error('ERROR: widget.json is not valid JSON');
      return;
    }
  }

  // Zip source folder
  console.log('Creating zip file');

  zipdir(folderPrefix + 'source', { saveTo: folderPrefix + 'SingularWidget.zip' }, function (err, buffer) {
    if (err) {
      console.error('ERROR: Cannot zip directory "source"');
      return;
    } else {
      console.log('Deploying widget to Singular.Live');

      // Upload source folder to Singular.Live
      var req = xhr.put(deployUrl);
      req.field('key', configJson.deploykey);
      if (widgetJson) {
        req.field('widgetJson', widgetJson);
      }
      req.attach('zipfile', folderPrefix + 'SingularWidget.zip');
      req.end(function(err, res) {
        if(err) {
          console.error(err);
        } else {
          console.log('Widget ID: ' + res.body + ' successfully deployed');
        }

        // Cleanup
        fs.unlink(folderPrefix + 'SingularWidget.zip');
      });
    }
  });

} else if (command.toLowerCase() == 'deployapp') {

  // Folder name is required
  if (!userArgs[1]) {
    console.log('Please use singular deployapp <app-name>');
    return;
  }

  var folderName = userArgs[1];
  var folderPrefix = './' + folderName + '/';

  console.log('-----------------------------------------------');
  console.log('Singular.Live app deploy');

  try {
    var config = fs.readFileSync(folderPrefix + 'deploykey.json', {encoding: 'utf8'});
    var configJson = JSON.parse(config);
    if (!configJson.deploykey) {
      console.error('ERROR: Cannot find deploy key in deploykey.json');
      return;
    }
  }
  catch (e) {
    console.error('ERROR: Cannot access deploykey.json: ' + e);
    return;
  }

  console.log('Validating files in directory "source"');

  // Check for output.html and icon.png
  try {
    var stats = fs.lstatSync(folderPrefix + 'source');

    if (stats.isDirectory()) {
      try {
        var outputHtmlFile = fs.lstatSync(folderPrefix + 'source/app.html');
      } catch(e) {
        console.error('ERROR: Cannot find file "source/app.html"');
        return;
      }
      try {
        var iconPngFile = fs.lstatSync(folderPrefix + 'source/icon.png');
      } catch(e) {
        console.error('ERROR: Cannot find file "source/icon.png"');
        return;
      }
    } else {
      console.error('ERROR: "source" is not a directory');
      return;
    }
  } catch(e) {
    console.error('ERROR: Cannot find directory "source"');
    return;
  }

  // Zip source folder
  console.log('Creating zip file');

  zipdir(folderPrefix + 'source', { saveTo: folderPrefix + 'SingularApp.zip' }, function (err, buffer) {
    if (err) {
      console.error('ERROR: Cannot zip directory "source"');
      return;
    } else {
      console.log('Deploying app to Singular.Live');

      // Upload source folder to Singular.Live
      var req = xhr.put(deployUrl);
      req.field('key', configJson.deploykey)
      req.attach('zipfile', folderPrefix + 'SingularApp.zip');
      req.end(function(err, res) {
        if(err) {
          console.error(err);
        } else {
          console.log('App ID: ' + res.body + ' successfully deployed');
        }

        // Cleanup
        fs.unlink(folderPrefix + 'SingularApp.zip');
      });
    }
  });
} else {
  helpMe();
}