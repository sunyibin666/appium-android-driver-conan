'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _androidHelpers = require('../android-helpers');

var _androidHelpers2 = _interopRequireDefault(_androidHelpers);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _appiumSupport = require('appium-support');

var _admZip = require('adm-zip');

var _admZip2 = _interopRequireDefault(_admZip);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

var swipeStepsPerSec = 28;
var dragStepsPerSec = 40;

var commands = {},
    helpers = {},
    extensions = {};

commands.keyevent = function callee$0$0(keycode) {
  var metastate = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        // TODO deprecate keyevent; currently wd only implements keyevent
        _logger2['default'].warn("keyevent will be deprecated use pressKeyCode");
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.pressKeyCode(keycode, metastate));

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.pressKeyCode = function callee$0$0(keycode) {
  var metastate = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction("pressKeyCode", { keycode: keycode, metastate: metastate }));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.longPressKeyCode = function callee$0$0(keycode) {
  var metastate = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction("longPressKeyCode", { keycode: keycode, metastate: metastate }));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.getOrientation = function callee$0$0() {
  var orientation;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction("orientation", {}));

      case 2:
        orientation = context$1$0.sent;
        return context$1$0.abrupt('return', orientation.toUpperCase());

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.setOrientation = function callee$0$0(orientation) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        orientation = orientation.toUpperCase();
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction("orientation", { orientation: orientation }));

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.fakeFlick = function callee$0$0(xSpeed, ySpeed) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction('flick', { xSpeed: xSpeed, ySpeed: ySpeed }));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.fakeFlickElement = function callee$0$0(elementId, xoffset, yoffset, speed) {
  var params;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        params = { xoffset: xoffset, yoffset: yoffset, speed: speed, elementId: elementId };
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction('element:flick', params));

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.swipe = function callee$0$0(startX, startY, endX, endY, duration, touchCount, elId) {
  var swipeOpts;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (startX === 'null') {
          startX = 0.5;
        }
        if (startY === 'null') {
          startY = 0.5;
        }
        swipeOpts = { startX: startX, startY: startY, endX: endX, endY: endY,
          steps: Math.round(duration * swipeStepsPerSec) };

        // going the long way and checking for undefined and null since
        // we can't be assured `elId` is a string and not an int
        if (_appiumSupport.util.hasValue(elId)) {
          swipeOpts.elementId = elId;
        }
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(this.doSwipe(swipeOpts));

      case 6:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.doSwipe = function callee$0$0(swipeOpts) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!_appiumSupport.util.hasValue(swipeOpts.elementId)) {
          context$1$0.next = 6;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction("element:swipe", swipeOpts));

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction("swipe", swipeOpts));

      case 8:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.pinchClose = function callee$0$0(startX, startY, endX, endY, duration, percent, steps, elId) {
  var pinchOpts;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        pinchOpts = {
          direction: 'in',
          elementId: elId,
          percent: percent,
          steps: steps
        };
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction("element:pinch", pinchOpts));

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.pinchOpen = function callee$0$0(startX, startY, endX, endY, duration, percent, steps, elId) {
  var pinchOpts;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        pinchOpts = { direction: 'out', elementId: elId, percent: percent, steps: steps };
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction("element:pinch", pinchOpts));

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.flick = function callee$0$0(element, xSpeed, ySpeed, xOffset, yOffset, speed) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!element) {
          context$1$0.next = 5;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.fakeFlickElement(element, xOffset, yOffset, speed));

      case 3:
        context$1$0.next = 7;
        break;

      case 5:
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(this.fakeFlick(xSpeed, ySpeed));

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.drag = function callee$0$0(startX, startY, endX, endY, duration, touchCount, elementId, destElId) {
  var dragOpts;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        dragOpts = {
          elementId: elementId, destElId: destElId, startX: startX, startY: startY, endX: endX, endY: endY,
          steps: Math.round(duration * dragStepsPerSec)
        };
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.doDrag(dragOpts));

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.doDrag = function callee$0$0(dragOpts) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!_appiumSupport.util.hasValue(dragOpts.elementId)) {
          context$1$0.next = 6;
          break;
        }

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction("element:drag", dragOpts));

      case 3:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction("drag", dragOpts));

      case 8:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.lock = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.lock());

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.isLocked = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.isScreenLocked());

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.unlock = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_androidHelpers2['default'].unlock(this.adb));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.openNotifications = function callee$0$0() {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.bootstrap.sendAction("openNotification"));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.setLocation = function callee$0$0(latitude, longitude) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.sendTelnetCommand('geo fix ' + longitude + ' ' + latitude));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.pullFile = function callee$0$0(remotePath) {
  var localFile, data, b64data;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        localFile = _temp2['default'].path({ prefix: 'appium', suffix: '.tmp' });
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.adb.pull(remotePath, localFile));

      case 3:
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.readFile(localFile));

      case 5:
        data = context$1$0.sent;
        b64data = new Buffer(data).toString('base64');
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(localFile));

      case 9:
        if (!context$1$0.sent) {
          context$1$0.next = 12;
          break;
        }

        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.unlink(localFile));

      case 12:
        return context$1$0.abrupt('return', b64data);

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.pushFile = function callee$0$0(remotePath, base64Data) {
  var localFile, content, fd;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        localFile = _temp2['default'].path({ prefix: 'appium', suffix: '.tmp' });
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap((0, _appiumSupport.mkdirp)(_path2['default'].dirname(localFile)));

      case 3:
        content = new Buffer(base64Data, 'base64');
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.open(localFile, 'w'));

      case 6:
        fd = context$1$0.sent;
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.write(fd, content, 0, content.length, 0));

      case 9:
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.close(fd));

      case 11:
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(this.adb.push(localFile, remotePath));

      case 13:
        context$1$0.next = 15;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(localFile));

      case 15:
        if (!context$1$0.sent) {
          context$1$0.next = 18;
          break;
        }

        context$1$0.next = 18;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.unlink(localFile));

      case 18:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.pullFolder = function callee$0$0(remotePath) {
  var localFolder, zip;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        localFolder = _temp2['default'].path({ prefix: 'appium' });
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(this.adb.pull(remotePath, localFolder));

      case 3:
        zip = new _admZip2['default']();

        zip.addLocalFolder(localFolder);
        return context$1$0.abrupt('return', new _Promise(function (resolve, reject) {
          zip.toBuffer(function (buffer) {
            _logger2['default'].debug('Converting in-memory zip file to base64 encoded string');
            resolve(buffer.toString('base64'));
          }, function (err) {
            reject(err);
          });
        }));

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.fingerprint = function callee$0$0(fingerprintId) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(this.adb.fingerprint(fingerprintId));

      case 2:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

commands.getScreenshot = function callee$0$0() {
  var localFile, pngDir, png, cmd, image, screenOrientation, b64data;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        localFile = _temp2['default'].path({ prefix: 'appium', suffix: '.png' });
        pngDir = this.opts.androidScreenshotPath || '/data/local/tmp/';
        png = _path2['default'].posix.resolve(pngDir, 'screenshot.png');
        cmd = ['/system/bin/rm', png + ';', '/system/bin/screencap', '-p', png];
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(this.adb.shell(cmd));

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(localFile));

      case 8:
        if (!context$1$0.sent) {
          context$1$0.next = 11;
          break;
        }

        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.unlink(localFile));

      case 11:
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(this.adb.pull(png, localFile));

      case 13:
        context$1$0.next = 15;
        return _regeneratorRuntime.awrap(_jimp2['default'].read(localFile));

      case 15:
        image = context$1$0.sent;
        context$1$0.next = 18;
        return _regeneratorRuntime.awrap(this.adb.getApiLevel());

      case 18:
        context$1$0.t0 = context$1$0.sent;

        if (!(context$1$0.t0 < 23)) {
          context$1$0.next = 32;
          break;
        }

        context$1$0.next = 22;
        return _regeneratorRuntime.awrap(this.adb.getScreenOrientation());

      case 22:
        screenOrientation = context$1$0.sent;
        context$1$0.prev = 23;
        context$1$0.next = 26;
        return _regeneratorRuntime.awrap(image.rotate(-90 * screenOrientation));

      case 26:
        image = context$1$0.sent;
        context$1$0.next = 32;
        break;

      case 29:
        context$1$0.prev = 29;
        context$1$0.t1 = context$1$0['catch'](23);

        _logger2['default'].warn('Could not rotate screenshot due to error: ' + context$1$0.t1);

      case 32:
        context$1$0.next = 34;
        return _regeneratorRuntime.awrap(_bluebird2['default'].promisify(image.getBuffer).call(image, _jimp2['default'].MIME_PNG));

      case 34:
        b64data = context$1$0.sent.toString('base64');
        context$1$0.next = 37;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.unlink(localFile));

      case 37:
        return context$1$0.abrupt('return', b64data);

      case 38:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[23, 29]]);
};

