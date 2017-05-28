'use strict';

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _teen_process = require('teen_process');

var _asyncbox = require('asyncbox');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _appiumSupport = require('appium-support');

var _appiumAndroidIme = require('appium-android-ime');

var _ioAppiumSettings = require('io.appium.settings');

var _appiumUnlock = require('appium-unlock');

var _appiumAndroidBootstrap = require('appium-android-bootstrap');

var _appiumAndroidBootstrap2 = _interopRequireDefault(_appiumAndroidBootstrap);

var _appiumAdb = require('appium-adb');

var _appiumAdb2 = _interopRequireDefault(_appiumAdb);

var REMOTE_TEMP_PATH = "/data/local/tmp";
var REMOTE_INSTALL_TIMEOUT = 90000; // milliseconds
var CHROME_BROWSERS = ["Chrome", "Chromium", "Chromebeta", "Browser", "chrome", "chromium", "chromebeta", "browser", "chromium-browser"];

var helpers = {};

helpers.parseJavaVersion = function (stderr) {
  var lines = stderr.split("\n");
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(lines), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var line = _step.value;

      if (new RegExp(/(java|openjdk) version/).test(line)) {
        return line.split(" ")[2].replace(/"/g, '');
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return null;
};

helpers.getJavaVersion = function callee$0$0() {
  var _ref, stderr, javaVer;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug("Getting Java version");

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('java', ['-version']));

      case 3:
        _ref = context$1$0.sent;
        stderr = _ref.stderr;
        javaVer = helpers.parseJavaVersion(stderr);

        if (!(javaVer === null)) {
          context$1$0.next = 8;
          break;
        }

        throw new Error("Could not get the Java version. Is Java installed?");

      case 8:
        _logger2['default'].info('Java version is: ' + javaVer);
        return context$1$0.abrupt('return', javaVer);

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.prepareEmulator = function callee$0$0(adb, opts) {
  var avd, avdArgs, language, locale, avdLaunchTimeout, avdReadyTimeout, avdName, runningAVD;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        avd = opts.avd;
        avdArgs = opts.avdArgs;
        language = opts.language;
        locale = opts.locale;
        avdLaunchTimeout = opts.avdLaunchTimeout;
        avdReadyTimeout = opts.avdReadyTimeout;

        if (avd) {
          context$1$0.next = 8;
          break;
        }

        throw new Error("Cannot launch AVD without AVD name");

      case 8:
        avdName = avd.replace('@', '');
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.getRunningAVD(avdName));

      case 11:
        runningAVD = context$1$0.sent;

        if (!(runningAVD !== null)) {
          context$1$0.next = 21;
          break;
        }

        if (!(avdArgs && avdArgs.toLowerCase().indexOf("-wipe-data") > -1)) {
          context$1$0.next = 19;
          break;
        }

        _logger2['default'].debug('Killing \'' + avdName + '\' because it needs to be wiped at start.');
        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(adb.killEmulator(avdName));

      case 17:
        context$1$0.next = 21;
        break;

      case 19:
        _logger2['default'].debug("Not launching AVD because it is already running.");
        return context$1$0.abrupt('return');

      case 21:
        context$1$0.next = 23;
        return _regeneratorRuntime.awrap(adb.launchAVD(avd, avdArgs, language, locale, avdLaunchTimeout, avdReadyTimeout));

      case 23:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.ensureDeviceLocale = function callee$0$0(adb, language, country) {
  var haveLanguage, haveCountry, changed, curLanguage, curCountry, curLocale, locale;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        haveLanguage = language && typeof language === "string";
        haveCountry = country && typeof country === "string";

        if (!(!haveLanguage && !haveCountry)) {
          context$1$0.next = 4;
          break;
        }

        return context$1$0.abrupt('return');

      case 4:
        changed = false;
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(adb.getApiLevel());

      case 7:
        context$1$0.t0 = context$1$0.sent;

        if (!(context$1$0.t0 < 23)) {
          context$1$0.next = 25;
          break;
        }

        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.getDeviceLanguage());

      case 11:
        curLanguage = context$1$0.sent;
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(adb.getDeviceCountry());

      case 14:
        curCountry = context$1$0.sent;

        if (!(haveLanguage && language !== curLanguage)) {
          context$1$0.next = 19;
          break;
        }

        context$1$0.next = 18;
        return _regeneratorRuntime.awrap(adb.setDeviceLanguage(language));

      case 18:
        changed = true;

      case 19:
        if (!(haveCountry && country !== curCountry)) {
          context$1$0.next = 23;
          break;
        }

        context$1$0.next = 22;
        return _regeneratorRuntime.awrap(adb.setDeviceCountry(country));

      case 22:
        changed = true;

      case 23:
        context$1$0.next = 34;
        break;

      case 25:
        context$1$0.next = 27;
        return _regeneratorRuntime.awrap(adb.getDeviceLocale());

      case 27:
        curLocale = context$1$0.sent;
        locale = undefined;

        if (!haveCountry) {
          locale = language.toLowerCase();
        } else if (!haveLanguage) {
          locale = country;
        } else {
          locale = language.toLowerCase() + "-" + country.toUpperCase();
        }

        if (!(locale !== curLocale)) {
          context$1$0.next = 34;
          break;
        }

        context$1$0.next = 33;
        return _regeneratorRuntime.awrap(adb.setDeviceLocale(locale));

      case 33:
        changed = true;

      case 34:
        if (!changed) {
          context$1$0.next = 37;
          break;
        }

        context$1$0.next = 37;
        return _regeneratorRuntime.awrap(adb.reboot());

      case 37:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getDeviceInfoFromCaps = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var adb, udid, emPort, devices, availDevicesStr, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, device, deviceOS;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumAdb2['default'].createADB({
          javaVersion: opts.javaVersion,
          adbPort: opts.adbPort
        }));

      case 2:
        adb = context$1$0.sent;
        udid = opts.udid;
        emPort = null;

        if (!opts.avd) {
          context$1$0.next = 12;
          break;
        }

        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(helpers.prepareEmulator(adb, opts));

      case 8:
        udid = adb.curDeviceId;
        emPort = adb.emulatorPort;
        context$1$0.next = 63;
        break;

      case 12:
        // no avd given. lets try whatever's plugged in devices/emulators
        _logger2['default'].info("Retrieving device list");
        context$1$0.next = 15;
        return _regeneratorRuntime.awrap(adb.getDevicesWithRetry());

      case 15:
        devices = context$1$0.sent;

        if (!udid) {
          context$1$0.next = 21;
          break;
        }

        if (!_lodash2['default'].contains(_lodash2['default'].pluck(devices, 'udid'), udid)) {
          _logger2['default'].errorAndThrow('Device ' + udid + ' was not in the list ' + 'of connected devices');
        }
        emPort = adb.getPortFromEmulatorString(udid);
        context$1$0.next = 63;
        break;

      case 21:
        if (!opts.platformVersion) {
          context$1$0.next = 61;
          break;
        }

        // a platform version was given. lets try to find a device with the same os
        _logger2['default'].info('Looking for a device with Android \'' + opts.platformVersion + '\'');

        // in case we fail to find something, give the user a useful log that has
        // the device udids and os versions so they know what's available
        availDevicesStr = [];
        _iteratorNormalCompletion2 = true;
        _didIteratorError2 = false;
        _iteratorError2 = undefined;
        context$1$0.prev = 27;
        _iterator2 = _getIterator(devices);

      case 29:
        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
          context$1$0.next = 43;
          break;
        }

        device = _step2.value;
        context$1$0.next = 33;
        return _regeneratorRuntime.awrap(adb.setDeviceId(device.udid));

      case 33:
        context$1$0.next = 35;
        return _regeneratorRuntime.awrap(adb.getPlatformVersion());

      case 35:
        deviceOS = context$1$0.sent;

        // build up our info string of available devices as we iterate
        availDevicesStr.push(device.udid + ' (' + deviceOS + ')');

        // we do a begins with check for implied wildcard matching
        // eg: 4 matches 4.1, 4.0, 4.1.3-samsung, etc

        if (!(deviceOS.indexOf(opts.platformVersion) === 0)) {
          context$1$0.next = 40;
          break;
        }

        udid = device.udid;
        return context$1$0.abrupt('break', 43);

      case 40:
        _iteratorNormalCompletion2 = true;
        context$1$0.next = 29;
        break;

      case 43:
        context$1$0.next = 49;
        break;

      case 45:
        context$1$0.prev = 45;
        context$1$0.t0 = context$1$0['catch'](27);
        _didIteratorError2 = true;
        _iteratorError2 = context$1$0.t0;

      case 49:
        context$1$0.prev = 49;
        context$1$0.prev = 50;

        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }

      case 52:
        context$1$0.prev = 52;

        if (!_didIteratorError2) {
          context$1$0.next = 55;
          break;
        }

        throw _iteratorError2;

      case 55:
        return context$1$0.finish(52);

      case 56:
        return context$1$0.finish(49);

      case 57:

        // we couldn't find anything! quit
        if (!udid) {
          _logger2['default'].errorAndThrow('Unable to find an active device or emulator ' + ('with OS ' + opts.platformVersion + '. The following ') + 'are available: ' + availDevicesStr.join(', '));
        }

        emPort = adb.getPortFromEmulatorString(udid);
        context$1$0.next = 63;
        break;

      case 61:
        // a udid was not given, grab the first device we see
        udid = devices[0].udid;
        emPort = adb.getPortFromEmulatorString(udid);

      case 63:

        _logger2['default'].info('Using device: ' + udid);
        return context$1$0.abrupt('return', { udid: udid, emPort: emPort });

      case 65:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[27, 45, 49, 57], [50,, 52, 56]]);
};

