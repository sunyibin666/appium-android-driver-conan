'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _androidHelpers = require('../android-helpers');

var _androidHelpers2 = _interopRequireDefault(_androidHelpers);

var _appiumSupport = require('appium-support');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var commands = {},
    helpers = {},
    extensions = {};

var logTypesSupported = {
  'logcat': 'Logs for Android applications on real device and emulators via ADB'
};

commands.keys = function callee$0$0(keys) {
  var params;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        // Protocol sends an array; rethink approach
        keys = _lodash2['default'].isArray(keys) ? keys.join('') : keys;
        params = {
          text: keys,
          replace: false
        };

        if (this.opts.unicodeKeyboard) {
          params.unicodeKeyboard = true;
        }
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(this.doSendKeys(params));

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.doSendKeys = function callee$0$0(params) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction('setText', params));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.getDeviceTime = function callee$0$0() {
  var out;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].info('Attempting to capture android device date and time');
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.adb.shell(['date']));

      case 4:
        out = context$1$0.sent;
        return context$1$0.abrupt('return', out.trim());

      case 8:
        context$1$0.prev = 8;
        context$1$0.t0 = context$1$0['catch'](1);

        _logger2['default'].errorAndThrow('Could not capture device date and time: ' + context$1$0.t0);

      case 11:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 8]]);
};

commands.getPageSource = function () {
  return this.bootstrap.sendAction('source');
};

commands.back = function () {
  return this.bootstrap.sendAction('pressBack');
};

commands.isKeyboardShown = function callee$0$0() {
  var keyboardInfo;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.isSoftKeyboardPresent());

      case 2:
        keyboardInfo = context$1$0.sent;
        return context$1$0.abrupt('return', keyboardInfo.isKeyboardShown);

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.hideKeyboard = function callee$0$0() {
  var _ref, isKeyboardShown, canCloseKeyboard;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.isSoftKeyboardPresent());

      case 2:
        _ref = context$1$0.sent;
        isKeyboardShown = _ref.isKeyboardShown;
        canCloseKeyboard = _ref.canCloseKeyboard;

        if (isKeyboardShown) {
          context$1$0.next = 7;
          break;
        }

        throw new Error("Soft keyboard not present, cannot hide keyboard");

      case 7:
        if (!canCloseKeyboard) {
          context$1$0.next = 11;
          break;
        }

        return context$1$0.abrupt('return', this.back());

      case 11:
        _logger2['default'].info("Keyboard has no UI; no closing necessary");

      case 12:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.openSettingsActivity = function callee$0$0(setting) {
  var _ref2, appPackage, appActivity;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.getFocusedPackageAndActivity());

      case 2:
        _ref2 = context$1$0.sent;
        appPackage = _ref2.appPackage;
        appActivity = _ref2.appActivity;
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.adb.shell(['am', 'start', '-a', 'android.settings.' + setting]));

      case 7:
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(this.adb.waitForNotActivity(appPackage, appActivity, 5000));

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.getWindowSize = function () {
  return this.bootstrap.sendAction('getDeviceSize');
};

commands.getCurrentActivity = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.getFocusedPackageAndActivity());

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent.appActivity);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.getLogTypes = function () {
  return _lodash2['default'].keys(logTypesSupported);
};

commands.getLog = function (logType) {
  if (!_lodash2['default'].has(logTypesSupported, logType)) {
    throw new Error('Unsupported log type ' + logType + '. ' + ('Supported types are ' + JSON.stringify(logTypesSupported)));
  }

  if (logType === 'logcat') {
    return this.adb.getLogcatLogs();
  }
};

commands.isAppInstalled = function (appPackage) {
  return this.adb.isAppInstalled(appPackage);
};

commands.removeApp = function (appPackage) {
  return this.adb.uninstallApk(appPackage);
};

