#! /usr/bin/env node
var fs = require('fs');
var path = require('path');
var zipdir = require('zip-dir');
var nodeZipDir = require('node-zip-dir');
var xhr = require('superagent');
var rmdir = require('rmdir');
var appTemplateFiles = require('./lib/appTemplateFiles');

var CLI_VERSION = '0.11.0';

var WIDGET_DEPLOY_URL;
var APP_DEPLOY_URL;
var IL_DEPLOY_URL;

function setDeployUrl(site) {
  WIDGET_DEPLOY_URL = 'https://' + site + '.singular.live/widgets/deploy';
  APP_DEPLOY_URL = 'https://' + site + '.singular.live/apptemplates/deploy';
  IL_DEPLOY_URL = 'https://' + site + '.singular.live/interactives/deploy';
  //console.log(APP_DEPLOY_URL);
}

// Get user arguments. `--version=<name>` and `--all-versions` are read apart
// from the positional arguments, so the site stays the third positional.
var VERSION_FLAG = '--version=';
var ALL_VERSIONS_FLAG = '--all-versions';
var rawArgs = process.argv.slice(2);
var versionArg = null;
var allVersions = false;
var userArgs = rawArgs.filter(function (arg) {
  if (arg.indexOf(VERSION_FLAG) === 0) {
    versionArg = arg.slice(VERSION_FLAG.length);
    return false;
  }
  if (arg === ALL_VERSIONS_FLAG) {
    allVersions = true;
    return false;
  }
  return true;
});
var command = userArgs[0];

//console.log(userArgs);
if (!command) {
  helpMe();
  return;
}

function helpMe() {
  console.log('Available commands from singular-cli v' + CLI_VERSION);

  console.log('singular createwidget <widget-name> - Init Singular Widget boiler plate');
  console.log('singular deploywidget <widget-folder-name> - Deploy Singular Widget');

  console.log('singular createapp <app-name> - Init Singular App boiler plate');
  console.log('singular deployapp <app-folder-name> - Deploy Singular App');
  console.log('singular deploydevapp <app-folder-name> - Deploy Singular App for dev');
  console.log('  --version=<name>  Deploy one version: <app-folder-name>/versions/<name>/');
  console.log('  --all-versions    Deploy every version in <app-folder-name>/versions/');
}

function showReqError(err) {
  if (err.status == '404') {
    //console.log(err);
    console.log('Error: Invalid deploy key');
  } else {
    //console.log(err);
    if(err.response && err.response.error && err.response.error.text) {
      var errorJson = JSON.parse(err.response.error.text);
      if (errorJson && errorJson.error && errorJson.error.message) {
        console.log(errorJson.error.message);
      }
    }
    console.error('Error with status: ' + err.status + '. Please try again later');
  }
}

// Override site if needed
if (userArgs[2]) {
  var site = userArgs[2];
  if (site != 'app' && site != 'beta' && site != 'alpha') {
    console.log('Unknown site - Please use app, beta or alpha');
    return;
  } else {
    setDeployUrl(site);
  }
} else {
  setDeployUrl('app');
}

//console.log(userArgs);