// returns a new adb instance with deviceId set
helpers.createADB = function callee$0$0(javaVersion, udid, emPort, adbPort) {
  var adb;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumAdb2['default'].createADB({ javaVersion: javaVersion, adbPort: adbPort }));

      case 2:
        adb = context$1$0.sent;

        adb.setDeviceId(udid);
        if (emPort) {
          adb.setEmulatorPort(emPort);
        }

        return context$1$0.abrupt('return', adb);

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getLaunchInfo = function callee$0$0(adb, opts) {
  var app, appPackage, appActivity, appWaitPackage, appWaitActivity, _ref2, apkPackage, apkActivity;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        app = opts.app;
        appPackage = opts.appPackage;
        appActivity = opts.appActivity;
        appWaitPackage = opts.appWaitPackage;
        appWaitActivity = opts.appWaitActivity;

        if (app) {
          context$1$0.next = 8;
          break;
        }

        _logger2['default'].warn("No app sent in, not parsing package/activity");
        return context$1$0.abrupt('return');

      case 8:
        if (!(appPackage && appActivity)) {
          context$1$0.next = 10;
          break;
        }

        return context$1$0.abrupt('return');

      case 10:

        _logger2['default'].debug("Parsing package and activity from app manifest");
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(adb.packageAndLaunchActivityFromManifest(app));

      case 13:
        _ref2 = context$1$0.sent;
        apkPackage = _ref2.apkPackage;
        apkActivity = _ref2.apkActivity;

        if (apkPackage && !appPackage) {
          appPackage = apkPackage;
        }
        if (!appWaitPackage) {
          appWaitPackage = appPackage;
        }
        if (apkActivity && !appActivity) {
          appActivity = apkActivity;
        }
        if (!appWaitActivity) {
          appWaitActivity = appActivity;
        }
        _logger2['default'].debug('Parsed package and activity are: ' + apkPackage + '/' + apkActivity);
        return context$1$0.abrupt('return', { appPackage: appPackage, appWaitPackage: appWaitPackage, appActivity: appActivity, appWaitActivity: appWaitActivity });

      case 22:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getRemoteApkPath = function (localApkMd5) {
  var remotePath = REMOTE_TEMP_PATH + '/' + localApkMd5 + '.apk';
  _logger2['default'].info('Remote apk path is ' + remotePath);
  return remotePath;
};

helpers.resetApp = function callee$0$0(adb, localApkPath, pkg, fastReset) {
  var androidInstallTimeout = arguments.length <= 4 || arguments[4] === undefined ? REMOTE_INSTALL_TIMEOUT : arguments[4];
  var apkMd5, remotePath;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!fastReset) {
          context$1$0.next = 6;
          break;
        }

        _logger2['default'].debug("Running fast reset (stop and clear)");
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(adb.stopAndClear(pkg));

      case 4:
        context$1$0.next = 17;
        break;

      case 6:
        _logger2['default'].debug("Running old fashion reset (reinstall)");
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.md5(localApkPath));

      case 9:
        apkMd5 = context$1$0.sent;
        remotePath = helpers.getRemoteApkPath(apkMd5, localApkPath);
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(adb.fileExists(remotePath));

      case 13:
        if (context$1$0.sent) {
          context$1$0.next = 15;
          break;
        }

        throw new Error("Can't run slow reset without a remote apk!");

      case 15:
        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(helpers.reinstallRemoteApk(adb, localApkPath, pkg, remotePath, androidInstallTimeout));

      case 17:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.reinstallRemoteApk = function callee$0$0(adb, localApkPath, pkg, remotePath, androidInstallTimeout) {
  var tries = arguments.length <= 5 || arguments[5] === undefined ? 2 : arguments[5];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap((0, _asyncbox.retry)(tries, function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.prev = 0;
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(adb.uninstallApk(pkg));

              case 3:
                context$2$0.next = 8;
                break;

              case 5:
                context$2$0.prev = 5;
                context$2$0.t0 = context$2$0['catch'](0);

                _logger2['default'].warn("Uninstalling remote APK failed, maybe it wasn't installed");

              case 8:
                context$2$0.prev = 8;
                context$2$0.next = 11;
                return _regeneratorRuntime.awrap(adb.installFromDevicePath(remotePath, { timeout: androidInstallTimeout }));

              case 11:
                context$2$0.next = 21;
                break;

              case 13:
                context$2$0.prev = 13;
                context$2$0.t1 = context$2$0['catch'](8);

                _logger2['default'].warn("Installing remote APK failed, going to uninstall and try " + "again");
                // if remote install failed, remove ALL the apks and re-push ours
                // to the remote cache
                context$2$0.next = 18;
                return _regeneratorRuntime.awrap(helpers.removeRemoteApks(adb));

              case 18:
                context$2$0.next = 20;
                return _regeneratorRuntime.awrap(adb.push(localApkPath, remotePath));

              case 20:
                throw context$2$0.t1;

              case 21:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this, [[0, 5], [8, 13]]);
        }));

      case 2:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

// throw an error to trigger the retry
helpers.installApkRemotely = function callee$0$0(adb, opts) {
  var app, appPackage, fastReset, androidInstallTimeout, apkMd5, remotePath, remoteApkExists, installed;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        app = opts.app;
        appPackage = opts.appPackage;
        fastReset = opts.fastReset;
        androidInstallTimeout = opts.androidInstallTimeout;

        if (!(!app || !appPackage)) {
          context$1$0.next = 6;
          break;
        }

        throw new Error("'app' and 'appPackage' options are required");

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.md5(app));

      case 8:
        apkMd5 = context$1$0.sent;
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(helpers.getRemoteApkPath(apkMd5, app));

      case 11:
        remotePath = context$1$0.sent;
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(adb.fileExists(remotePath));

      case 14:
        remoteApkExists = context$1$0.sent;

        _logger2['default'].debug("Checking if app is installed");
        context$1$0.next = 18;
        return _regeneratorRuntime.awrap(adb.isAppInstalled(appPackage));

      case 18:
        installed = context$1$0.sent;

        if (!(installed && remoteApkExists && fastReset)) {
          context$1$0.next = 25;
          break;
        }

        _logger2['default'].info("Apk is already on remote and installed, resetting");
        context$1$0.next = 23;
        return _regeneratorRuntime.awrap(helpers.resetApp(adb, app, appPackage, fastReset, androidInstallTimeout));

      case 23:
        context$1$0.next = 39;
        break;

      case 25:
        if (!(!installed || !remoteApkExists && fastReset)) {
          context$1$0.next = 39;
          break;
        }

        if (!installed) {
          _logger2['default'].info("Apk is not yet installed");
        } else {
          _logger2['default'].info("Apk was already installed but not from our remote path");
        }
        _logger2['default'].info((installed ? 'Re' : '') + 'installing apk from remote');
        context$1$0.next = 30;
        return _regeneratorRuntime.awrap(adb.mkdir(REMOTE_TEMP_PATH));

      case 30:
        _logger2['default'].info("Clearing out any existing remote apks with the same hash");
        context$1$0.next = 33;
        return _regeneratorRuntime.awrap(helpers.removeRemoteApks(adb, [apkMd5]));

      case 33:
        if (remoteApkExists) {
          context$1$0.next = 37;
          break;
        }

        // push from local to remote
        _logger2['default'].info('Pushing ' + appPackage + ' to device. Will wait up to ' + androidInstallTimeout + ' ' + 'milliseconds before aborting');
        context$1$0.next = 37;
        return _regeneratorRuntime.awrap(adb.push(app, remotePath, { timeout: androidInstallTimeout }));

      case 37:
        context$1$0.next = 39;
        return _regeneratorRuntime.awrap(helpers.reinstallRemoteApk(adb, app, appPackage, remotePath, androidInstallTimeout));

      case 39:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.removeRemoteApks = function callee$0$0(adb) {
  var exceptMd5s = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  var apks, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, apk;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug("Removing any old apks");
        if (exceptMd5s) {
          _logger2['default'].debug('Except ' + JSON.stringify(exceptMd5s));
        } else {
          exceptMd5s = [];
        }
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(adb.ls(REMOTE_TEMP_PATH + '/*.apk'));

      case 4:
        apks = context$1$0.sent;

        if (!(apks.length < 1)) {
          context$1$0.next = 8;
          break;
        }

        _logger2['default'].debug("No apks to examine");
        return context$1$0.abrupt('return');

      case 8:
        apks = apks.filter(function (apk) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = _getIterator(exceptMd5s), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var md5 = _step3.value;

              return apk.indexOf(md5) === -1;
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                _iterator3['return']();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        });
        _iteratorNormalCompletion4 = true;
        _didIteratorError4 = false;
        _iteratorError4 = undefined;
        context$1$0.prev = 12;
        _iterator4 = _getIterator(apks);

      case 14:
        if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
          context$1$0.next = 22;
          break;
        }

        apk = _step4.value;

        _logger2['default'].info('Will remove ' + apk);
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(adb.shell(['rm', '-f', apk]));

      case 19:
        _iteratorNormalCompletion4 = true;
        context$1$0.next = 14;
        break;

      case 22:
        context$1$0.next = 28;
        break;

      case 24:
        context$1$0.prev = 24;
        context$1$0.t0 = context$1$0['catch'](12);
        _didIteratorError4 = true;
        _iteratorError4 = context$1$0.t0;

      case 28:
        context$1$0.prev = 28;
        context$1$0.prev = 29;

        if (!_iteratorNormalCompletion4 && _iterator4['return']) {
          _iterator4['return']();
        }

      case 31:
        context$1$0.prev = 31;

        if (!_didIteratorError4) {
          context$1$0.next = 34;
          break;
        }

        throw _iteratorError4;

      case 34:
        return context$1$0.finish(31);

      case 35:
        return context$1$0.finish(28);

      case 36:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[12, 24, 28, 36], [29,, 31, 35]]);
};