commands.installApp = function callee$0$0(appPath) {
  var _ref3, apkPackage, opts;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(appPath));

      case 2:
        if (context$1$0.sent) {
          context$1$0.next = 4;
          break;
        }

        _logger2['default'].errorAndThrow('Could not find app apk at ' + appPath);

      case 4:
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(this.adb.packageAndLaunchActivityFromManifest(appPath));

      case 6:
        _ref3 = context$1$0.sent;
        apkPackage = _ref3.apkPackage;
        opts = {
          app: appPath,
          appPackage: apkPackage,
          fastReset: this.opts.fastReset
        };
        return context$1$0.abrupt('return', _androidHelpers2['default'].installApkRemotely(this.adb, opts));

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.background = function callee$0$0(seconds) {
  var _ref4, appPackage, appActivity;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.getFocusedPackageAndActivity());

      case 2:
        _ref4 = context$1$0.sent;
        appPackage = _ref4.appPackage;
        appActivity = _ref4.appActivity;
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.adb.goToHome());

      case 7:
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(_bluebird2['default'].delay(seconds * 1000));

      case 9:
        return context$1$0.abrupt('return', this.adb.startApp({
          pkg: this.opts.appPackage,
          activity: this.opts.appActivity,
          action: this.opts.intentAction,
          category: this.opts.intentCategory,
          flags: this.opts.intentFlags,
          waitPkg: appPackage,
          waitActivity: appActivity,
          optionalIntentArguments: this.opts.optionalIntentArguments,
          stopApp: this.opts.stopAppOnReset || !this.opts.dontStopAppOnReset
        }));

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.getStrings = function callee$0$0(language) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (language) {
          context$1$0.next = 5;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.adb.getDeviceLanguage());

      case 3:
        language = context$1$0.sent;

        _logger2['default'].info('No language specified, returning strings for: ' + language);

      case 5:
        if (!this.apkStrings[language]) {
          context$1$0.next = 7;
          break;
        }

        return context$1$0.abrupt('return', this.apkStrings[language]);

      case 7:
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(_androidHelpers2['default'].pushStrings(language, this.adb, this.opts));

      case 9:
        this.apkStrings[language] = context$1$0.sent;
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction('updateStrings'));

      case 12:
        return context$1$0.abrupt('return', this.apkStrings[language]);

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.launchApp = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.initAUT());

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.startAUT());

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.startActivity = function callee$0$0(appPackage, appActivity, appWaitPackage, appWaitActivity, intentAction, intentCategory, intentFlags, optionalIntentArguments, dontStopAppOnReset) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug('Starting package \'' + appPackage + '\' and activity \'' + appActivity + '\'');

        // dontStopAppOnReset is both an argument here, and a desired capability
        // if the argument is set, use it, otherwise use the cap
        if (!_appiumSupport.util.hasValue(dontStopAppOnReset)) {
          dontStopAppOnReset = !!this.opts.dontStopAppOnReset;
        }

        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.adb.startApp({
          pkg: appPackage,
          activity: appActivity,
          waitPkg: appWaitPackage || appPackage,
          waitActivity: appWaitActivity || appActivity,
          action: intentAction,
          category: intentCategory,
          flags: intentFlags,
          optionalIntentArguments: optionalIntentArguments,
          stopApp: !dontStopAppOnReset
        }));

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.reset = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!this.opts.fullReset) {
          context$1$0.next = 10;
          break;
        }

        _logger2['default'].info("Running old fashion reset (reinstall)");
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(this.adb.stopAndClear(this.opts.appPackage));

      case 4:
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(this.adb.uninstallApk(this.opts.appPackage));

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(_androidHelpers2['default'].installApkRemotely(this.adb, this.opts));

      case 8:
        context$1$0.next = 13;
        break;

      case 10:
        _logger2['default'].info("Running fast reset (stop and clear)");
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(this.adb.stopAndClear(this.opts.appPackage));

      case 13:
        context$1$0.next = 15;
        return _regeneratorRuntime.awrap(this.startAUT());

      case 15:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.startAUT = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.startApp({
          pkg: this.opts.appPackage,
          activity: this.opts.appActivity,
          action: this.opts.intentAction,
          category: this.opts.intentCategory,
          flags: this.opts.intentFlags,
          waitPkg: this.opts.appWaitPackage,
          waitActivity: this.opts.appWaitActivity,
          waitDuration: this.opts.appWaitDuration,
          optionalIntentArguments: this.opts.optionalIntentArguments,
          stopApp: this.opts.stopAppOnReset || !this.opts.dontStopAppOnReset
        }));

      case 2:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

// we override setUrl to take an android URI which can be used for deep-linking
// inside an app, similar to starting an intent
commands.setUrl = function callee$0$0(uri) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.startUri(uri, this.opts.appPackage));

      case 2:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

// closing app using force stop
commands.closeApp = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.forceStop(this.opts.appPackage));

      case 2:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.getDisplayDensity = function callee$0$0() {
  var out, val;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.shell(['getprop', 'ro.sf.lcd_density']));

      case 2:
        out = context$1$0.sent;

        if (!out) {
          context$1$0.next = 8;
          break;
        }

        val = parseInt(out, 10);

        if (isNaN(val)) {
          context$1$0.next = 7;
          break;
        }

        return context$1$0.abrupt('return', val);

      case 7:
        _logger2['default'].debug('Parsed density value was NaN: "' + out + '"');

      case 8:
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(this.adb.shell(['getprop', 'qemu.sf.lcd_density']));

      case 10:
        out = context$1$0.sent;

        if (!out) {
          context$1$0.next = 16;
          break;
        }

        val = parseInt(out, 10);

        if (isNaN(val)) {
          context$1$0.next = 15;
          break;
        }

        return context$1$0.abrupt('return', val);

      case 15:
        _logger2['default'].debug('Parsed density value was NaN: "' + out + '"');

      case 16:
        // couldn't get anything, so error out
        _logger2['default'].errorAndThrow('Failed to get display density property.');

      case 17:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

/**
 * Parses the given window manager Surface string to get info.
 * @param line: To parse. This is assumed to be valid.
 * @return: Visibility and bounds of the Surface.
 */
function parseSurfaceLine(line) {
  // the surface bounds are in the format:
  // "rect=(0.0,1184.0) 768.0 x 96.0"
  //       ^ location   ^ size
  // cut out the stuff before the 'rect' and then split the numbers apart
  var bounds = line.split('rect=')[1].replace(/[\(\), x]+/g, ' ').trim().split(' ');

  return {
    visible: line.indexOf('shown=true') !== -1,
    x: parseFloat(bounds[0]),
    y: parseFloat(bounds[1]),
    width: parseFloat(bounds[2]),
    height: parseFloat(bounds[3])
  };
}

/**
 * Extracts status and navigation bar information from the window manager output.
 * @param lines: Output from dumpsys command
 * @return: Visibility and bounds info of status and navigation bar
 */
function parseWindows(lines) {
  var atStatusBar = false;
  var atNavBar = false;
  var statusBar = undefined;
  var navigationBar = undefined;
  // the window manager output looks like:
  // Window #1 ... WindowID
  //   A bunch of properties
  // Window #2 ... WindowID
  //   A bunch of properties
  lines.split('\n').forEach(function (line) {
    // the start of a new window section
    if (line.indexOf('  Window #') !== -1) {
      // determine which section we're in
      // only one will be true
      atStatusBar = line.indexOf('StatusBar') !== -1;
      atNavBar = line.indexOf('NavigationBar') !== -1;
      // don't need anything else. move to next line
      return;
    }
    // once we're in a window section, look for the surface data line
    if (line.indexOf('      Surface:') === -1) {
      return;
    }
    if (atStatusBar) {
      statusBar = parseSurfaceLine(line);
      atStatusBar = false;
    } else if (atNavBar) {
      navigationBar = parseSurfaceLine(line);
      atNavBar = false;
    }
  });

  if (!statusBar) {
    _logger2['default'].errorAndThrow('Failed to parse status bar information.');
  }
  if (!navigationBar) {
    _logger2['default'].errorAndThrow('Failed to parse navigation bar information.');
  }

  return { statusBar: statusBar, navigationBar: navigationBar };
}