_Object$assign(extensions, commands, helpers);
exports.commands = commands;
exports.helpers = helpers;
exports['default'] = extensions;

// adb push creates folders and overwrites existing files.

// TODO: find a better alternative to the AdmZip module

// Android bug 8433742 - rotate screenshot if screen is rotated
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9hY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OzhCQUEyQixvQkFBb0I7Ozs7b0JBQzlCLE1BQU07Ozs7NkJBQ1UsZ0JBQWdCOztzQkFDOUIsU0FBUzs7OztvQkFDWCxNQUFNOzs7O3NCQUNQLFdBQVc7Ozs7d0JBQ2IsVUFBVTs7OztvQkFDUCxNQUFNOzs7O0FBRXZCLElBQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLElBQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQzs7QUFFM0IsSUFBSSxRQUFRLEdBQUcsRUFBRTtJQUFFLE9BQU8sR0FBRyxFQUFFO0lBQUUsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFakQsUUFBUSxDQUFDLFFBQVEsR0FBRyxvQkFBZ0IsT0FBTztNQUFFLFNBQVMseURBQUcsSUFBSTs7Ozs7QUFFM0QsNEJBQUksSUFBSSxDQUFDLDhDQUE4QyxDQUFDLENBQUM7O3lDQUM1QyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUM7Ozs7Ozs7Ozs7Q0FDbkQsQ0FBQzs7QUFFRixRQUFRLENBQUMsWUFBWSxHQUFHLG9CQUFnQixPQUFPO01BQUUsU0FBUyx5REFBRyxJQUFJOzs7Ozt5Q0FDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLEVBQUMsT0FBTyxFQUFQLE9BQU8sRUFBRSxTQUFTLEVBQVQsU0FBUyxFQUFDLENBQUM7Ozs7Ozs7Ozs7Q0FDN0UsQ0FBQzs7QUFFRixRQUFRLENBQUMsZ0JBQWdCLEdBQUcsb0JBQWdCLE9BQU87TUFBRSxTQUFTLHlEQUFHLElBQUk7Ozs7O3lDQUN0RCxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFDLE9BQU8sRUFBUCxPQUFPLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBQyxDQUFDOzs7Ozs7Ozs7O0NBQ2pGLENBQUM7O0FBRUYsUUFBUSxDQUFDLGNBQWMsR0FB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LGdCQUFnQixDQUFDO0FBQ3BELFdBQUcsR0FBSSxDQUFDLGdCQUFnQixFQUFLLEdBQUcsUUFBSyx1QkFBdUIsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDOzt5Q0FDdEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDOzs7O3lDQUNmLGtCQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7Ozs7Ozs7Ozt5Q0FDdEIsa0JBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQzs7Ozt5Q0FFdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQzs7Ozt5Q0FDakIsa0JBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQzs7O0FBQWxDLGFBQUs7O3lDQUNDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFOzs7OzsrQkFBRyxFQUFFOzs7Ozs7eUNBRUwsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRTs7O0FBQXpELHlCQUFpQjs7O3lDQUVMLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsaUJBQWlCLENBQUM7OztBQUFuRCxhQUFLOzs7Ozs7OztBQUVMLDRCQUFJLElBQUksK0RBQW9ELENBQUM7Ozs7eUNBRzVDLHNCQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxrQkFBSyxRQUFRLENBQUM7OztBQUF4RSxlQUFPLG9CQUNJLFFBQVEsQ0FBQyxRQUFROzt5Q0FDMUIsa0JBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQzs7OzRDQUNuQixPQUFPOzs7Ozs7O0NBQ2YsQ0FBQzs7QUFHRixlQUFjLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEMsUUFBUSxHQUFSLFFBQVE7UUFBRSxPQUFPLEdBQVAsT0FBTztxQkFDWCxVQUFVIiwiZmlsZSI6ImxpYi9jb21tYW5kcy9hY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFuZHJvaWRIZWxwZXJzIGZyb20gJy4uL2FuZHJvaWQtaGVscGVycyc7XG5pbXBvcnQgdGVtcCBmcm9tICd0ZW1wJztcbmltcG9ydCB7IGZzLCBta2RpcnAsIHV0aWwgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5pbXBvcnQgQWRtWmlwIGZyb20gJ2FkbS16aXAnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgbG9nIGZyb20gJy4uL2xvZ2dlcic7XG5pbXBvcnQgQiBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgamltcCBmcm9tICdqaW1wJztcblxuY29uc3Qgc3dpcGVTdGVwc1BlclNlYyA9IDI4O1xuY29uc3QgZHJhZ1N0ZXBzUGVyU2VjID0gNDA7XG5cbmxldCBjb21tYW5kcyA9IHt9LCBoZWxwZXJzID0ge30sIGV4dGVuc2lvbnMgPSB7fTtcblxuY29tbWFuZHMua2V5ZXZlbnQgPSBhc3luYyBmdW5jdGlvbiAoa2V5Y29kZSwgbWV0YXN0YXRlID0gbnVsbCkge1xuICAvLyBUT0RPIGRlcHJlY2F0ZSBrZXlldmVudDsgY3VycmVudGx5IHdkIG9ubHkgaW1wbGVtZW50cyBrZXlldmVudFxuICBsb2cud2FybihcImtleWV2ZW50IHdpbGwgYmUgZGVwcmVjYXRlZCB1c2UgcHJlc3NLZXlDb2RlXCIpO1xuICByZXR1cm4gYXdhaXQgdGhpcy5wcmVzc0tleUNvZGUoa2V5Y29kZSwgbWV0YXN0YXRlKTtcbn07XG5cbmNvbW1hbmRzLnByZXNzS2V5Q29kZSA9IGFzeW5jIGZ1bmN0aW9uIChrZXljb2RlLCBtZXRhc3RhdGUgPSBudWxsKSB7XG4gIHJldHVybiBhd2FpdCB0aGlzLmJvb3RzdHJhcC5zZW5kQWN0aW9uKFwicHJlc3NLZXlDb2RlXCIsIHtrZXljb2RlLCBtZXRhc3RhdGV9KTtcbn07XG5cbmNvbW1hbmRzLmxvbmdQcmVzc0tleUNvZGUgPSBhc3luYyBmdW5jdGlvbiAoa2V5Y29kZSwgbWV0YXN0YXRlID0gbnVsbCkge1xuICByZXR1cm4gYXdhaXQgdGhpcy5ib290c3RyYXAuc2VuZEFjdGlvbihcImxvbmdQcmVzc0tleUNvZGVcIiwge2tleWNvZGUsIG1ldGFzdGF0ZX0pO1xufTtcblxuY29tbWFuZHMuZ2V0T3JpZW50YXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGxldCBvcmllbnRhdGlvbiA9IGF3YWl0IHRoaXMuYm9vdHN0cmFwLnNlbmRBY3Rpb24oXCJvcmllbnRhdGlvblwiLCB7fSk7XG4gIHJldHVybiBvcmllbnRhdGlvbi50b1VwcGVyQ2FzZSgpO1xufTtcblxuY29tbWFuZHMuc2V0T3JpZW50YXRpb24gPSBhc3luYyBmdW5jdGlvbiAob3JpZW50YXRpb24pIHtcbiAgb3JpZW50YXRpb24gPSBvcmllbnRhdGlvbi50b1VwcGVyQ2FzZSgpO1xuICByZXR1cm4gYXdhaXQgdGhpcy5ib290c3RyYXAuc2VuZEFjdGlvbihcIm9yaWVudGF0aW9uXCIsIHtvcmllbnRhdGlvbn0pO1xufTtcblxuY29tbWFuZHMuZmFrZUZsaWNrID0gYXN5bmMgZnVuY3Rpb24gKHhTcGVlZCwgeVNwZWVkKSB7XG4gIHJldHVybiBhd2FpdCB0aGlzLmJvb3RzdHJhcC5zZW5kQWN0aW9uKCdmbGljaycsIHt4U3BlZWQsIHlTcGVlZH0pO1xufTtcblxuY29tbWFuZHMuZmFrZUZsaWNrRWxlbWVudCA9IGFzeW5jIGZ1bmN0aW9uIChlbGVtZW50SWQsIHhvZmZzZXQsIHlvZmZzZXQsIHNwZWVkKSB7XG4gIGxldCBwYXJhbXMgPSB7eG9mZnNldCwgeW9mZnNldCwgc3BlZWQsIGVsZW1lbnRJZH07XG4gIHJldHVybiBhd2FpdCB0aGlzLmJvb3RzdHJhcC5zZW5kQWN0aW9uKCdlbGVtZW50OmZsaWNrJywgcGFyYW1zKTtcbn07XG5cbmNvbW1hbmRzLnN3aXBlID0gYXN5bmMgZnVuY3Rpb24gKHN0YXJ0WCwgc3RhcnRZLCBlbmRYLCBlbmRZLCBkdXJhdGlvbiwgdG91Y2hDb3VudCwgZWxJZCkge1xuICBpZiAoc3RhcnRYID09PSAnbnVsbCcpIHtcbiAgICBzdGFydFggPSAwLjU7XG4gIH1cbiAgaWYgKHN0YXJ0WSA9PT0gJ251bGwnKSB7XG4gICAgc3RhcnRZID0gMC41O1xuICB9XG4gIGxldCBzd2lwZU9wdHMgPSB7c3RhcnRYLCBzdGFydFksIGVuZFgsIGVuZFksXG4gICAgICAgICAgICAgICAgICAgc3RlcHM6IE1hdGgucm91bmQoZHVyYXRpb24gKiBzd2lwZVN0ZXBzUGVyU2VjKX07XG4gIC8vIGdvaW5nIHRoZSBsb25nIHdheSBhbmQgY2hlY2tpbmcgZm9yIHVuZGVmaW5lZCBhbmQgbnVsbCBzaW5jZVxuICAvLyB3ZSBjYW4ndCBiZSBhc3N1cmVkIGBlbElkYCBpcyBhIHN0cmluZyBhbmQgbm90IGFuIGludFxuICBpZiAodXRpbC5oYXNWYWx1ZShlbElkKSkge1xuICAgIHN3aXBlT3B0cy5lbGVtZW50SWQgPSBlbElkO1xuICB9XG4gIHJldHVybiBhd2FpdCB0aGlzLmRvU3dpcGUoc3dpcGVPcHRzKTtcbn07XG5cbmNvbW1hbmRzLmRvU3dpcGUgPSBhc3luYyBmdW5jdGlvbihzd2lwZU9wdHMpIHtcbiAgaWYgKHV0aWwuaGFzVmFsdWUoc3dpcGVPcHRzLmVsZW1lbnRJZCkpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5ib290c3RyYXAuc2VuZEFjdGlvbihcImVsZW1lbnQ6c3dpcGVcIiwgc3dpcGVPcHRzKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5ib290c3RyYXAuc2VuZEFjdGlvbihcInN3aXBlXCIsIHN3aXBlT3B0cyk7XG4gIH1cbn07XG5cbmNvbW1hbmRzLnBpbmNoQ2xvc2UgPSBhc3luYyBmdW5jdGlvbiAoc3RhcnRYLCBzdGFydFksIGVuZFgsIGVuZFksIGR1cmF0aW9uLCBwZXJjZW50LCBzdGVwcywgZWxJZCkge1xuICBsZXQgcGluY2hPcHRzID0ge1xuICAgIGRpcmVjdGlvbjogJ2luJyxcbiAgICBlbGVtZW50SWQ6IGVsSWQsXG4gICAgcGVyY2VudCxcbiAgICBzdGVwc1xuICB9O1xuICByZXR1cm4gYXdhaXQgdGhpcy5ib290c3RyYXAuc2VuZEFjdGlvbihcImVsZW1lbnQ6cGluY2hcIiwgcGluY2hPcHRzKTtcbn07XG5cbmNvbW1hbmRzLnBpbmNoT3BlbiA9IGFzeW5jIGZ1bmN0aW9uIChzdGFydFgsIHN0YXJ0WSwgZW5kWCwgZW5kWSwgZHVyYXRpb24sIHBlcmNlbnQsIHN0ZXBzLCBlbElkKSB7XG4gIGxldCBwaW5jaE9wdHMgPSB7ZGlyZWN0aW9uOiAnb3V0JywgZWxlbWVudElkOiBlbElkLCBwZXJjZW50LCBzdGVwc307XG4gIHJldHVybiBhd2FpdCB0aGlzLmJvb3RzdHJhcC5zZW5kQWN0aW9uKFwiZWxlbWVudDpwaW5jaFwiLCBwaW5jaE9wdHMpO1xufTtcblxuY29tbWFuZHMuZmxpY2sgPSBhc3luYyBmdW5jdGlvbiAoZWxlbWVudCwgeFNwZWVkLCB5U3BlZWQsIHhPZmZzZXQsIHlPZmZzZXQsIHNwZWVkKSB7XG4gIGlmIChlbGVtZW50KSB7XG4gICAgYXdhaXQgdGhpcy5mYWtlRmxpY2tFbGVtZW50KGVsZW1lbnQsIHhPZmZzZXQsIHlPZmZzZXQsIHNwZWVkKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCB0aGlzLmZha2VGbGljayh4U3BlZWQsIHlTcGVlZCk7XG4gIH1cbn07XG5cbmNvbW1hbmRzLmRyYWcgPSBhc3luYyBmdW5jdGlvbiAoc3RhcnRYLCBzdGFydFksIGVuZFgsIGVuZFksIGR1cmF0aW9uLCB0b3VjaENvdW50LCBlbGVtZW50SWQsIGRlc3RFbElkKSB7XG4gIGxldCBkcmFnT3B0cyA9IHtcbiAgICBlbGVtZW50SWQsIGRlc3RFbElkLCBzdGFydFgsIHN0YXJ0WSwgZW5kWCwgZW5kWSxcbiAgICBzdGVwczogTWF0aC5yb3VuZChkdXJhdGlvbiAqIGRyYWdTdGVwc1BlclNlYylcbiAgfTtcbiAgcmV0dXJuIGF3YWl0IHRoaXMuZG9EcmFnKGRyYWdPcHRzKTtcblxufTtcblxuY29tbWFuZHMuZG9EcmFnID0gYXN5bmMgZnVuY3Rpb24gKGRyYWdPcHRzKSB7XG4gIGlmICh1dGlsLmhhc1ZhbHVlKGRyYWdPcHRzLmVsZW1lbnRJZCkpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5ib290c3RyYXAuc2VuZEFjdGlvbihcImVsZW1lbnQ6ZHJhZ1wiLCBkcmFnT3B0cyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuYm9vdHN0cmFwLnNlbmRBY3Rpb24oXCJkcmFnXCIsIGRyYWdPcHRzKTtcbiAgfVxufTtcblxuY29tbWFuZHMubG9jayA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGF3YWl0IHRoaXMuYWRiLmxvY2soKTtcbn07XG5cbmNvbW1hbmRzLmlzTG9ja2VkID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gYXdhaXQgdGhpcy5hZGIuaXNTY3JlZW5Mb2NrZWQoKTtcbn07XG5cbmNvbW1hbmRzLnVubG9jayA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGF3YWl0IGFuZHJvaWRIZWxwZXJzLnVubG9jayh0aGlzLmFkYik7XG59O1xuXG5jb21tYW5kcy5vcGVuTm90aWZpY2F0aW9ucyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGF3YWl0IHRoaXMuYm9vdHN0cmFwLnNlbmRBY3Rpb24oXCJvcGVuTm90aWZpY2F0aW9uXCIpO1xufTtcblxuY29tbWFuZHMuc2V0TG9jYXRpb24gPSBhc3luYyBmdW5jdGlvbiAobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICByZXR1cm4gYXdhaXQgdGhpcy5hZGIuc2VuZFRlbG5ldENvbW1hbmQoYGdlbyBmaXggJHtsb25naXR1ZGV9ICR7bGF0aXR1ZGV9YCk7XG59O1xuXG5jb21tYW5kcy5wdWxsRmlsZSA9IGFzeW5jIGZ1bmN0aW9uIChyZW1vdGVQYXRoKSB7XG4gIGxldCBsb2NhbEZpbGUgPSB0ZW1wLnBhdGgoe3ByZWZpeDogJ2FwcGl1bScsIHN1ZmZpeDogJy50bXAnfSk7XG4gIGF3YWl0IHRoaXMuYWRiLnB1bGwocmVtb3RlUGF0aCwgbG9jYWxGaWxlKTtcbiAgbGV0IGRhdGEgPSBhd2FpdCBmcy5yZWFkRmlsZShsb2NhbEZpbGUpO1xuICBsZXQgYjY0ZGF0YSA9IG5ldyBCdWZmZXIoZGF0YSkudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICBpZiAoYXdhaXQgZnMuZXhpc3RzKGxvY2FsRmlsZSkpIHtcbiAgICBhd2FpdCBmcy51bmxpbmsobG9jYWxGaWxlKTtcbiAgfVxuICByZXR1cm4gYjY0ZGF0YTtcbn07XG5cbmNvbW1hbmRzLnB1c2hGaWxlID0gYXN5bmMgZnVuY3Rpb24gKHJlbW90ZVBhdGgsIGJhc2U2NERhdGEpIHtcbiAgbGV0IGxvY2FsRmlsZSA9IHRlbXAucGF0aCh7cHJlZml4OiAnYXBwaXVtJywgc3VmZml4OiAnLnRtcCd9KTtcbiAgYXdhaXQgbWtkaXJwKHBhdGguZGlybmFtZShsb2NhbEZpbGUpKTtcbiAgbGV0IGNvbnRlbnQgPSBuZXcgQnVmZmVyKGJhc2U2NERhdGEsICdiYXNlNjQnKTtcbiAgbGV0IGZkID0gYXdhaXQgZnMub3Blbihsb2NhbEZpbGUsICd3Jyk7XG4gIGF3YWl0IGZzLndyaXRlKGZkLCBjb250ZW50LCAwLCBjb250ZW50Lmxlbmd0aCwgMCk7XG4gIGF3YWl0IGZzLmNsb3NlKGZkKTtcblxuICAvLyBhZGIgcHVzaCBjcmVhdGVzIGZvbGRlcnMgYW5kIG92ZXJ3cml0ZXMgZXhpc3RpbmcgZmlsZXMuXG4gIGF3YWl0IHRoaXMuYWRiLnB1c2gobG9jYWxGaWxlLCByZW1vdGVQYXRoKTtcbiAgaWYgKGF3YWl0IGZzLmV4aXN0cyhsb2NhbEZpbGUpKSB7XG4gICAgYXdhaXQgZnMudW5saW5rKGxvY2FsRmlsZSk7XG4gIH1cbn07XG5cbmNvbW1hbmRzLnB1bGxGb2xkZXIgPSBhc3luYyBmdW5jdGlvbiAocmVtb3RlUGF0aCkge1xuICBsZXQgbG9jYWxGb2xkZXIgPSB0ZW1wLnBhdGgoe3ByZWZpeDogJ2FwcGl1bSd9KTtcbiAgYXdhaXQgdGhpcy5hZGIucHVsbChyZW1vdGVQYXRoLCBsb2NhbEZvbGRlcik7XG4gIC8vIFRPRE86IGZpbmQgYSBiZXR0ZXIgYWx0ZXJuYXRpdmUgdG8gdGhlIEFkbVppcCBtb2R1bGVcbiAgbGV0IHppcCA9IG5ldyBBZG1aaXAoKTtcbiAgemlwLmFkZExvY2FsRm9sZGVyKGxvY2FsRm9sZGVyKTtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB6aXAudG9CdWZmZXIoKGJ1ZmZlcikgPT4ge1xuICAgICAgbG9nLmRlYnVnKCdDb252ZXJ0aW5nIGluLW1lbW9yeSB6aXAgZmlsZSB0byBiYXNlNjQgZW5jb2RlZCBzdHJpbmcnKTtcbiAgICAgIHJlc29sdmUoYnVmZmVyLnRvU3RyaW5nKCdiYXNlNjQnKSk7XG4gICAgfSwgKGVycikgPT4ge1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuY29tbWFuZHMuZmluZ2VycHJpbnQgPSBhc3luYyBmdW5jdGlvbiAoZmluZ2VycHJpbnRJZCkge1xuICBhd2FpdCB0aGlzLmFkYi5maW5nZXJwcmludChmaW5nZXJwcmludElkKTtcbn07XG5cbmNvbW1hbmRzLmdldFNjcmVlbnNob3QgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGxldCBsb2NhbEZpbGUgPSB0ZW1wLnBhdGgoe3ByZWZpeDogJ2FwcGl1bScsIHN1ZmZpeDogJy5wbmcnfSk7XG4gIGxldCBwbmdEaXIgPSB0aGlzLm9wdHMuYW5kcm9pZFNjcmVlbnNob3RQYXRoIHx8ICcvZGF0YS9sb2NhbC90bXAvJztcbiAgY29uc3QgcG5nID0gcGF0aC5wb3NpeC5yZXNvbHZlKHBuZ0RpciwgJ3NjcmVlbnNob3QucG5nJyk7XG4gIGxldCBjbWQgPSAgWycvc3lzdGVtL2Jpbi9ybScsIGAke3BuZ307YCwgJy9zeXN0ZW0vYmluL3NjcmVlbmNhcCcsICctcCcsIHBuZ107XG4gIGF3YWl0IHRoaXMuYWRiLnNoZWxsKGNtZCk7XG4gIGlmIChhd2FpdCBmcy5leGlzdHMobG9jYWxGaWxlKSkge1xuICAgIGF3YWl0IGZzLnVubGluayhsb2NhbEZpbGUpO1xuICB9XG4gIGF3YWl0IHRoaXMuYWRiLnB1bGwocG5nLCBsb2NhbEZpbGUpO1xuICBsZXQgaW1hZ2UgPSBhd2FpdCBqaW1wLnJlYWQobG9jYWxGaWxlKTtcbiAgaWYgKGF3YWl0IHRoaXMuYWRiLmdldEFwaUxldmVsKCkgPCAyMykge1xuICAgIC8vIEFuZHJvaWQgYnVnIDg0MzM3NDIgLSByb3RhdGUgc2NyZWVuc2hvdCBpZiBzY3JlZW4gaXMgcm90YXRlZFxuICAgIGxldCBzY3JlZW5PcmllbnRhdGlvbiA9IGF3YWl0IHRoaXMuYWRiLmdldFNjcmVlbk9yaWVudGF0aW9uKCk7XG4gICAgdHJ5IHtcbiAgICAgIGltYWdlID0gYXdhaXQgaW1hZ2Uucm90YXRlKC05MCAqIHNjcmVlbk9yaWVudGF0aW9uKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxvZy53YXJuKGBDb3VsZCBub3Qgcm90YXRlIHNjcmVlbnNob3QgZHVlIHRvIGVycm9yOiAke2Vycn1gKTtcbiAgICB9XG4gIH1cbiAgbGV0IGI2NGRhdGEgPSAoYXdhaXQgQi5wcm9taXNpZnkoaW1hZ2UuZ2V0QnVmZmVyKS5jYWxsKGltYWdlLCBqaW1wLk1JTUVfUE5HKSlcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICBhd2FpdCBmcy51bmxpbmsobG9jYWxGaWxlKTtcbiAgcmV0dXJuIGI2NGRhdGE7XG59O1xuXG5cbk9iamVjdC5hc3NpZ24oZXh0ZW5zaW9ucywgY29tbWFuZHMsIGhlbHBlcnMpO1xuZXhwb3J0IHsgY29tbWFuZHMsIGhlbHBlcnMgfTtcbmV4cG9ydCBkZWZhdWx0IGV4dGVuc2lvbnM7XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uLy4uIn0=