helpers.initUnicodeKeyboard = function callee$0$0(adb) {
  var defaultIME, appiumIME;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug('Enabling Unicode keyboard support');
        _logger2['default'].debug("Pushing unicode ime to device...");
        // await adb.install(unicodeIMEPath, false);

        // get the default IME so we can return back to it later if we want
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(adb.defaultIME());

      case 4:
        defaultIME = context$1$0.sent;

        _logger2['default'].debug('Unsetting previous IME ' + defaultIME);
        appiumIME = 'io.appium.android.ime/.UnicodeIME';

        _logger2['default'].debug('Setting IME to \'' + appiumIME + '\'');
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(adb.enableIME(appiumIME));

      case 10:
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(adb.setIME(appiumIME));

      case 12:
        return context$1$0.abrupt('return', defaultIME);

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.pushSettingsApp = function callee$0$0(adb) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug("do not install setting app");
        // await adb.install(settingsApkPath, false);

      case 1:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.pushUnlock = function callee$0$0(adb) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug("do not install unlock app");
        // await adb.install(unlockApkPath, false);

      case 1:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

// pushStrings method extracts string.xml and converts it to string.json and pushes
// it to /data/local/tmp/string.json on for use of bootstrap
// if app is not present to extract string.xml it deletes remote strings.json
// if app does not have strings.xml we push an empty json object to remote
helpers.pushStrings = function callee$0$0(language, adb, opts) {
  var remotePath, stringsJson, stringsTmpDir, _ref3, apkStrings, localPath, remoteFile;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        remotePath = '/data/local/tmp';
        stringsJson = 'strings.json';
        stringsTmpDir = _path2['default'].resolve(opts.tmpDir, opts.appPackage);
        context$1$0.prev = 3;

        _logger2['default'].debug('Extracting strings from apk', opts.app, language, stringsTmpDir);
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(adb.extractStringsFromApk(opts.app, language, stringsTmpDir));

      case 7:
        _ref3 = context$1$0.sent;
        apkStrings = _ref3.apkStrings;
        localPath = _ref3.localPath;
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(adb.push(localPath, remotePath));

      case 12:
        return context$1$0.abrupt('return', apkStrings);

      case 15:
        context$1$0.prev = 15;
        context$1$0.t0 = context$1$0['catch'](3);
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(opts.app));

      case 19:
        if (context$1$0.sent) {
          context$1$0.next = 24;
          break;
        }

        context$1$0.next = 22;
        return _regeneratorRuntime.awrap(adb.rimraf(remotePath + '/' + stringsJson));

      case 22:
        context$1$0.next = 28;
        break;

      case 24:
        _logger2['default'].warn("Could not get strings, continuing anyway");
        remoteFile = remotePath + '/' + stringsJson;
        context$1$0.next = 28;
        return _regeneratorRuntime.awrap(adb.shell('echo', ['\'{}\' > ' + remoteFile]));

      case 28:
        return context$1$0.abrupt('return', {});

      case 29:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[3, 15]]);
};

helpers.unlock = function callee$0$0(adb) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this3 = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(adb.isScreenLocked());

      case 2:
        if (context$1$0.sent) {
          context$1$0.next = 5;
          break;
        }

        _logger2['default'].info("Screen already unlocked, doing nothing");
        return context$1$0.abrupt('return');

      case 5:
        _logger2['default'].info("Unlocking screen");

        context$1$0.next = 8;
        return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(10, 1000, function callee$1$0() {
          var startOpts;
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            var _this2 = this;

            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                _logger2['default'].debug("Screen is locked, trying to unlock");

                // first manually stop the unlock activity
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(adb.forceStop('io.appium.unlock'));

              case 3:
                startOpts = {
                  pkg: "io.appium.unlock",
                  activity: ".Unlock",
                  action: "android.intent.action.MAIN",
                  category: "android.intent.category.LAUNCHER",
                  flags: "0x10200000",
                  stopApp: false
                };
                context$2$0.next = 6;
                return _regeneratorRuntime.awrap(adb.startApp(startOpts));

              case 6:
                context$2$0.next = 8;
                return _regeneratorRuntime.awrap(adb.startApp(startOpts));

              case 8:
                context$2$0.next = 10;
                return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(2, 1000, function callee$2$0() {
                  return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                      case 0:
                        context$3$0.next = 2;
                        return _regeneratorRuntime.awrap(adb.isScreenLocked());

                      case 2:
                        if (context$3$0.sent) {
                          context$3$0.next = 6;
                          break;
                        }

                        _logger2['default'].debug("Screen unlocked successfully");
                        context$3$0.next = 7;
                        break;

                      case 6:
                        throw new Error("Screen did not unlock successfully, retrying");

                      case 7:
                      case 'end':
                        return context$3$0.stop();
                    }
                  }, null, _this2);
                }));

              case 10:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this3);
        }));

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.initDevice = function callee$0$0(adb, opts) {
  var defaultIME;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(adb.waitForDevice());

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(helpers.ensureDeviceLocale(adb, opts.language, opts.locale));

      case 4:
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(adb.startLogcat());

      case 6:
        defaultIME = undefined;

        if (!opts.unicodeKeyboard) {
          context$1$0.next = 11;
          break;
        }

        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(helpers.initUnicodeKeyboard(adb));

      case 10:
        defaultIME = context$1$0.sent;

      case 11:
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(helpers.pushSettingsApp(adb));

      case 13:
        context$1$0.next = 15;
        return _regeneratorRuntime.awrap(helpers.pushUnlock(adb));

      case 15:
        return context$1$0.abrupt('return', defaultIME);

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.removeNullProperties = function (obj) {
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = _getIterator(_lodash2['default'].keys(obj)), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var key = _step5.value;

      if (_lodash2['default'].isNull(obj[key]) || _lodash2['default'].isUndefined(obj[key])) {
        delete obj[key];
      }
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5['return']) {
        _iterator5['return']();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }
};

helpers.truncateDecimals = function (number, digits) {
  var multiplier = Math.pow(10, digits),
      adjustedNum = number * multiplier,
      truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

  return truncatedNum / multiplier;
};

helpers.isChromeBrowser = function (browser) {
  return _lodash2['default'].contains(CHROME_BROWSERS, browser);
};

helpers.getChromePkg = function (browser) {
  var pkg = undefined,
      activity = undefined;

  browser = browser.toLowerCase();
  if (browser === "chromium") {
    pkg = "org.chromium.chrome.shell";
    activity = ".ChromeShellActivity";
  } else if (browser === "chromebeta") {
    pkg = "com.chrome.beta";
    activity = "com.google.android.apps.chrome.Main";
  } else if (browser === "browser") {
    pkg = "com.android.browser";
    activity = "com.android.browser.BrowserActivity";
  } else if (browser === "chromium-browser") {
    pkg = "org.chromium.chrome";
    activity = "com.google.android.apps.chrome.Main";
  } else {
    pkg = "com.android.chrome";
    activity = "com.google.android.apps.chrome.Main";
  }
  return { pkg: pkg, activity: activity };
};

helpers.bootstrap = _appiumAndroidBootstrap2['default'];

exports['default'] = helpers;
exports.CHROME_BROWSERS = CHROME_BROWSERS;
//API >= 23

// we can create a throwaway ADB instance here, so there is no dependency
// on instantiating on earlier (at this point, we have no udid)
// we can only use this ADB object for commands that would not be confused
// if multiple devices are connected

// a specific avd name was given. try to initialize with that

// udid was given, lets try to init with that device

// first try started devices/emulators

// direct adb calls to the specific device

// first do an uninstall of the package to make sure it's not there

// Next, install from the remote path. This can be flakey. If it doesn't
// work, clear out any cached apks, re-push from local, and try again

// delete remote string.json if present

// then start the app twice, as once is flakey