// For local test
// WIDGET_DEPLOY_URL = 'http://localhost:3000/widgets/deploy';
// APP_DEPLOY_URL = 'http://localhost:3000/apptemplates/deploy';
// IL_DEPLOY_URL = 'http://localhost:3000/interactives/deploy';

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
        fs.unlinkSync('./boilerplate.zip');

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
  if (fs.existsSync(folderPrefix + 'widget.json')) {
    try {
      widgetJson = fs.readFileSync(folderPrefix + 'widget.json', {encoding: 'utf8'});
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
      var req = xhr.put(WIDGET_DEPLOY_URL);
      req.field('key', configJson.deploykey);
      if (widgetJson) {
        req.field('widgetJson', widgetJson);
      }
      req.attach('zipfile', folderPrefix + 'SingularWidget.zip');
      req.end(function(err, res) {
        if (err) {
          showReqError(err);
        } else {
          console.log('Widget ID: ' + res.body + ' successfully deployed');
        }

        // Cleanup
        fs.unlinkSync(folderPrefix + 'SingularWidget.zip');
      });
    }
  });

} else if (command.toLowerCase() == 'deployapp' || command.toLocaleLowerCase() == 'deploydevapp') {

  // Folder name is required
  if (!userArgs[1]) {
    console.log('Please use singular deployapp <app-name> [--version=<name> | --all-versions]');
    return;
  }

  var appFolderName = userArgs[1];
  var versionsDir = './' + appFolderName + '/versions';
  var versions = listVersions(versionsDir);

  if (versionArg === '') {
    console.error('ERROR: --version needs a name: --version=<name>');
    return;
  }
  if (versionArg !== null && allVersions) {
    console.error('ERROR: Use --version or --all-versions, not both');
    return;
  }
  if ((versionArg !== null || allVersions) && !versions.length) {
    console.error('ERROR: No version folders in ' + versionsDir);
    return;
  }
  if (versionArg !== null && versions.indexOf(versionArg) < 0) {
    console.error('ERROR: No version "' + versionArg + '" in ' + versionsDir + ' (found: ' + versions.join(', ') + ')');
    return;
  }
  // Without a flag an app with versions would deploy its own folder, which
  // holds no deploy key or API files of its own.
  if (versionArg === null && !allVersions && versions.length && appFolderName.indexOf('deploykey.json') < 0) {
    console.error('ERROR: ' + appFolderName + ' has versions (' + versions.join(', ') + '): ' +
      'pass --version=<name> or --all-versions');
    return;
  }

  var targets = allVersions ? versions : [versionArg];

  // One App Manager entry at a time, so the log of each upload stays readable.
  // A failed version does not stop the next one.
  var results = [];
  var deployNext = function (index) {
    if (index >= targets.length) {
      if (targets.length > 1) {
        console.log('-----------------------------------------------');
        results.forEach(function (result) {
          console.log((result.ok ? 'Deployed: ' : 'FAILED:   ') + result.version);
        });
      }
      return;
    }
    deployApp(appFolderName, targets[index], function (ok) {
      results.push({version: targets[index], ok: ok});
      deployNext(index + 1);
    });
  };
  deployNext(0);
}
else {
  helpMe();
}

// The version folders in an app's versions/ folder, sorted by name. Only a
// folder with its own deploykey.json is a version, so an app that keeps an
// unrelated versions/ folder deploys as before.
function listVersions(versionsDir) {
  if (!fs.existsSync(versionsDir)) return [];
  return fs.readdirSync(versionsDir).filter(function (name) {
    var dir = versionsDir + '/' + name;
    return fs.statSync(dir).isDirectory() && fs.existsSync(dir + '/deploykey.json');
  }).sort();
}