commands.getSystemBars = function callee$0$0() {
  var out;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.shell(['dumpsys', 'window', 'windows']));

      case 2:
        out = context$1$0.sent;

        if (!out) {
          _logger2['default'].errorAndThrow('Did not get window manager output.');
        }
        return context$1$0.abrupt('return', parseWindows(out));

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

_Object$assign(extensions, commands, helpers);
exports.commands = commands;
exports.helpers = helpers;
exports['default'] = extensions;

// for unit tests
exports.parseWindows = parseWindows;
exports.parseSurfaceLine = parseSurfaceLine;

// Return cached strings

// TODO: This is mutating the current language, but it's how appium currently works

// first try the property for devices

// if the value is NaN, try getting the emulator property

// fallback to trying property for emulators
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9nZW5lcmFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7OzhCQUNLLG9CQUFvQjs7Ozs2QkFDdEIsZ0JBQWdCOzt3QkFDM0IsVUFBVTs7OztzQkFDUixXQUFXOzs7O0FBRzNCLElBQUksUUFBUSxHQUFHLEVBQUU7SUFBRSxPQUFPLEdBQUcsRUFBRTtJQUFFLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRWpELElBQU0saUJBQWlCLEdBQUc7QUFDeEIsVUFBUSxFQUFHLG9FQUFvRTtDQUNoRixDQUFDOztBQUVGLFFBQVEsQ0FBQyxJQUFJLEdBQUcsb0JBQWdCLElBQUk7TUFHOUIsTUFBTTs7Ozs7QUFEVixZQUFJLEdBQUcsb0JBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzFDLGNBQU0sR0FBRztBQUNYLGNBQUksRUFBRSxJQUFJO0FBQ1YsaUJBQU8sRUFBRSxLQUFLO1NBQ2Y7O0FBQ0QsWUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtBQUM3QixnQkFBTSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7U0FDL0I7O3lDQUNLLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDOzs7Ozs7O0NBQzlCLENBQUM7O0FBRUYsUUFBUSxDQUFDLFVBQVUsR0FBRyxvQkFBZSxNQUFNOzs7Ozt5Q0FDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQzs7Ozs7Ozs7OztDQUMxRCxDQUFDOztBQUVGLFFBQVEsQ0FBQyxhQUFhLEdBQUc7TUFHakIsR0FBRzs7OztBQUZULDRCQUFJLElBQUksQ0FBQyxvREFBb0QsQ0FBQyxDQUFDOzs7eUNBRTdDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7OztBQUFwQyxXQUFH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Q0FBQztHQUNsRTs7QUFFRCxTQUFPLEVBQUMsU0FBUyxFQUFULFNBQVMsRUFBRSxhQUFhLEVBQWIsYUFBYSxFQUFDLENBQUM7Q0FDbkM7O0FBRUQsUUFBUSxDQUFDLGFBQWEsR0FBRztNQUNuQixHQUFHOzs7Ozt5Q0FBUyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7OztBQUE1RCxXQUFHOztBQUNQLFlBQUksQ0FBQyxHQUFHLEVBQUU7QUFDUiw4QkFBSSxhQUFhLENBQUMsb0NBQW9DLENBQUMsQ0FBQztTQUN6RDs0Q0FDTSxZQUFZLENBQUMsR0FBRyxDQUFDOzs7Ozs7O0NBQ3pCLENBQUM7O0FBRUYsZUFBYyxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BDLFFBQVEsR0FBUixRQUFRO1FBQUUsT0FBTyxHQUFQLE9BQU87cUJBQ1gsVUFBVTs7O1FBRWhCLFlBQVksR0FBWixZQUFZO1FBQUUsZ0JBQWdCLEdBQWhCLGdCQUFnQiIsImZpbGUiOiJsaWIvY29tbWFuZHMvZ2VuZXJhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgYW5kcm9pZEhlbHBlcnMgZnJvbSAnLi4vYW5kcm9pZC1oZWxwZXJzJztcbmltcG9ydCB7IGZzLCB1dGlsIH0gZnJvbSAnYXBwaXVtLXN1cHBvcnQnO1xuaW1wb3J0IEIgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGxvZyBmcm9tICcuLi9sb2dnZXInO1xuXG5cbmxldCBjb21tYW5kcyA9IHt9LCBoZWxwZXJzID0ge30sIGV4dGVuc2lvbnMgPSB7fTtcblxuY29uc3QgbG9nVHlwZXNTdXBwb3J0ZWQgPSB7XG4gICdsb2djYXQnIDogJ0xvZ3MgZm9yIEFuZHJvaWQgYXBwbGljYXRpb25zIG9uIHJlYWwgZGV2aWNlIGFuZCBlbXVsYXRvcnMgdmlhIEFEQidcbn07XG5cbmNvbW1hbmRzLmtleXMgPSBhc3luYyBmdW5jdGlvbiAoa2V5cykge1xuICAvLyBQcm90b2NvbCBzZW5kcyBhbiBhcnJheTsgcmV0aGluayBhcHByb2FjaFxuICBrZXlzID0gXy5pc0FycmF5KGtleXMpID8ga2V5cy5qb2luKCcnKSA6IGtleXM7XG4gIGxldCBwYXJhbXMgPSB7XG4gICAgdGV4dDoga2V5cyxcbiAgICByZXBsYWNlOiBmYWxzZVxuICB9O1xuICBpZiAodGhpcy5vcHRzLnVuaWNvZGVLZXlib2FyZCkge1xuICAgIHBhcmFtcy51bmljb2RlS2V5Ym9hcmQgPSB0cnVlO1xuICB9XG4gIGF3YWl0IHRoaXMuZG9TZW5kS2V5cyhwYXJhbXMpO1xufTtcblxuY29tbWFuZHMuZG9TZW5kS2V5cyA9IGFzeW5jIGZ1bmN0aW9uKHBhcmFtcykge1xuICByZXR1cm4gYXdhaXQgdGhpcy5ib290c3RyYXAuc2VuZEFjdGlvbignc2V0VGV4dCcsIHBhcmFtcyk7XG59O1xuXG5jb21tYW5kcy5nZXREZXZpY2VUaW1lID0gYXN5bmMgZnVuY3Rpb24oKSB7XG4gIGxvZy5pbmZvKCdBdHRlbXB0aW5nIHRvIGNhcHR1cmUgYW5kcm9pZCBkZXZpY2UgZGF0ZSBhbmQgdGltZScpO1xuICB0cnkge1xuICAgIGxldCBvdXQgPSBhd2FpdCB0aGlzLmFkYi5zaGVsbChbJ2RhdGUnXSk7XG4gICAgcmV0dXJuIG91dC50cmltKCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGxvZy5lcnJvckFuZFRocm93KGBDb3VsZCBub3QgY2FwdHVyZSBkZXZpY2UgZGF0ZSBhbmQgdGltZTogJHtlcnJ9YCk7XG4gIH1cbn07XG5cbmNvbW1hbmRzLmdldFBhZ2VTb3VyY2UgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmJvb3RzdHJhcC5zZW5kQWN0aW9uKCdzb3VyY2UnKTtcbn07XG5cbmNvbW1hbmRzLmJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmJvb3RzdHJhcC5zZW5kQWN0aW9uKCdwcmVzc0JhY2snKTtcbn07XG5cbmNvbW1hbmRzLmlzS2V5Ym9hcmRTaG93biA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgbGV0IGtleWJvYXJkSW5mbyA9IGF3YWl0IHRoaXMuYWRiLmlzU29mdEtleWJvYXJkUHJlc2VudCgpO1xuICByZXR1cm4ga2V5Ym9hcmRJbmZvLmlzS2V5Ym9hcmRTaG93bjtcbn07XG5cbmNvbW1hbmRzLmhpZGVLZXlib2FyZCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgbGV0IHtpc0tleWJvYXJkU2hvd24sIGNhbkNsb3NlS2V5Ym9hcmR9ID0gYXdhaXQgdGhpcy5hZGIuaXNTb2Z0S2V5Ym9hcmRQcmVzZW50KCk7XG4gIGlmICghaXNLZXlib2FyZFNob3duKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiU29mdCBrZXlib2FyZCBub3QgcHJlc2VudCwgY2Fubm90IGhpZGUga2V5Ym9hcmRcIik7XG4gIH1cblxuICBpZiAoY2FuQ2xvc2VLZXlib2FyZCkge1xuICAgIHJldHVybiB0aGlzLmJhY2soKTtcbiAgfSBlbHNlIHtcbiAgICBsb2cuaW5mbyhcIktleWJvYXJkIGhhcyBubyBVSTsgbm8gY2xvc2luZyBuZWNlc3NhcnlcIik7XG4gIH1cbn07XG5cbmNvbW1hbmRzLm9wZW5TZXR0aW5nc0FjdGl2aXR5ID0gYXN5bmMgZnVuY3Rpb24gKHNldHRpbmcpIHtcbiAgbGV0IHthcHBQYWNrYWdlLCBhcHBBY3Rpdml0eX0gPSBhd2FpdCB0aGlzLmFkYi5nZXRGb2N1c2VkUGFja2FnZUFuZEFjdGl2aXR5KCk7XG4gIGF3YWl0IHRoaXMuYWRiLnNoZWxsKFsnYW0nLCAnc3RhcnQnLCAnLWEnLCBgYW5kcm9pZC5zZXR0aW5ncy4ke3NldHRpbmd9YF0pO1xuICBhd2FpdCB0aGlzLmFkYi53YWl0Rm9yTm90QWN0aXZpdHkoYXBwUGFja2FnZSwgYXBwQWN0aXZpdHksIDUwMDApO1xufTtcblxuY29tbWFuZHMuZ2V0V2luZG93U2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuYm9vdHN0cmFwLnNlbmRBY3Rpb24oJ2dldERldmljZVNpemUnKTtcbn07XG5cbmNvbW1hbmRzLmdldEN1cnJlbnRBY3Rpdml0eSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIChhd2FpdCB0aGlzLmFkYi5nZXRGb2N1c2VkUGFja2FnZUFuZEFjdGl2aXR5KCkpLmFwcEFjdGl2aXR5O1xufTtcblxuY29tbWFuZHMuZ2V0TG9nVHlwZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBfLmtleXMobG9nVHlwZXNTdXBwb3J0ZWQpO1xufTtcblxuY29tbWFuZHMuZ2V0TG9nID0gZnVuY3Rpb24gKGxvZ1R5cGUpIHtcbiAgaWYgKCFfLmhhcyhsb2dUeXBlc1N1cHBvcnRlZCwgbG9nVHlwZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGxvZyB0eXBlICR7bG9nVHlwZX0uIGAgK1xuICAgICAgICAgICAgICAgICAgICBgU3VwcG9ydGVkIHR5cGVzIGFyZSAke0pTT04uc3RyaW5naWZ5KGxvZ1R5cGVzU3VwcG9ydGVkKX1gKTtcbiAgfVxuXG4gIGlmIChsb2dUeXBlID09PSAnbG9nY2F0Jykge1xuICAgIHJldHVybiB0aGlzLmFkYi5nZXRMb2djYXRMb2dzKCk7XG4gIH1cbn07XG5cbmNvbW1hbmRzLmlzQXBwSW5zdGFsbGVkID0gZnVuY3Rpb24gKGFwcFBhY2thZ2UpIHtcbiAgcmV0dXJuIHRoaXMuYWRiLmlzQXBwSW5zdGFsbGVkKGFwcFBhY2thZ2UpO1xufTtcblxuY29tbWFuZHMucmVtb3ZlQXBwID0gZnVuY3Rpb24gKGFwcFBhY2thZ2UpIHtcbiAgcmV0dXJuIHRoaXMuYWRiLnVuaW5zdGFsbEFwayhhcHBQYWNrYWdlKTtcbn07XG5cbmNvbW1hbmRzLmluc3RhbGxBcHAgPSBhc3luYyBmdW5jdGlvbiAoYXBwUGF0aCkge1xuICBpZiAoIShhd2FpdCBmcy5leGlzdHMoYXBwUGF0aCkpKSB7XG4gICAgbG9nLmVycm9yQW5kVGhyb3coYENvdWxkIG5vdCBmaW5kIGFwcCBhcGsgYXQgJHthcHBQYXRofWApO1xuICB9XG5cbiAgbGV0IHthcGtQYWNrYWdlfSA9IGF3YWl0IHRoaXMuYWRiLnBhY2thZ2VBbmRMYXVuY2hBY3Rpdml0eUZyb21NYW5pZmVzdChhcHBQYXRoKTtcbiAgbGV0IG9wdHMgPSB7XG4gICAgYXBwOiBhcHBQYXRoLFxuICAgIGFwcFBhY2thZ2U6IGFwa1BhY2thZ2UsXG4gICAgZmFzdFJlc2V0OiB0aGlzLm9wdHMuZmFzdFJlc2V0XG4gIH07XG4gIHJldHVybiBhbmRyb2lkSGVscGVycy5pbnN0YWxsQXBrUmVtb3RlbHkodGhpcy5hZGIsIG9wdHMpO1xufTtcblxuY29tbWFuZHMuYmFja2dyb3VuZCA9IGFzeW5jIGZ1bmN0aW9uIChzZWNvbmRzKSB7XG4gIGxldCB7YXBwUGFja2FnZSwgYXBwQWN0aXZpdHl9ID0gYXdhaXQgdGhpcy5hZGIuZ2V0Rm9jdXNlZFBhY2thZ2VBbmRBY3Rpdml0eSgpO1xuICBhd2FpdCB0aGlzLmFkYi5nb1RvSG9tZSgpO1xuICBhd2FpdCBCLmRlbGF5KHNlY29uZHMgKiAxMDAwKTtcbiAgcmV0dXJuIHRoaXMuYWRiLnN0YXJ0QXBwKHtcbiAgICBwa2c6IHRoaXMub3B0cy5hcHBQYWNrYWdlLFxuICAgIGFjdGl2aXR5OiB0aGlzLm9wdHMuYXBwQWN0aXZpdHksXG4gICAgYWN0aW9uOiB0aGlzLm9wdHMuaW50ZW50QWN0aW9uLFxuICAgIGNhdGVnb3J5OiB0aGlzLm9wdHMuaW50ZW50Q2F0ZWdvcnksXG4gICAgZmxhZ3M6IHRoaXMub3B0cy5pbnRlbnRGbGFncyxcbiAgICB3YWl0UGtnOiBhcHBQYWNrYWdlLFxuICAgIHdhaXRBY3Rpdml0eTogYXBwQWN0aXZpdHksXG4gICAgb3B0aW9uYWxJbnRlbnRBcmd1bWVudHM6IHRoaXMub3B0cy5vcHRpb25hbEludGVudEFyZ3VtZW50cyxcbiAgICBzdG9wQXBwOiB0aGlzLm9wdHMuc3RvcEFwcE9uUmVzZXQgfHwgIXRoaXMub3B0cy5kb250U3RvcEFwcE9uUmVzZXQsXG4gIH0pO1xufTtcblxuY29tbWFuZHMuZ2V0U3RyaW5ncyA9IGFzeW5jIGZ1bmN0aW9uIChsYW5ndWFnZSkge1xuICBpZiAoIWxhbmd1YWdlKSB7XG4gICAgbGFuZ3VhZ2UgPSBhd2FpdCB0aGlzLmFkYi5nZXREZXZpY2VMYW5ndWFnZSgpO1xuICAgIGxvZy5pbmZvKGBObyBsYW5ndWFnZSBzcGVjaWZpZWQsIHJldHVybmluZyBzdHJpbmdzIGZvcjogJHtsYW5ndWFnZX1gKTtcbiAgfVxuXG4gIGlmICh0aGlzLmFwa1N0cmluZ3NbbGFuZ3VhZ2VdKSB7XG4gICAgLy8gUmV0dXJuIGNhY2hlZCBzdHJpbmdzXG4gICAgcmV0dXJuIHRoaXMuYXBrU3RyaW5nc1tsYW5ndWFnZV07XG4gIH1cblxuICAvLyBUT0RPOiBUaGlzIGlzIG11dGF0aW5nIHRoZSBjdXJyZW50IGxhbmd1YWdlLCBidXQgaXQncyBob3cgYXBwaXVtIGN1cnJlbnRseSB3b3Jrc1xuICB0aGlzLmFwa1N0cmluZ3NbbGFuZ3VhZ2VdID0gYXdhaXQgYW5kcm9pZEhlbHBlcnMucHVzaFN0cmluZ3MobGFuZ3VhZ2UsIHRoaXMuYWRiLCB0aGlzLm9wdHMpO1xuICBhd2FpdCB0aGlzLmJvb3RzdHJhcC5zZW5kQWN0aW9uKCd1cGRhdGVTdHJpbmdzJyk7XG5cbiAgcmV0dXJuIHRoaXMuYXBrU3RyaW5nc1tsYW5ndWFnZV07XG59O1xuXG5jb21tYW5kcy5sYXVuY2hBcHAgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGF3YWl0IHRoaXMuaW5pdEFVVCgpO1xuICBhd2FpdCB0aGlzLnN0YXJ0QVVUKCk7XG59O1xuXG5jb21tYW5kcy5zdGFydEFjdGl2aXR5ID0gYXN5bmMgZnVuY3Rpb24gKGFwcFBhY2thZ2UsIGFwcEFjdGl2aXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBXYWl0UGFja2FnZSwgYXBwV2FpdEFjdGl2aXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlbnRBY3Rpb24sIGludGVudENhdGVnb3J5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlbnRGbGFncywgb3B0aW9uYWxJbnRlbnRBcmd1bWVudHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbnRTdG9wQXBwT25SZXNldCkge1xuICBsb2cuZGVidWcoYFN0YXJ0aW5nIHBhY2thZ2UgJyR7YXBwUGFja2FnZX0nIGFuZCBhY3Rpdml0eSAnJHthcHBBY3Rpdml0eX0nYCk7XG5cbiAgLy8gZG9udFN0b3BBcHBPblJlc2V0IGlzIGJvdGggYW4gYXJndW1lbnQgaGVyZSwgYW5kIGEgZGVzaXJlZCBjYXBhYmlsaXR5XG4gIC8vIGlmIHRoZSBhcmd1bWVudCBpcyBzZXQsIHVzZSBpdCwgb3RoZXJ3aXNlIHVzZSB0aGUgY2FwXG4gIGlmICghdXRpbC5oYXNWYWx1ZShkb250U3RvcEFwcE9uUmVzZXQpKSB7XG4gICAgZG9udFN0b3BBcHBPblJlc2V0ID0gISF0aGlzLm9wdHMuZG9udFN0b3BBcHBPblJlc2V0O1xuICB9XG5cbiAgYXdhaXQgdGhpcy5hZGIuc3RhcnRBcHAoe1xuICAgIHBrZzogYXBwUGFja2FnZSxcbiAgICBhY3Rpdml0eTogYXBwQWN0aXZpdHksXG4gICAgd2FpdFBrZzogYXBwV2FpdFBhY2thZ2UgfHwgYXBwUGFja2FnZSxcbiAgICB3YWl0QWN0aXZpdHk6IGFwcFdhaXRBY3Rpdml0eSB8fCBhcHBBY3Rpdml0eSxcbiAgICBhY3Rpb246IGludGVudEFjdGlvbixcbiAgICBjYXRlZ29yeTogaW50ZW50Q2F0ZWdvcnksXG4gICAgZmxhZ3M6IGludGVudEZsYWdzLFxuICAgIG9wdGlvbmFsSW50ZW50QXJndW1lbnRzLFxuICAgIHN0b3BBcHA6ICFkb250U3RvcEFwcE9uUmVzZXRcbiAgfSk7XG59O1xuXG5jb21tYW5kcy5yZXNldCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMub3B0cy5mdWxsUmVzZXQpIHtcbiAgICBsb2cuaW5mbyhcIlJ1bm5pbmcgb2xkIGZhc2hpb24gcmVzZXQgKHJlaW5zdGFsbClcIik7XG4gICAgYXdhaXQgdGhpcy5hZGIuc3RvcEFuZENsZWFyKHRoaXMub3B0cy5hcHBQYWNrYWdlKTtcbiAgICBhd2FpdCB0aGlzLmFkYi51bmluc3RhbGxBcGsodGhpcy5vcHRzLmFwcFBhY2thZ2UpO1xuICAgIGF3YWl0IGFuZHJvaWRIZWxwZXJzLmluc3RhbGxBcGtSZW1vdGVseSh0aGlzLmFkYiwgdGhpcy5vcHRzKTtcbiAgfSBlbHNlIHtcbiAgICBsb2cuaW5mbyhcIlJ1bm5pbmcgZmFzdCByZXNldCAoc3RvcCBhbmQgY2xlYXIpXCIpO1xuICAgIGF3YWl0IHRoaXMuYWRiLnN0b3BBbmRDbGVhcih0aGlzLm9wdHMuYXBwUGFja2FnZSk7XG4gIH1cblxuICByZXR1cm4gYXdhaXQgdGhpcy5zdGFydEFVVCgpO1xufTtcblxuY29tbWFuZHMuc3RhcnRBVVQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGF3YWl0IHRoaXMuYWRiLnN0YXJ0QXBwKHtcbiAgICBwa2c6IHRoaXMub3B0cy5hcHBQYWNrYWdlLFxuICAgIGFjdGl2aXR5OiB0aGlzLm9wdHMuYXBwQWN0aXZpdHksXG4gICAgYWN0aW9uOiB0aGlzLm9wdHMuaW50ZW50QWN0aW9uLFxuICAgIGNhdGVnb3J5OiB0aGlzLm9wdHMuaW50ZW50Q2F0ZWdvcnksXG4gICAgZmxhZ3M6IHRoaXMub3B0cy5pbnRlbnRGbGFncyxcbiAgICB3YWl0UGtnOiB0aGlzLm9wdHMuYXBwV2FpdFBhY2thZ2UsXG4gICAgd2FpdEFjdGl2aXR5OiB0aGlzLm9wdHMuYXBwV2FpdEFjdGl2aXR5LFxuICAgIHdhaXREdXJhdGlvbjogdGhpcy5vcHRzLmFwcFdhaXREdXJhdGlvbixcbiAgICBvcHRpb25hbEludGVudEFyZ3VtZW50czogdGhpcy5vcHRzLm9wdGlvbmFsSW50ZW50QXJndW1lbnRzLFxuICAgIHN0b3BBcHA6IHRoaXMub3B0cy5zdG9wQXBwT25SZXNldCB8fCAhdGhpcy5vcHRzLmRvbnRTdG9wQXBwT25SZXNldCxcbiAgfSk7XG59O1xuXG4vLyB3ZSBvdmVycmlkZSBzZXRVcmwgdG8gdGFrZSBhbiBhbmRyb2lkIFVSSSB3aGljaCBjYW4gYmUgdXNlZCBmb3IgZGVlcC1saW5raW5nXG4vLyBpbnNpZGUgYW4gYXBwLCBzaW1pbGFyIHRvIHN0YXJ0aW5nIGFuIGludGVudFxuY29tbWFuZHMuc2V0VXJsID0gYXN5bmMgZnVuY3Rpb24gKHVyaSkge1xuICBhd2FpdCB0aGlzLmFkYi5zdGFydFVyaSh1cmksIHRoaXMub3B0cy5hcHBQYWNrYWdlKTtcbn07XG5cbi8vIGNsb3NpbmcgYXBwIHVzaW5nIGZvcmNlIHN0b3BcbmNvbW1hbmRzLmNsb3NlQXBwID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICBhd2FpdCB0aGlzLmFkYi5mb3JjZVN0b3AodGhpcy5vcHRzLmFwcFBhY2thZ2UpO1xufTtcblxuY29tbWFuZHMuZ2V0RGlzcGxheURlbnNpdHkgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIC8vIGZpcnN0IHRyeSB0aGUgcHJvcGVydHkgZm9yIGRldmljZXNcbiAgbGV0IG91dCA9IGF3YWl0IHRoaXMuYWRiLnNoZWxsKFsnZ2V0cHJvcCcsICdyby5zZi5sY2RfZGVuc2l0eSddKTtcbiAgaWYgKG91dCkge1xuICAgIGxldCB2YWwgPSBwYXJzZUludChvdXQsIDEwKTtcbiAgICAvLyBpZiB0aGUgdmFsdWUgaXMgTmFOLCB0cnkgZ2V0dGluZyB0aGUgZW11bGF0b3IgcHJvcGVydHlcbiAgICBpZiAoIWlzTmFOKHZhbCkpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIGxvZy5kZWJ1ZyhgUGFyc2VkIGRlbnNpdHkgdmFsdWUgd2FzIE5hTjogXCIke291dH1cImApO1xuICB9XG4gIC8vIGZhbGxiYWNrIHRvIHRyeWluZyBwcm9wZXJ0eSBmb3IgZW11bGF0b3JzXG4gIG91dCA9IGF3YWl0IHRoaXMuYWRiLnNoZWxsKFsnZ2V0cHJvcCcsICdxZW11LnNmLmxjZF9kZW5zaXR5J10pO1xuICBpZiAob3V0KSB7XG4gICAgbGV0IHZhbCA9IHBhcnNlSW50KG91dCwgMTApO1xuICAgIGlmICghaXNOYU4odmFsKSkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgbG9nLmRlYnVnKGBQYXJzZWQgZGVuc2l0eSB2YWx1ZSB3YXMgTmFOOiBcIiR7b3V0fVwiYCk7XG4gIH1cbiAgLy8gY291bGRuJ3QgZ2V0IGFueXRoaW5nLCBzbyBlcnJvciBvdXRcbiAgbG9nLmVycm9yQW5kVGhyb3coJ0ZhaWxlZCB0byBnZXQgZGlzcGxheSBkZW5zaXR5IHByb3BlcnR5LicpO1xufTtcblxuLyoqXG4gKiBQYXJzZXMgdGhlIGdpdmVuIHdpbmRvdyBtYW5hZ2VyIFN1cmZhY2Ugc3RyaW5nIHRvIGdldCBpbmZvLlxuICogQHBhcmFtIGxpbmU6IFRvIHBhcnNlLiBUaGlzIGlzIGFzc3VtZWQgdG8gYmUgdmFsaWQuXG4gKiBAcmV0dXJuOiBWaXNpYmlsaXR5IGFuZCBib3VuZHMgb2YgdGhlIFN1cmZhY2UuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlU3VyZmFjZUxpbmUgKGxpbmUpIHtcbiAgLy8gdGhlIHN1cmZhY2UgYm91bmRzIGFyZSBpbiB0aGUgZm9ybWF0OlxuICAvLyBcInJlY3Q9KDAuMCwxMTg0LjApIDc2OC4wIHggOTYuMFwiXG4gIC8vICAgICAgIF4gbG9jYXRpb24gICBeIHNpemVcbiAgLy8gY3V0IG91dCB0aGUgc3R1ZmYgYmVmb3JlIHRoZSAncmVjdCcgYW5kIHRoZW4gc3BsaXQgdGhlIG51bWJlcnMgYXBhcnRcbiAgbGV0IGJvdW5kcyA9IGxpbmUuc3BsaXQoJ3JlY3Q9JylbMV1cbiAgLnJlcGxhY2UoL1tcXChcXCksIHhdKy9nLCAnICcpXG4gIC50cmltKClcbiAgLnNwbGl0KCcgJyk7XG5cbiAgcmV0dXJuIHtcbiAgICB2aXNpYmxlOiAobGluZS5pbmRleE9mKCdzaG93bj10cnVlJykgIT09IC0xKSxcbiAgICB4OiBwYXJzZUZsb2F0KGJvdW5kc1swXSksXG4gICAgeTogcGFyc2VGbG9hdChib3VuZHNbMV0pLFxuICAgIHdpZHRoOiBwYXJzZUZsb2F0KGJvdW5kc1syXSksXG4gICAgaGVpZ2h0OiBwYXJzZUZsb2F0KGJvdW5kc1szXSlcbiAgfTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0cyBzdGF0dXMgYW5kIG5hdmlnYXRpb24gYmFyIGluZm9ybWF0aW9uIGZyb20gdGhlIHdpbmRvdyBtYW5hZ2VyIG91dHB1dC5cbiAqIEBwYXJhbSBsaW5lczogT3V0cHV0IGZyb20gZHVtcHN5cyBjb21tYW5kXG4gKiBAcmV0dXJuOiBWaXNpYmlsaXR5IGFuZCBib3VuZHMgaW5mbyBvZiBzdGF0dXMgYW5kIG5hdmlnYXRpb24gYmFyXG4gKi9cbmZ1bmN0aW9uIHBhcnNlV2luZG93cyAobGluZXMpIHtcbiAgbGV0IGF0U3RhdHVzQmFyID0gZmFsc2U7XG4gIGxldCBhdE5hdkJhciA9IGZhbHNlO1xuICBsZXQgc3RhdHVzQmFyO1xuICBsZXQgbmF2aWdhdGlvbkJhcjtcbiAgLy8gdGhlIHdpbmRvdyBtYW5hZ2VyIG91dHB1dCBsb29rcyBsaWtlOlxuICAvLyBXaW5kb3cgIzEgLi4uIFdpbmRvd0lEXG4gIC8vICAgQSBidW5jaCBvZiBwcm9wZXJ0aWVzXG4gIC8vIFdpbmRvdyAjMiAuLi4gV2luZG93SURcbiAgLy8gICBBIGJ1bmNoIG9mIHByb3BlcnRpZXNcbiAgbGluZXMuc3BsaXQoJ1xcbicpLmZvckVhY2goKGxpbmUpID0+IHtcbiAgICAvLyB0aGUgc3RhcnQgb2YgYSBuZXcgd2luZG93IHNlY3Rpb25cbiAgICBpZiAobGluZS5pbmRleE9mKCcgIFdpbmRvdyAjJykgIT09IC0xKSB7XG4gICAgICAvLyBkZXRlcm1pbmUgd2hpY2ggc2VjdGlvbiB3ZSdyZSBpblxuICAgICAgLy8gb25seSBvbmUgd2lsbCBiZSB0cnVlXG4gICAgICBhdFN0YXR1c0JhciA9IChsaW5lLmluZGV4T2YoJ1N0YXR1c0JhcicpICE9PSAtMSk7XG4gICAgICBhdE5hdkJhciA9IChsaW5lLmluZGV4T2YoJ05hdmlnYXRpb25CYXInKSAhPT0gLTEpO1xuICAgICAgLy8gZG9uJ3QgbmVlZCBhbnl0aGluZyBlbHNlLiBtb3ZlIHRvIG5leHQgbGluZVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBvbmNlIHdlJ3JlIGluIGEgd2luZG93IHNlY3Rpb24sIGxvb2sgZm9yIHRoZSBzdXJmYWNlIGRhdGEgbGluZVxuICAgIGlmIChsaW5lLmluZGV4T2YoJyAgICAgIFN1cmZhY2U6JykgPT09IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChhdFN0YXR1c0Jhcikge1xuICAgICAgc3RhdHVzQmFyID0gcGFyc2VTdXJmYWNlTGluZShsaW5lKTtcbiAgICAgIGF0U3RhdHVzQmFyID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChhdE5hdkJhcikge1xuICAgICAgbmF2aWdhdGlvbkJhciA9IHBhcnNlU3VyZmFjZUxpbmUobGluZSk7XG4gICAgICBhdE5hdkJhciA9IGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKCFzdGF0dXNCYXIpIHtcbiAgICBsb2cuZXJyb3JBbmRUaHJvdygnRmFpbGVkIHRvIHBhcnNlIHN0YXR1cyBiYXIgaW5mb3JtYXRpb24uJyk7XG4gIH1cbiAgaWYgKCFuYXZpZ2F0aW9uQmFyKSB7XG4gICAgbG9nLmVycm9yQW5kVGhyb3coJ0ZhaWxlZCB0byBwYXJzZSBuYXZpZ2F0aW9uIGJhciBpbmZvcm1hdGlvbi4nKTtcbiAgfVxuXG4gIHJldHVybiB7c3RhdHVzQmFyLCBuYXZpZ2F0aW9uQmFyfTtcbn1cblxuY29tbWFuZHMuZ2V0U3lzdGVtQmFycyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgbGV0IG91dCA9IGF3YWl0IHRoaXMuYWRiLnNoZWxsKFsnZHVtcHN5cycsICd3aW5kb3cnLCAnd2luZG93cyddKTtcbiAgaWYgKCFvdXQpIHtcbiAgICBsb2cuZXJyb3JBbmRUaHJvdygnRGlkIG5vdCBnZXQgd2luZG93IG1hbmFnZXIgb3V0cHV0LicpO1xuICB9XG4gIHJldHVybiBwYXJzZVdpbmRvd3Mob3V0KTtcbn07XG5cbk9iamVjdC5hc3NpZ24oZXh0ZW5zaW9ucywgY29tbWFuZHMsIGhlbHBlcnMpO1xuZXhwb3J0IHsgY29tbWFuZHMsIGhlbHBlcnMgfTtcbmV4cG9ydCBkZWZhdWx0IGV4dGVuc2lvbnM7XG4vLyBmb3IgdW5pdCB0ZXN0c1xuZXhwb3J0IHsgcGFyc2VXaW5kb3dzLCBwYXJzZVN1cmZhY2VMaW5lIH07XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uLy4uIn0=