// check if it worked, twice
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9hbmRyb2lkLWhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3NCQUFjLFFBQVE7Ozs7b0JBQ0wsTUFBTTs7Ozs0QkFDRixjQUFjOzt3QkFDRSxVQUFVOztzQkFDNUIsVUFBVTs7Ozs2QkFDVixnQkFBZ0I7O2dDQUNJLG9CQUFvQjs7Z0NBQ25CLG9CQUFvQjs7NEJBQ3RCLGVBQWU7O3NDQUMvQiwwQkFBMEI7Ozs7eUJBQ2hDLFlBQVk7Ozs7QUFFNUIsSUFBTSxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQztBQUMzQyxJQUFNLHNCQUFzQixHQUFHLEtBQUssQ0FBQztBQUNyQyxJQUFNLGVBQWUsR0FBRyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFDN0MsUUFBUSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUM3QyxrQkFBa0IsQ0FBQyxDQUFDOztBQUU3QyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWpCLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLE1BQU0sRUFBRTtBQUMzQyxNQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7QUFDL0Isc0NBQWlCLEtBQUssNEdBQUU7VUFBZixJQUFJOztBQUNYLFVBQUksSUFBSSxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbkQsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7T0FDN0M7S0FDRjs7Ozs7Ozs7Ozs7Ozs7OztBQUNELFNBQU8sSUFBSSxDQUFDO0NBQ2IsQ0FBQzs7QUFFRixPQUFPLENBQUMsY0FBYyxHQUFHO1lBR2xCLE1BQU0sRUFDUCxPQUFPOzs7OztBQUhYLDRCQUFPLEtBQUssQ0FBQyxzQkFB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QUFPLEtBQUssWUFBWSxFQUFFO0FBQ25DLE9BQUcsR0FBRyxpQkFBaUIsQ0FBQztBQUN4QixZQUFRLEdBQUcscUNBQXFDLENBQUM7R0FDbEQsTUFBTSxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7QUFDaEMsT0FBRyxHQUFHLHFCQUFxQixDQUFDO0FBQzVCLFlBQVEsR0FBRyxxQ0FBcUMsQ0FBQztHQUNsRCxNQUFNLElBQUksT0FBTyxLQUFLLGtCQUFrQixFQUFFO0FBQ3pDLE9BQUcsR0FBRyxxQkFBcUIsQ0FBQztBQUM1QixZQUFRLEdBQUcscUNBQXFDLENBQUM7R0FDbEQsTUFBTTtBQUNMLE9BQUcsR0FBRyxvQkFBb0IsQ0FBQztBQUMzQixZQUFRLEdBQUcscUNBQXFDLENBQUM7R0FDbEQ7QUFDRCxTQUFPLEVBQUMsR0FBRyxFQUFILEdBQUcsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFDLENBQUM7Q0FDeEIsQ0FBQzs7QUFFRixPQUFPLENBQUMsU0FBUyxzQ0FBWSxDQUFDOztxQkFFZixPQUFPO1FBQ2IsZUFBZSxHQUFmLGVBQWUiLCJmaWxlIjoibGliL2FuZHJvaWQtaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICd0ZWVuX3Byb2Nlc3MnO1xuaW1wb3J0IHsgcmV0cnksIHJldHJ5SW50ZXJ2YWwgfSBmcm9tICdhc3luY2JveCc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7IGZzIH0gZnJvbSAnYXBwaXVtLXN1cHBvcnQnO1xuaW1wb3J0IHsgcGF0aCBhcyB1bmljb2RlSU1FUGF0aCB9IGZyb20gJ2FwcGl1bS1hbmRyb2lkLWltZSc7XG5pbXBvcnQgeyBwYXRoIGFzIHNldHRpbmdzQXBrUGF0aCB9IGZyb20gJ2lvLmFwcGl1bS5zZXR0aW5ncyc7XG5pbXBvcnQgeyBwYXRoIGFzIHVubG9ja0Fwa1BhdGggfSBmcm9tICdhcHBpdW0tdW5sb2NrJztcbmltcG9ydCBCb290c3RyYXAgZnJvbSAnYXBwaXVtLWFuZHJvaWQtYm9vdHN0cmFwJztcbmltcG9ydCBBREIgZnJvbSAnYXBwaXVtLWFkYic7XG5cbmNvbnN0IFJFTU9URV9URU1QX1BBVEggPSBcIi9kYXRhL2xvY2FsL3RtcFwiO1xuY29uc3QgUkVNT1RFX0lOU1RBTExfVElNRU9VVCA9IDkwMDAwOyAvLyBtaWxsaXNlY29uZHNcbmNvbnN0IENIUk9NRV9CUk9XU0VSUyA9IFtcIkNocm9tZVwiLCBcIkNocm9taXVtXCIsIFwiQ2hyb21lYmV0YVwiLCBcIkJyb3dzZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICBcImNocm9tZVwiLCBcImNocm9taXVtXCIsIFwiY2hyb21lYmV0YVwiLCBcImJyb3dzZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICBcImNocm9taXVtLWJyb3dzZXJcIl07XG5cbmxldCBoZWxwZXJzID0ge307XG5cbmhlbHBlcnMucGFyc2VKYXZhVmVyc2lvbiA9IGZ1bmN0aW9uIChzdGRlcnIpIHtcbiAgbGV0IGxpbmVzID0gc3RkZXJyLnNwbGl0KFwiXFxuXCIpO1xuICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoLyhqYXZhfG9wZW5qZGspIHZlcnNpb24vKS50ZXN0KGxpbmUpKSB7XG4gICAgICByZXR1cm4gbGluZS5zcGxpdChcIiBcIilbMl0ucmVwbGFjZSgvXCIvZywgJycpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmhlbHBlcnMuZ2V0SmF2YVZlcnNpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGxvZ2dlci5kZWJ1ZyhcIkdldHRpbmcgSmF2YSB2ZXJzaW9uXCIpO1xuXG4gIGxldCB7c3RkZXJyfSA9IGF3YWl0IGV4ZWMoJ2phdmEnLCBbJy12ZXJzaW9uJ10pO1xuICBsZXQgamF2YVZlciA9IGhlbHBlcnMucGFyc2VKYXZhVmVyc2lvbihzdGRlcnIpO1xuICBpZiAoamF2YVZlciA9PT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBnZXQgdGhlIEphdmEgdmVyc2lvbi4gSXMgSmF2YSBpbnN0YWxsZWQ/XCIpO1xuICB9XG4gIGxvZ2dlci5pbmZvKGBKYXZhIHZlcnNpb24gaXM6ICR7amF2YVZlcn1gKTtcbiAgcmV0dXJuIGphdmFWZXI7XG59O1xuXG5oZWxwZXJzLnByZXBhcmVFbXVsYXRvciA9IGFzeW5jIGZ1bmN0aW9uIChhZGIsIG9wdHMpIHtcbiAgbGV0IHthdmQsIGF2ZEFyZ3MsIGxhbmd1YWdlLCBsb2NhbGUsIGF2ZExhdW5jaFRpbWVvdXQsXG4gICAgICAgYXZkUmVhZHlUaW1lb3V0fSA9IG9wdHM7XG4gIGlmICghYXZkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGxhdW5jaCBBVkQgd2l0aG91dCBBVkQgbmFtZVwiKTtcbiAgfVxuICBsZXQgYXZkTmFtZSA9IGF2ZC5yZXBsYWNlKCdAJywgJycpO1xuICBsZXQgcnVubmluZ0FWRCA9IGF3YWl0IGFkYi5nZXRSdW5uaW5nQVZEKGF2ZE5hbWUpO1xuICBpZiAocnVubmluZ0FWRCAhPT0gbnVsbCkge1xuICAgIGlmIChhdmRBcmdzICYmIGF2ZEFyZ3MudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiLXdpcGUtZGF0YVwiKSA+IC0xKSB7XG4gICAgICBsb2dnZXIuZGVidWcoYEtpbGxpbmcgJyR7YXZkTmFtZX0nIGJlY2F1c2UgaXQgbmVlZHMgdG8gYmUgd2lwZWQgYXQgc3RhcnQuYCk7XG4gICAgICBhd2FpdCBhZGIua2lsbEVtdWxhdG9yKGF2ZE5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2dnZXIuZGVidWcoXCJOb3QgbGF1bmNoaW5nIEFWRCBiZWNhdXNlIGl0IGlzIGFscmVhZHkgcnVubmluZy5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIGF3YWl0IGFkYi5sYXVuY2hBVkQoYXZkLCBhdmRBcmdzLCBsYW5ndWFnZSwgbG9jYWxlLCBhdmRMYXVuY2hUaW1lb3V0LFxuICAgICAgICAgICAgICAgICAgICAgIGF2ZFJlYWR5VGltZW91dCk7XG59O1xuXG5oZWxwZXJzLmVuc3VyZURldmljZUxvY2FsZSA9IGFzeW5jIGZ1bmN0aW9uIChhZGIsIGxhbmd1YWdlLCBjb3VudHJ5KSB7XG4gIGxldCBoYXZlTGFuZ3VhZ2UgPSBsYW5ndWFnZSAmJiB0eXBlb2YgbGFuZ3VhZ2UgPT09IFwic3RyaW5nXCI7XG4gIGxldCBoYXZlQ291bnRyeSA9IGNvdW50cnkgJiYgdHlwZW9mIGNvdW50cnkgPT09IFwic3RyaW5nXCI7XG4gIGlmICghaGF2ZUxhbmd1YWdlICYmICFoYXZlQ291bnRyeSkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICBpZiAoYXdhaXQgYWRiLmdldEFwaUxldmVsKCkgPCAyMykge1xuICAgIGxldCBjdXJMYW5ndWFnZSA9IGF3YWl0IGFkYi5nZXREZXZpY2VMYW5ndWFnZSgpO1xuICAgIGxldCBjdXJDb3VudHJ5ID0gYXdhaXQgYWRiLmdldERldmljZUNvdW50cnkoKTtcbiAgICBpZiAoaGF2ZUxhbmd1YWdlICYmIGxhbmd1YWdlICE9PSBjdXJMYW5ndWFnZSkge1xuICAgICAgYXdhaXQgYWRiLnNldERldmljZUxhbmd1YWdlKGxhbmd1YWdlKTtcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoaGF2ZUNvdW50cnkgJiYgY291bnRyeSAhPT0gY3VyQ291bnRyeSkge1xuICAgICAgYXdhaXQgYWRiLnNldERldmljZUNvdW50cnkoY291bnRyeSk7XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSB7IC8vQVBJID49IDIzXG4gICAgbGV0IGN1ckxvY2FsZSA9IGF3YWl0IGFkYi5nZXREZXZpY2VMb2NhbGUoKTtcbiAgICBsZXQgbG9jYWxlO1xuICAgIGlmICghaGF2ZUNvdW50cnkpIHtcbiAgICAgIGxvY2FsZSA9IGxhbmd1YWdlLnRvTG93ZXJDYXNlKCk7XG4gICAgfSBlbHNlIGlmICghaGF2ZUxhbmd1YWdlKSB7XG4gICAgICBsb2NhbGUgPSBjb3VudHJ5O1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2NhbGUgPSBsYW5ndWFnZS50b0xvd2VyQ2FzZSgpICsgXCItXCIgKyBjb3VudHJ5LnRvVXBwZXJDYXNlKCk7XG4gICAgfVxuICAgIGlmIChsb2NhbGUgIT09IGN1ckxvY2FsZSkge1xuICAgICAgYXdhaXQgYWRiLnNldERldmljZUxvY2FsZShsb2NhbGUpO1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIGlmIChjaGFuZ2VkKSB7XG4gICAgYXdhaXQgYWRiLnJlYm9vdCgpO1xuICB9XG59O1xuXG5oZWxwZXJzLmdldERldmljZUluZm9Gcm9tQ2FwcyA9IGFzeW5jIGZ1bmN0aW9uIChvcHRzID0ge30pIHtcbiAgLy8gd2UgY2FuIGNyZWF0ZSBhIHRocm93YXdheSBBREIgaW5zdGFuY2UgaGVyZSwgc28gdGhlcmUgaXMgbm8gZGVwZW5kZW5jeVxuICAvLyBvbiBpbnN0YW50aWF0aW5nIG9uIGVhcmxpZXIgKGF0IHRoaXMgcG9pbnQsIHdlIGhhdmUgbm8gdWRpZClcbiAgLy8gd2UgY2FuIG9ubHkgdXNlIHRoaXMgQURCIG9iamVjdCBmb3IgY29tbWFuZHMgdGhhdCB3b3VsZCBub3QgYmUgY29uZnVzZWRcbiAgLy8gaWYgbXVsdGlwbGUgZGV2aWNlcyBhcmUgY29ubmVjdGVkXG4gIGxldCBhZGIgPSBhd2FpdCBBREIuY3JlYXRlQURCKHtcbiAgICBqYXZhVmVyc2lvbjogb3B0cy5qYXZhVmVyc2lvbixcbiAgICBhZGJQb3J0OiBvcHRzLmFkYlBvcnRcbiAgfSk7XG4gIGxldCB1ZGlkID0gb3B0cy51ZGlkO1xuICBsZXQgZW1Qb3J0ID0gbnVsbDtcblxuICAvLyBhIHNwZWNpZmljIGF2ZCBuYW1lIHdhcyBnaXZlbi4gdHJ5IHRvIGluaXRpYWxpemUgd2l0aCB0aGF0XG4gIGlmIChvcHRzLmF2ZCkge1xuICAgIGF3YWl0IGhlbHBlcnMucHJlcGFyZUVtdWxhdG9yKGFkYiwgb3B0cyk7XG4gICAgdWRpZCA9IGFkYi5jdXJEZXZpY2VJZDtcbiAgICBlbVBvcnQgPSBhZGIuZW11bGF0b3JQb3J0O1xuICB9IGVsc2Uge1xuICAgIC8vIG5vIGF2ZCBnaXZlbi4gbGV0cyB0cnkgd2hhdGV2ZXIncyBwbHVnZ2VkIGluIGRldmljZXMvZW11bGF0b3JzXG4gICAgbG9nZ2VyLmluZm8oXCJSZXRyaWV2aW5nIGRldmljZSBsaXN0XCIpO1xuICAgIGxldCBkZXZpY2VzID0gYXdhaXQgYWRiLmdldERldmljZXNXaXRoUmV0cnkoKTtcblxuICAgIC8vIHVkaWQgd2FzIGdpdmVuLCBsZXRzIHRyeSB0byBpbml0IHdpdGggdGhhdCBkZXZpY2VcbiAgICBpZiAodWRpZCkge1xuICAgICAgaWYgKCFfLmNvbnRhaW5zKF8ucGx1Y2soZGV2aWNlcywgJ3VkaWQnKSwgdWRpZCkpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yQW5kVGhyb3coYERldmljZSAke3VkaWR9IHdhcyBub3QgaW4gdGhlIGxpc3QgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBvZiBjb25uZWN0ZWQgZGV2aWNlc2ApO1xuICAgICAgfVxuICAgICAgZW1Qb3J0ID0gYWRiLmdldFBvcnRGcm9tRW11bGF0b3JTdHJpbmcodWRpZCk7XG4gICAgfSBlbHNlIGlmIChvcHRzLnBsYXRmb3JtVmVyc2lvbikge1xuICAgICAgLy8gYSBwbGF0Zm9ybSB2ZXJzaW9uIHdhcyBnaXZlbi4gbGV0cyB0cnkgdG8gZmluZCBhIGRldmljZSB3aXRoIHRoZSBzYW1lIG9zXG4gICAgICBsb2dnZXIuaW5mbyhgTG9va2luZyBmb3IgYSBkZXZpY2Ugd2l0aCBBbmRyb2lkICcke29wdHMucGxhdGZvcm1WZXJzaW9ufSdgKTtcblxuICAgICAgLy8gaW4gY2FzZSB3ZSBmYWlsIHRvIGZpbmQgc29tZXRoaW5nLCBnaXZlIHRoZSB1c2VyIGEgdXNlZnVsIGxvZyB0aGF0IGhhc1xuICAgICAgLy8gdGhlIGRldmljZSB1ZGlkcyBhbmQgb3MgdmVyc2lvbnMgc28gdGhleSBrbm93IHdoYXQncyBhdmFpbGFibGVcbiAgICAgIGxldCBhdmFpbERldmljZXNTdHIgPSBbXTtcblxuICAgICAgLy8gZmlyc3QgdHJ5IHN0YXJ0ZWQgZGV2aWNlcy9lbXVsYXRvcnNcbiAgICAgIGZvciAobGV0IGRldmljZSBvZiBkZXZpY2VzKSB7XG4gICAgICAgIC8vIGRpcmVjdCBhZGIgY2FsbHMgdG8gdGhlIHNwZWNpZmljIGRldmljZVxuICAgICAgICBhd2FpdCBhZGIuc2V0RGV2aWNlSWQoZGV2aWNlLnVkaWQpO1xuICAgICAgICBsZXQgZGV2aWNlT1MgPSBhd2FpdCBhZGIuZ2V0UGxhdGZvcm1WZXJzaW9uKCk7XG5cbiAgICAgICAgLy8gYnVpbGQgdXAgb3VyIGluZm8gc3RyaW5nIG9mIGF2YWlsYWJsZSBkZXZpY2VzIGFzIHdlIGl0ZXJhdGVcbiAgICAgICAgYXZhaWxEZXZpY2VzU3RyLnB1c2goYCR7ZGV2aWNlLnVkaWR9ICgke2RldmljZU9TfSlgKTtcblxuICAgICAgICAvLyB3ZSBkbyBhIGJlZ2lucyB3aXRoIGNoZWNrIGZvciBpbXBsaWVkIHdpbGRjYXJkIG1hdGNoaW5nXG4gICAgICAgIC8vIGVnOiA0IG1hdGNoZXMgNC4xLCA0LjAsIDQuMS4zLXNhbXN1bmcsIGV0Y1xuICAgICAgICBpZiAoZGV2aWNlT1MuaW5kZXhPZihvcHRzLnBsYXRmb3JtVmVyc2lvbikgPT09IDApIHtcbiAgICAgICAgICB1ZGlkID0gZGV2aWNlLnVkaWQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gd2UgY291bGRuJ3QgZmluZCBhbnl0aGluZyEgcXVpdFxuICAgICAgaWYgKCF1ZGlkKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvckFuZFRocm93KGBVbmFibGUgdG8gZmluZCBhbiBhY3RpdmUgZGV2aWNlIG9yIGVtdWxhdG9yIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgd2l0aCBPUyAke29wdHMucGxhdGZvcm1WZXJzaW9ufS4gVGhlIGZvbGxvd2luZyBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGFyZSBhdmFpbGFibGU6IGAgKyBhdmFpbERldmljZXNTdHIuam9pbignLCAnKSk7XG4gICAgICB9XG5cbiAgICAgIGVtUG9ydCA9IGFkYi5nZXRQb3J0RnJvbUVtdWxhdG9yU3RyaW5nKHVkaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhIHVkaWQgd2FzIG5vdCBnaXZlbiwgZ3JhYiB0aGUgZmlyc3QgZGV2aWNlIHdlIHNlZVxuICAgICAgdWRpZCA9IGRldmljZXNbMF0udWRpZDtcbiAgICAgIGVtUG9ydCA9IGFkYi5nZXRQb3J0RnJvbUVtdWxhdG9yU3RyaW5nKHVkaWQpO1xuICAgIH1cbiAgfVxuXG4gIGxvZ2dlci5pbmZvKGBVc2luZyBkZXZpY2U6ICR7dWRpZH1gKTtcbiAgcmV0dXJuIHt1ZGlkLCBlbVBvcnR9O1xufTtcblxuLy8gcmV0dXJucyBhIG5ldyBhZGIgaW5zdGFuY2Ugd2l0aCBkZXZpY2VJZCBzZXRcbmhlbHBlcnMuY3JlYXRlQURCID0gYXN5bmMgZnVuY3Rpb24gKGphdmFWZXJzaW9uLCB1ZGlkLCBlbVBvcnQsIGFkYlBvcnQpIHtcbiAgbGV0IGFkYiA9IGF3YWl0IEFEQi5jcmVhdGVBREIoe2phdmFWZXJzaW9uLCBhZGJQb3J0fSk7XG5cbiAgYWRiLnNldERldmljZUlkKHVkaWQpO1xuICBpZiAoZW1Qb3J0KSB7XG4gICAgYWRiLnNldEVtdWxhdG9yUG9ydChlbVBvcnQpO1xuICB9XG5cbiAgcmV0dXJuIGFkYjtcbn07XG5cbmhlbHBlcnMuZ2V0TGF1bmNoSW5mbyA9IGFzeW5jIGZ1bmN0aW9uIChhZGIsIG9wdHMpIHtcbiAgbGV0IHthcHAsIGFwcFBhY2thZ2UsIGFwcEFjdGl2aXR5LCBhcHBXYWl0UGFja2FnZSwgYXBwV2FpdEFjdGl2aXR5fSA9IG9wdHM7XG4gIGlmICghYXBwKSB7XG4gICAgbG9nZ2VyLndhcm4oXCJObyBhcHAgc2VudCBpbiwgbm90IHBhcnNpbmcgcGFja2FnZS9hY3Rpdml0eVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGFwcFBhY2thZ2UgJiYgYXBwQWN0aXZpdHkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsb2dnZXIuZGVidWcoXCJQYXJzaW5nIHBhY2thZ2UgYW5kIGFjdGl2aXR5IGZyb20gYXBwIG1hbmlmZXN0XCIpO1xuICBsZXQge2Fwa1BhY2thZ2UsIGFwa0FjdGl2aXR5fSA9XG4gICAgYXdhaXQgYWRiLnBhY2thZ2VBbmRMYXVuY2hBY3Rpdml0eUZyb21NYW5pZmVzdChhcHApO1xuICBpZiAoYXBrUGFja2FnZSAmJiAhYXBwUGFja2FnZSkge1xuICAgIGFwcFBhY2thZ2UgPSBhcGtQYWNrYWdlO1xuICB9XG4gIGlmICghYXBwV2FpdFBhY2thZ2UpIHtcbiAgICBhcHBXYWl0UGFja2FnZSA9IGFwcFBhY2thZ2U7XG4gIH1cbiAgaWYgKGFwa0FjdGl2aXR5ICYmICFhcHBBY3Rpdml0eSkge1xuICAgIGFwcEFjdGl2aXR5ID0gYXBrQWN0aXZpdHk7XG4gIH1cbiAgaWYgKCFhcHBXYWl0QWN0aXZpdHkpIHtcbiAgICBhcHBXYWl0QWN0aXZpdHkgPSBhcHBBY3Rpdml0eTtcbiAgfVxuICBsb2dnZXIuZGVidWcoYFBhcnNlZCBwYWNrYWdlIGFuZCBhY3Rpdml0eSBhcmU6ICR7YXBrUGFja2FnZX0vJHthcGtBY3Rpdml0eX1gKTtcbiAgcmV0dXJuIHthcHBQYWNrYWdlLCBhcHBXYWl0UGFja2FnZSwgYXBwQWN0aXZpdHksIGFwcFdhaXRBY3Rpdml0eX07XG59O1xuXG5oZWxwZXJzLmdldFJlbW90ZUFwa1BhdGggPSBmdW5jdGlvbiAobG9jYWxBcGtNZDUpIHtcbiAgbGV0IHJlbW90ZVBhdGggPSBgJHtSRU1PVEVfVEVNUF9QQVRIfS8ke2xvY2FsQXBrTWQ1fS5hcGtgO1xuICBsb2dnZXIuaW5mbyhgUmVtb3RlIGFwayBwYXRoIGlzICR7cmVtb3RlUGF0aH1gKTtcbiAgcmV0dXJuIHJlbW90ZVBhdGg7XG59O1xuXG5oZWxwZXJzLnJlc2V0QXBwID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgbG9jYWxBcGtQYXRoLCBwa2csIGZhc3RSZXNldCwgYW5kcm9pZEluc3RhbGxUaW1lb3V0ID0gUkVNT1RFX0lOU1RBTExfVElNRU9VVCkge1xuICBpZiAoZmFzdFJlc2V0KSB7XG4gICAgbG9nZ2VyLmRlYnVnKFwiUnVubmluZyBmYXN0IHJlc2V0IChzdG9wIGFuZCBjbGVhcilcIik7XG4gICAgYXdhaXQgYWRiLnN0b3BBbmRDbGVhcihwa2cpO1xuICB9IGVsc2Uge1xuICAgIGxvZ2dlci5kZWJ1ZyhcIlJ1bm5pbmcgb2xkIGZhc2hpb24gcmVzZXQgKHJlaW5zdGFsbClcIik7XG4gICAgbGV0IGFwa01kNSA9IGF3YWl0IGZzLm1kNShsb2NhbEFwa1BhdGgpO1xuICAgIGxldCByZW1vdGVQYXRoID0gaGVscGVycy5nZXRSZW1vdGVBcGtQYXRoKGFwa01kNSwgbG9jYWxBcGtQYXRoKTtcbiAgICBpZiAoIWF3YWl0IGFkYi5maWxlRXhpc3RzKHJlbW90ZVBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBydW4gc2xvdyByZXNldCB3aXRob3V0IGEgcmVtb3RlIGFwayFcIik7XG4gICAgfVxuICAgIGF3YWl0IGhlbHBlcnMucmVpbnN0YWxsUmVtb3RlQXBrKGFkYiwgbG9jYWxBcGtQYXRoLCBwa2csIHJlbW90ZVBhdGgsIGFuZHJvaWRJbnN0YWxsVGltZW91dCk7XG4gIH1cbn07XG5cbmhlbHBlcnMucmVpbnN0YWxsUmVtb3RlQXBrID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgbG9jYWxBcGtQYXRoLCBwa2csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdGVQYXRoLCBhbmRyb2lkSW5zdGFsbFRpbWVvdXQsIHRyaWVzID0gMikge1xuICBhd2FpdCByZXRyeSh0cmllcywgYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBmaXJzdCBkbyBhbiB1bmluc3RhbGwgb2YgdGhlIHBhY2thZ2UgdG8gbWFrZSBzdXJlIGl0J3Mgbm90IHRoZXJlXG4gICAgICBhd2FpdCBhZGIudW5pbnN0YWxsQXBrKHBrZyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLndhcm4oXCJVbmluc3RhbGxpbmcgcmVtb3RlIEFQSyBmYWlsZWQsIG1heWJlIGl0IHdhc24ndCBpbnN0YWxsZWRcIik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBhZGIuaW5zdGFsbEZyb21EZXZpY2VQYXRoKHJlbW90ZVBhdGgsIHt0aW1lb3V0OiBhbmRyb2lkSW5zdGFsbFRpbWVvdXR9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2dnZXIud2FybihcIkluc3RhbGxpbmcgcmVtb3RlIEFQSyBmYWlsZWQsIGdvaW5nIHRvIHVuaW5zdGFsbCBhbmQgdHJ5IFwiICtcbiAgICAgICAgICAgICAgICAgIFwiYWdhaW5cIik7XG4gICAgICAvLyBpZiByZW1vdGUgaW5zdGFsbCBmYWlsZWQsIHJlbW92ZSBBTEwgdGhlIGFwa3MgYW5kIHJlLXB1c2ggb3Vyc1xuICAgICAgLy8gdG8gdGhlIHJlbW90ZSBjYWNoZVxuICAgICAgYXdhaXQgaGVscGVycy5yZW1vdmVSZW1vdGVBcGtzKGFkYik7XG4gICAgICBhd2FpdCBhZGIucHVzaChsb2NhbEFwa1BhdGgsIHJlbW90ZVBhdGgpO1xuICAgICAgdGhyb3cgZTsgLy8gdGhyb3cgYW4gZXJyb3IgdG8gdHJpZ2dlciB0aGUgcmV0cnlcbiAgICB9XG4gIH0pO1xufTtcblxuaGVscGVycy5pbnN0YWxsQXBrUmVtb3RlbHkgPSBhc3luYyBmdW5jdGlvbiAoYWRiLCBvcHRzKSB7XG4gIGxldCB7YXBwLCBhcHBQYWNrYWdlLCBmYXN0UmVzZXQsIGFuZHJvaWRJbnN0YWxsVGltZW91dH0gPSBvcHRzO1xuXG4gIGlmICghYXBwIHx8ICFhcHBQYWNrYWdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiJ2FwcCcgYW5kICdhcHBQYWNrYWdlJyBvcHRpb25zIGFyZSByZXF1aXJlZFwiKTtcbiAgfVxuXG4gIGxldCBhcGtNZDUgPSBhd2FpdCBmcy5tZDUoYXBwKTtcbiAgbGV0IHJlbW90ZVBhdGggPSBhd2FpdCBoZWxwZXJzLmdldFJlbW90ZUFwa1BhdGgoYXBrTWQ1LCBhcHApO1xuICBsZXQgcmVtb3RlQXBrRXhpc3RzID0gYXdhaXQgYWRiLmZpbGVFeGlzdHMocmVtb3RlUGF0aCk7XG4gIGxvZ2dlci5kZWJ1ZyhcIkNoZWNraW5nIGlmIGFwcCBpcyBpbnN0YWxsZWRcIik7XG4gIGxldCBpbnN0YWxsZWQgPSBhd2FpdCBhZGIuaXNBcHBJbnN0YWxsZWQoYXBwUGFja2FnZSk7XG5cbiAgaWYgKGluc3RhbGxlZCAmJiByZW1vdGVBcGtFeGlzdHMgJiYgZmFzdFJlc2V0KSB7XG4gICAgbG9nZ2VyLmluZm8oXCJBcGsgaXMgYWxyZWFkeSBvbiByZW1vdGUgYW5kIGluc3RhbGxlZCwgcmVzZXR0aW5nXCIpO1xuICAgIGF3YWl0IGhlbHBlcnMucmVzZXRBcHAoYWRiLCBhcHAsIGFwcFBhY2thZ2UsIGZhc3RSZXNldCwgYW5kcm9pZEluc3RhbGxUaW1lb3V0KTtcbiAgfSBlbHNlIGlmICghaW5zdGFsbGVkIHx8ICghcmVtb3RlQXBrRXhpc3RzICYmIGZhc3RSZXNldCkpIHtcbiAgICBpZiAoIWluc3RhbGxlZCkge1xuICAgICAgbG9nZ2VyLmluZm8oXCJBcGsgaXMgbm90IHlldCBpbnN0YWxsZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ2dlci5pbmZvKFwiQXBrIHdhcyBhbHJlYWR5IGluc3RhbGxlZCBidXQgbm90IGZyb20gb3VyIHJlbW90ZSBwYXRoXCIpO1xuICAgIH1cbiAgICBsb2dnZXIuaW5mbyhgJHtpbnN0YWxsZWQgPyAnUmUnIDogJyd9aW5zdGFsbGluZyBhcGsgZnJvbSByZW1vdGVgKTtcbiAgICBhd2FpdCBhZGIubWtkaXIoUkVNT1RFX1RFTVBfUEFUSCk7XG4gICAgbG9nZ2VyLmluZm8oXCJDbGVhcmluZyBvdXQgYW55IGV4aXN0aW5nIHJlbW90ZSBhcGtzIHdpdGggdGhlIHNhbWUgaGFzaFwiKTtcbiAgICBhd2FpdCBoZWxwZXJzLnJlbW92ZVJlbW90ZUFwa3MoYWRiLCBbYXBrTWQ1XSk7XG4gICAgaWYgKCFyZW1vdGVBcGtFeGlzdHMpIHtcbiAgICAgIC8vIHB1c2ggZnJvbSBsb2NhbCB0byByZW1vdGVcbiAgICAgIGxvZ2dlci5pbmZvKGBQdXNoaW5nICR7YXBwUGFja2FnZX0gdG8gZGV2aWNlLiBXaWxsIHdhaXQgdXAgdG8gJHthbmRyb2lkSW5zdGFsbFRpbWVvdXR9IGAgK1xuICAgICAgICAgICAgICAgICAgYG1pbGxpc2Vjb25kcyBiZWZvcmUgYWJvcnRpbmdgKTtcbiAgICAgIGF3YWl0IGFkYi5wdXNoKGFwcCwgcmVtb3RlUGF0aCwge3RpbWVvdXQ6IGFuZHJvaWRJbnN0YWxsVGltZW91dH0pO1xuICAgIH1cblxuICAgIC8vIE5leHQsIGluc3RhbGwgZnJvbSB0aGUgcmVtb3RlIHBhdGguIFRoaXMgY2FuIGJlIGZsYWtleS4gSWYgaXQgZG9lc24ndFxuICAgIC8vIHdvcmssIGNsZWFyIG91dCBhbnkgY2FjaGVkIGFwa3MsIHJlLXB1c2ggZnJvbSBsb2NhbCwgYW5kIHRyeSBhZ2FpblxuICAgIGF3YWl0IGhlbHBlcnMucmVpbnN0YWxsUmVtb3RlQXBrKGFkYiwgYXBwLCBhcHBQYWNrYWdlLCByZW1vdGVQYXRoLCBhbmRyb2lkSW5zdGFsbFRpbWVvdXQpO1xuICB9XG59O1xuXG5oZWxwZXJzLnJlbW92ZVJlbW90ZUFwa3MgPSBhc3luYyBmdW5jdGlvbiAoYWRiLCBleGNlcHRNZDVzID0gbnVsbCkge1xuICBsb2dnZXIuZGVidWcoXCJSZW1vdmluZyBhbnkgb2xkIGFwa3NcIik7XG4gIGlmIChleGNlcHRNZDVzKSB7XG4gICAgbG9nZ2VyLmRlYnVnKGBFeGNlcHQgJHtKU09OLnN0cmluZ2lmeShleGNlcHRNZDVzKX1gKTtcbiAgfSBlbHNlIHtcbiAgICBleGNlcHRNZDVzID0gW107XG4gIH1cbiAgbGV0IGFwa3MgPSBhd2FpdCBhZGIubHMoYCR7UkVNT1RFX1RFTVBfUEFUSH0vKi5hcGtgKTtcbiAgaWYgKGFwa3MubGVuZ3RoIDwgMSkge1xuICAgIGxvZ2dlci5kZWJ1ZyhcIk5vIGFwa3MgdG8gZXhhbWluZVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgYXBrcyA9IGFwa3MuZmlsdGVyKChhcGspID0+IHtcbiAgICBmb3IgKGxldCBtZDUgb2YgZXhjZXB0TWQ1cykge1xuICAgICAgcmV0dXJuIGFway5pbmRleE9mKG1kNSkgPT09IC0xO1xuICAgIH1cbiAgfSk7XG4gIGZvciAobGV0IGFwayBvZiBhcGtzKSB7XG4gICAgbG9nZ2VyLmluZm8oYFdpbGwgcmVtb3ZlICR7YXBrfWApO1xuICAgIGF3YWl0IGFkYi5zaGVsbChbJ3JtJywgJy1mJywgYXBrXSk7XG4gIH1cbn07XG5cbmhlbHBlcnMuaW5pdFVuaWNvZGVLZXlib2FyZCA9IGFzeW5jIGZ1bmN0aW9uIChhZGIpIHtcbiAgbG9nZ2VyLmRlYnVnKCdFbmFibGluZyBVbmljb2RlIGtleWJvYXJkIHN1cHBvcnQnKTtcbiAgbG9nZ2VyLmRlYnVnKFwiUHVzaGluZyB1bmljb2RlIGltZSB0byBkZXZpY2UuLi5cIik7XG4gIC8vIGF3YWl0IGFkYi5pbnN0YWxsKHVuaWNvZGVJTUVQYXRoLCBmYWxzZSk7XG5cbiAgLy8gZ2V0IHRoZSBkZWZhdWx0IElNRSBzbyB3ZSBjYW4gcmV0dXJuIGJhY2sgdG8gaXQgbGF0ZXIgaWYgd2Ugd2FudFxuICBsZXQgZGVmYXVsdElNRSA9IGF3YWl0IGFkYi5kZWZhdWx0SU1FKCk7XG5cbiAgbG9nZ2VyLmRlYnVnKGBVbnNldHRpbmcgcHJldmlvdXMgSU1FICR7ZGVmYXVsdElNRX1gKTtcbiAgY29uc3QgYXBwaXVtSU1FID0gJ2lvLmFwcGl1bS5hbmRyb2lkLmltZS8uVW5pY29kZUlNRSc7XG4gIGxvZ2dlci5kZWJ1ZyhgU2V0dGluZyBJTUUgdG8gJyR7YXBwaXVtSU1FfSdgKTtcbiAgYXdhaXQgYWRiLmVuYWJsZUlNRShhcHBpdW1JTUUpO1xuICBhd2FpdCBhZGIuc2V0SU1FKGFwcGl1bUlNRSk7XG4gIHJldHVybiBkZWZhdWx0SU1FO1xufTtcblxuaGVscGVycy5wdXNoU2V0dGluZ3NBcHAgPSBhc3luYyBmdW5jdGlvbiAoYWRiKSB7XG4gIGxvZ2dlci5kZWJ1ZyhcImRvIG5vdCBpbnN0YWxsIHNldHRpbmcgYXBwXCIpO1xuICAvLyBhd2FpdCBhZGIuaW5zdGFsbChzZXR0aW5nc0Fwa1BhdGgsIGZhbHNlKTtcbn07XG5cbmhlbHBlcnMucHVzaFVubG9jayA9IGFzeW5jIGZ1bmN0aW9uIChhZGIpIHtcbiAgbG9nZ2VyLmRlYnVnKFwiZG8gbm90IGluc3RhbGwgdW5sb2NrIGFwcFwiKTtcbiAgLy8gYXdhaXQgYWRiLmluc3RhbGwodW5sb2NrQXBrUGF0aCwgZmFsc2UpO1xufTtcblxuLy8gcHVzaFN0cmluZ3MgbWV0aG9kIGV4dHJhY3RzIHN0cmluZy54bWwgYW5kIGNvbnZlcnRzIGl0IHRvIHN0cmluZy5qc29uIGFuZCBwdXNoZXNcbi8vIGl0IHRvIC9kYXRhL2xvY2FsL3RtcC9zdHJpbmcuanNvbiBvbiBmb3IgdXNlIG9mIGJvb3RzdHJhcFxuLy8gaWYgYXBwIGlzIG5vdCBwcmVzZW50IHRvIGV4dHJhY3Qgc3RyaW5nLnhtbCBpdCBkZWxldGVzIHJlbW90ZSBzdHJpbmdzLmpzb25cbi8vIGlmIGFwcCBkb2VzIG5vdCBoYXZlIHN0cmluZ3MueG1sIHdlIHB1c2ggYW4gZW1wdHkganNvbiBvYmplY3QgdG8gcmVtb3RlXG5oZWxwZXJzLnB1c2hTdHJpbmdzID0gYXN5bmMgZnVuY3Rpb24gKGxhbmd1YWdlLCBhZGIsIG9wdHMpIHtcbiAgbGV0IHJlbW90ZVBhdGggPSAnL2RhdGEvbG9jYWwvdG1wJztcbiAgbGV0IHN0cmluZ3NKc29uID0gJ3N0cmluZ3MuanNvbic7XG4gIGxldCBzdHJpbmdzVG1wRGlyID0gcGF0aC5yZXNvbHZlKG9wdHMudG1wRGlyLCBvcHRzLmFwcFBhY2thZ2UpO1xuICB0cnkge1xuICAgIGxvZ2dlci5kZWJ1ZygnRXh0cmFjdGluZyBzdHJpbmdzIGZyb20gYXBrJywgb3B0cy5hcHAsIGxhbmd1YWdlLCBzdHJpbmdzVG1wRGlyKTtcbiAgICBsZXQge2Fwa1N0cmluZ3MsIGxvY2FsUGF0aH0gPSBhd2FpdCBhZGIuZXh0cmFjdFN0cmluZ3NGcm9tQXBrKFxuICAgICAgICAgIG9wdHMuYXBwLCBsYW5ndWFnZSwgc3RyaW5nc1RtcERpcik7XG4gICAgYXdhaXQgYWRiLnB1c2gobG9jYWxQYXRoLCByZW1vdGVQYXRoKTtcbiAgICByZXR1cm4gYXBrU3RyaW5ncztcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKCEoYXdhaXQgZnMuZXhpc3RzKG9wdHMuYXBwKSkpIHtcbiAgICAgIC8vIGRlbGV0ZSByZW1vdGUgc3RyaW5nLmpzb24gaWYgcHJlc2VudFxuICAgICAgYXdhaXQgYWRiLnJpbXJhZihgJHtyZW1vdGVQYXRofS8ke3N0cmluZ3NKc29ufWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2dnZXIud2FybihcIkNvdWxkIG5vdCBnZXQgc3RyaW5ncywgY29udGludWluZyBhbnl3YXlcIik7XG4gICAgICBsZXQgcmVtb3RlRmlsZSA9IGAke3JlbW90ZVBhdGh9LyR7c3RyaW5nc0pzb259YDtcbiAgICAgIGF3YWl0IGFkYi5zaGVsbCgnZWNobycsIFtgJ3t9JyA+ICR7cmVtb3RlRmlsZX1gXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7fTtcbn07XG5cbmhlbHBlcnMudW5sb2NrID0gYXN5bmMgZnVuY3Rpb24gKGFkYikge1xuICBpZiAoIShhd2FpdCBhZGIuaXNTY3JlZW5Mb2NrZWQoKSkpIHtcbiAgICBsb2dnZXIuaW5mbyhcIlNjcmVlbiBhbHJlYWR5IHVubG9ja2VkLCBkb2luZyBub3RoaW5nXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBsb2dnZXIuaW5mbyhcIlVubG9ja2luZyBzY3JlZW5cIik7XG5cbiAgYXdhaXQgcmV0cnlJbnRlcnZhbCgxMCwgMTAwMCwgYXN5bmMgKCkgPT4ge1xuICAgIGxvZ2dlci5kZWJ1ZyhcIlNjcmVlbiBpcyBsb2NrZWQsIHRyeWluZyB0byB1bmxvY2tcIik7XG5cbiAgICAvLyBmaXJzdCBtYW51YWxseSBzdG9wIHRoZSB1bmxvY2sgYWN0aXZpdHlcbiAgICBhd2FpdCBhZGIuZm9yY2VTdG9wKCdpby5hcHBpdW0udW5sb2NrJyk7XG5cbiAgICAvLyB0aGVuIHN0YXJ0IHRoZSBhcHAgdHdpY2UsIGFzIG9uY2UgaXMgZmxha2V5XG4gICAgbGV0IHN0YXJ0T3B0cyA9IHtcbiAgICAgIHBrZzogXCJpby5hcHBpdW0udW5sb2NrXCIsXG4gICAgICBhY3Rpdml0eTogXCIuVW5sb2NrXCIsXG4gICAgICBhY3Rpb246IFwiYW5kcm9pZC5pbnRlbnQuYWN0aW9uLk1BSU5cIixcbiAgICAgIGNhdGVnb3J5OiBcImFuZHJvaWQuaW50ZW50LmNhdGVnb3J5LkxBVU5DSEVSXCIsXG4gICAgICBmbGFnczogXCIweDEwMjAwMDAwXCIsXG4gICAgICBzdG9wQXBwOiBmYWxzZVxuICAgIH07XG4gICAgYXdhaXQgYWRiLnN0YXJ0QXBwKHN0YXJ0T3B0cyk7XG4gICAgYXdhaXQgYWRiLnN0YXJ0QXBwKHN0YXJ0T3B0cyk7XG5cbiAgICAvLyBjaGVjayBpZiBpdCB3b3JrZWQsIHR3aWNlXG4gICAgYXdhaXQgcmV0cnlJbnRlcnZhbCgyLCAxMDAwLCBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoIWF3YWl0IGFkYi5pc1NjcmVlbkxvY2tlZCgpKSB7XG4gICAgICAgIGxvZ2dlci5kZWJ1ZyhcIlNjcmVlbiB1bmxvY2tlZCBzdWNjZXNzZnVsbHlcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTY3JlZW4gZGlkIG5vdCB1bmxvY2sgc3VjY2Vzc2Z1bGx5LCByZXRyeWluZ1wiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG5oZWxwZXJzLmluaXREZXZpY2UgPSBhc3luYyBmdW5jdGlvbiAoYWRiLCBvcHRzKSB7XG4gIGF3YWl0IGFkYi53YWl0Rm9yRGV2aWNlKCk7XG5cbiAgYXdhaXQgaGVscGVycy5lbnN1cmVEZXZpY2VMb2NhbGUoYWRiLCBvcHRzLmxhbmd1YWdlLCBvcHRzLmxvY2FsZSk7XG4gIGF3YWl0IGFkYi5zdGFydExvZ2NhdCgpO1xuICBsZXQgZGVmYXVsdElNRTtcbiAgaWYgKG9wdHMudW5pY29kZUtleWJvYXJkKSB7XG4gICAgZGVmYXVsdElNRSA9IGF3YWl0IGhlbHBlcnMuaW5pdFVuaWNvZGVLZXlib2FyZChhZGIpO1xuICB9XG4gIGF3YWl0IGhlbHBlcnMucHVzaFNldHRpbmdzQXBwKGFkYik7XG4gIGF3YWl0IGhlbHBlcnMucHVzaFVubG9jayhhZGIpO1xuICByZXR1cm4gZGVmYXVsdElNRTtcbn07XG5cbmhlbHBlcnMucmVtb3ZlTnVsbFByb3BlcnRpZXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIGZvciAobGV0IGtleSBvZiBfLmtleXMob2JqKSkge1xuICAgIGlmIChfLmlzTnVsbChvYmpba2V5XSkgfHwgXy5pc1VuZGVmaW5lZChvYmpba2V5XSkpIHtcbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9XG4gIH1cbn07XG5cbmhlbHBlcnMudHJ1bmNhdGVEZWNpbWFscyA9IGZ1bmN0aW9uIChudW1iZXIsIGRpZ2l0cykge1xuICBsZXQgbXVsdGlwbGllciA9IE1hdGgucG93KDEwLCBkaWdpdHMpLFxuICAgICAgYWRqdXN0ZWROdW0gPSBudW1iZXIgKiBtdWx0aXBsaWVyLFxuICAgICAgdHJ1bmNhdGVkTnVtID0gTWF0aFthZGp1c3RlZE51bSA8IDAgPyAnY2VpbCcgOiAnZmxvb3InXShhZGp1c3RlZE51bSk7XG5cbiAgcmV0dXJuIHRydW5jYXRlZE51bSAvIG11bHRpcGxpZXI7XG59O1xuXG5oZWxwZXJzLmlzQ2hyb21lQnJvd3NlciA9IGZ1bmN0aW9uIChicm93c2VyKSB7XG4gIHJldHVybiBfLmNvbnRhaW5zKENIUk9NRV9CUk9XU0VSUywgYnJvd3Nlcik7XG59O1xuXG5oZWxwZXJzLmdldENocm9tZVBrZyA9IGZ1bmN0aW9uIChicm93c2VyKSB7XG4gIGxldCBwa2csIGFjdGl2aXR5O1xuXG4gIGJyb3dzZXIgPSBicm93c2VyLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChicm93c2VyID09PSBcImNocm9taXVtXCIpIHtcbiAgICBwa2cgPSBcIm9yZy5jaHJvbWl1bS5jaHJvbWUuc2hlbGxcIjtcbiAgICBhY3Rpdml0eSA9IFwiLkNocm9tZVNoZWxsQWN0aXZpdHlcIjtcbiAgfSBlbHNlIGlmIChicm93c2VyID09PSBcImNocm9tZWJldGFcIikge1xuICAgIHBrZyA9IFwiY29tLmNocm9tZS5iZXRhXCI7XG4gICAgYWN0aXZpdHkgPSBcImNvbS5nb29nbGUuYW5kcm9pZC5hcHBzLmNocm9tZS5NYWluXCI7XG4gIH0gZWxzZSBpZiAoYnJvd3NlciA9PT0gXCJicm93c2VyXCIpIHtcbiAgICBwa2cgPSBcImNvbS5hbmRyb2lkLmJyb3dzZXJcIjtcbiAgICBhY3Rpdml0eSA9IFwiY29tLmFuZHJvaWQuYnJvd3Nlci5Ccm93c2VyQWN0aXZpdHlcIjtcbiAgfSBlbHNlIGlmIChicm93c2VyID09PSBcImNocm9taXVtLWJyb3dzZXJcIikge1xuICAgIHBrZyA9IFwib3JnLmNocm9taXVtLmNocm9tZVwiO1xuICAgIGFjdGl2aXR5ID0gXCJjb20uZ29vZ2xlLmFuZHJvaWQuYXBwcy5jaHJvbWUuTWFpblwiO1xuICB9IGVsc2Uge1xuICAgIHBrZyA9IFwiY29tLmFuZHJvaWQuY2hyb21lXCI7XG4gICAgYWN0aXZpdHkgPSBcImNvbS5nb29nbGUuYW5kcm9pZC5hcHBzLmNocm9tZS5NYWluXCI7XG4gIH1cbiAgcmV0dXJuIHtwa2csIGFjdGl2aXR5fTtcbn07XG5cbmhlbHBlcnMuYm9vdHN0cmFwID0gQm9vdHN0cmFwO1xuXG5leHBvcnQgZGVmYXVsdCBoZWxwZXJzO1xuZXhwb3J0IHsgQ0hST01FX0JST1dTRVJTIH07XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uIn0=