// Deploys one App Manager entry and calls `done(ok)`. A version is deployed
// from `<app>/versions/<version>/`, laid out like an app without versions:
// its deploykey.json, API files and CompositionContract.md, and its
// `sourcefolder` resolved against that folder.
function deployApp(appFolderName, version, done) {
  var folderName = version ? appFolderName + '/versions/' + version : appFolderName;
  var deployKeyLocation = '';
  var deployKey = null;

  // if (command.toLowerCase() == 'deployapp') {
  //   if (folderName.indexOf('deploykey.json') > 0) {
  //     deployKeyLocation = folderName; // Full path
  //   } else {
  //     deployKeyLocation = './' + folderName + '/deploykey.json'; // Default, backward compat
  //   }
  // } else if (command.toLowerCase() == 'deploydevapp') {
  //   if (folderName.indexOf('deploytestkey.json') > 0) {
  //     deployKeyLocation = folderName; // Full path
  //   } else {
  //     deployKeyLocation = './' + folderName + '/deploytestkey.json'; // Default, backward compat
  //   }
  // }

  if (folderName.indexOf('deploykey.json') > 0) {
    deployKeyLocation = folderName; // Full path
  } else {
    deployKeyLocation = './' + folderName + '/deploykey.json'; // Default, backward compat
  }

  var req = xhr.put(APP_DEPLOY_URL);

  console.log('-----------------------------------------------');
  if (command.toLowerCase() == 'deployapp') {
    console.log('Singular.Live Deploy App (deploykey in deploykey.json)');
  } else {
    console.log('Singular.Live Deploy Dev App (devdeploykey in deploykey.json)');
  }
  if (version) {
    console.log('Version: ' + version);
  }

  try {
    var config = fs.readFileSync(deployKeyLocation, {encoding: 'utf8'});
    var configJson = JSON.parse(config);

    if (command.toLowerCase() == 'deployapp') {
      deployKey = configJson.deploykey;

      if (!deployKey) {
        console.error('ERROR: Cannot find deploykey in deploykey.json');
        return done(false);
      }
    } else if (command.toLowerCase() == 'deploydevapp') {
      deployKey = configJson.devdeploykey;

      if (!deployKey) {
        console.error('ERROR: Cannot find devdeploykey in deploykey.json');
        return done(false);
      }
    }
  }
  catch (e) {
    console.error('ERROR: Cannot access deploykey.json: ' + e);
    return done(false);
  }

  var folderSourcePrefix = '';
  if (configJson.sourcefolder) {
    // A relative path is read from the folder that holds deploykey.json.
    folderSourcePrefix = path.isAbsolute(configJson.sourcefolder)
      ? configJson.sourcefolder
      : './' + path.join(path.dirname(deployKeyLocation), configJson.sourcefolder);
  } else {
    folderSourcePrefix = './' + folderName + '/source';
  }

  console.log('Validating files in directory ' + folderSourcePrefix);

  // Check for output.html and icon.png
  try {
    var stats = fs.lstatSync(folderSourcePrefix);

    if (stats.isDirectory()) {
      try {
        var outputHtmlFile = fs.lstatSync(folderSourcePrefix + '/app.html');
      } catch(e) {
        console.error('ERROR: Cannot find file "' + folderSourcePrefix + '/app.html"');
        return done(false);
      }
      try {
        var iconPngFile = fs.lstatSync(folderSourcePrefix + '/icon.png');
      } catch(e) {
        console.error('ERROR: Cannot find file "' + folderSourcePrefix + '/icon.png"');
        return done(false);
      }
    } else {
      console.error('ERROR: "source" is not a directory');
      return done(false);
    }
  } catch(e) {
    console.error('ERROR: Cannot find directory ' + folderSourcePrefix);
    return done(false);
  }

  // Check API file
  var apiInfoLoc = './' + folderName + '/api.info';
  var apiCodeLoc = './' + folderName + '/api.js';
  var apiJsonLoc = './' + folderName + '/api.json';
  try {
    var stats = fs.lstatSync(apiInfoLoc);
    console.log('INFO: Found api.info');

    req.field('api_info', fs.readFileSync(apiInfoLoc, {encoding: 'utf8'}));
  } catch (e) {
    console.log('INFO: api.info not found');
    req.field('api_info', ' ');
  }

  try {
    var stats = fs.lstatSync(apiCodeLoc);
    console.log('INFO: Found api.js');

    req.field('api_code', fs.readFileSync(apiCodeLoc, {encoding: 'utf8'}));
  } catch (e) {
    console.log('INFO: api.js not found');
    req.field('api_code', ' ');
  }

  try {
    var stats = fs.lstatSync(apiJsonLoc);
    console.log('INFO: Found api.json');

    req.field('api_json', fs.readFileSync(apiJsonLoc, {encoding: 'utf8'}));
  } catch (e) {
    console.log('INFO: api.json not found');
    req.field('api_json', ' ');
  }

  // CompositionContract.md is generated only for apps that define a
  // composition contract. Match its name case-insensitively so uploads work
  // consistently on case-sensitive and case-insensitive file systems.
  try {
    var compositionContractLoc = appTemplateFiles.findFileCaseInsensitive(
      './' + folderName,
      'CompositionContract.md'
    );

    if (!compositionContractLoc) {
      console.log('INFO: CompositionContract.md not found');
    } else {
      console.log('INFO: Found CompositionContract.md');

      req.field('composition_contract', fs.readFileSync(compositionContractLoc, {encoding: 'utf8'}));
    }
  } catch (e) {
    console.log('INFO: CompositionContract.md not found');
    req.field('composition_contract', ' ');
  }

  // Zip source folder
  console.log('Creating zip file');

  zipdir(folderSourcePrefix, { saveTo: folderSourcePrefix + '/SingularApp.zip' }, function (err, buffer) {
    if (err) {
      console.error('ERROR: Cannot zip directory ' + folderSourcePrefix);
      return done(false);
    } else {
      console.log('Deploying app to Singular.Live');

      // Upload source folder to Singular.Live
      req.field('key', deployKey);
      req.attach('zipfile', folderSourcePrefix + '/SingularApp.zip');
      req.end(function(err, res) {
        if (err) {
          showReqError(err);
        } else {
          //console.log(res.body);
          if (res.body // null and undefined check
            && Object.keys(res.body).length === 0 && res.body.constructor === Object) {
            console.log('App successfully deployed');
          } else {
            console.log('App ID: ' + res.body + ' successfully deployed');
          }
        }

        // Cleanup
        fs.unlinkSync(folderSourcePrefix + '/SingularApp.zip');
        done(!err);
      });
    }
  });
}

