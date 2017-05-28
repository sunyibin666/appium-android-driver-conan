'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this2 = this;

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _libLogger = require('../../lib/logger');

var _libLogger2 = _interopRequireDefault(_libLogger);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _libAndroidHelpers = require('../../lib/android-helpers');

var _libAndroidHelpers2 = _interopRequireDefault(_libAndroidHelpers);

var _ = require('../..');

var _2 = _interopRequireDefault(_);

var _appiumAdb = require('appium-adb');

var _appiumAdb2 = _interopRequireDefault(_appiumAdb);

var _appiumBaseDriver = require('appium-base-driver');

var driver = undefined;
var sandbox = _sinon2['default'].sandbox.create();
var expect = _chai2['default'].expect;
_chai2['default'].should();
_chai2['default'].use(_chaiAsPromised2['default']);

describe('driver', function () {
  describe('constructor', function () {
    it('should call BaseDriver constructor with opts', function () {
      var driver = new _2['default']({ foo: 'bar' });
      driver.should.exist;
      driver.opts.foo.should.equal('bar');
    });
    it('should have this.findElOrEls', function () {
      var driver = new _2['default']({ foo: 'bar' });
      driver.findElOrEls.should.exist;
      driver.findElOrEls.should.be.a('function');
    });
  });
  describe('createSession', function () {
    beforeEach(function () {
      driver = new _2['default']();
      sandbox.stub(driver, 'checkAppPresent');
      sandbox.stub(driver, 'checkPackagePresent');
      sandbox.stub(driver, 'startAndroidSession');
      sandbox.stub(_appiumAdb2['default'], 'createADB', function callee$3$0(opts) {
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          var _this = this;

          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              return context$4$0.abrupt('return', {
                getDevicesWithRetry: function getDevicesWithRetry() {
                  return _regeneratorRuntime.async(function getDevicesWithRetry$(context$5$0) {
                    while (1) switch (context$5$0.prev = context$5$0.next) {
                      case 0:
                        return context$5$0.abrupt('return', [{ udid: 'emulator-1234' }, { udid: 'rotalume-1337' }]);

                      case 1:
                      case 'end':
                        return context$5$0.stop();
                    }
                  }, null, _this);
                },
                getPortFromEmulatorString: function getPortFromEmulatorString() {
                  return 1234;
                },
                setDeviceId: function setDeviceId() {},
                setEmulatorPort: function setEmulatorPort() {},
                adbPort: opts.adbPort
              });

            case 1:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this2);
      });
    });
    afterEach(function () {
      sandbox.restore();
    });
    it('should get java version if none is provided', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.createSession({ platformName: 'Android', deviceName: 'device', app: '/path/to/some.apk' }));

          case 2:
            driver.opts.javaVersion.should.exist;

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should get browser package details if browserName is provided', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            sandbox.spy(_libAndroidHelpers2['default'], 'getChromePkg');
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver.createSession({ platformName: 'Android', deviceName: 'device', browserName: 'Chrome' }));

          case 3:
            _libAndroidHelpers2['default'].getChromePkg.calledOnce.should.be['true'];

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should check an app is present', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.createSession({ platformName: 'Android', deviceName: 'device', app: '/path/to/some.apk' }));

          case 2:
            driver.checkAppPresent.calledOnce.should.be['true'];

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should check a package is present', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.createSession({ platformName: 'Android', deviceName: 'device', appPackage: 'some.app.package' }));

          case 2:
            driver.checkPackagePresent.calledOnce.should.be['true'];

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should accept a package via the app capability', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.createSession({ platformName: 'Android', deviceName: 'device', app: 'some.app.package' }));

          case 2:
            driver.checkPackagePresent.calledOnce.should.be['true'];

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should add server details to caps', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.createSession({ platformName: 'Android', deviceName: 'device', appPackage: 'some.app.package' }));

          case 2:
            driver.caps.webStorageEnabled.should.exist;

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should delete a session on failure', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            // Force an error to make sure deleteSession gets called
            sandbox.stub(_libAndroidHelpers2['default'], 'getJavaVersion').throws();
            sandbox.stub(driver, 'deleteSession');
            context$3$0.prev = 2;
            context$3$0.next = 5;
            return _regeneratorRuntime.awrap(driver.createSession({ platformName: 'Android', deviceName: 'device', appPackage: 'some.app.package' }));

          case 5:
            context$3$0.next = 9;
            break;

          case 7:
            context$3$0.prev = 7;
            context$3$0.t0 = context$3$0['catch'](2);

          case 9:
            driver.deleteSession.calledOnce.should.be['true'];

          case 10:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2, [[2, 7]]);
    });
    it('should pass along adbPort capability to ADB', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.createSession({ platformName: 'Android', deviceName: 'device', appPackage: 'some.app.package', adbPort: 1111 }));

          case 2:
            driver.adb.adbPort.should.equal(1111);

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should proxy screenshot if nativeWebScreenshot is off', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.createSession({ platformName: 'Android', deviceName: 'device', browserName: 'chrome', nativeWebScreenshot: false }));

          case 2:
            driver.getProxyAvoidList().should.have.length(8);

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should not proxy screenshot if nativeWebScreenshot is on', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.createSession({ platformName: 'Android', deviceName: 'device', browserName: 'chrome', nativeWebScreenshot: true }));

          case 2:
            driver.getProxyAvoidList().should.have.length(9);

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
  });
  describe('deleteSession', function () {
    beforeEach(function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver = new _2['default']();
            driver.adb = new _appiumAdb2['default']();
            driver.bootstrap = new _libAndroidHelpers2['default'].bootstrap(driver.adb);
            sandbox.stub(driver, 'stopChromedriverProxies');
            sandbox.stub(driver.adb, 'setIME');
            sandbox.stub(driver.adb, 'forceStop');
            sandbox.stub(driver.adb, 'goToHome');
            sandbox.stub(driver.adb, 'uninstallApk');
            sandbox.stub(driver.adb, 'stopLogcat');
            sandbox.stub(driver.bootstrap, 'shutdown');
            sandbox.spy(_libLogger2['default'], 'debug');

          case 11:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    afterEach(function () {
      sandbox.restore();
    });
    it('should not do anything if Android Driver has already shut down', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver.bootstrap = null;
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver.deleteSession());

          case 3:
            _libLogger2['default'].debug.callCount.should.eql(3);
            driver.stopChromedriverProxies.called.should.be['false'];
            driver.adb.stopLogcat.called.should.be['true'];

          case 6:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should reset keyboard to default IME', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver.opts.unicodeKeyboard = true;
            driver.opts.resetKeyboard = true;
            driver.defaultIME = 'someDefaultIME';
            context$3$0.next = 5;
            return _regeneratorRuntime.awrap(driver.deleteSession());

          case 5:
            driver.adb.setIME.calledOnce.should.be['true'];

          case 6:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should force stop non-Chrome sessions', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.deleteSession());

          case 2:
            driver.adb.forceStop.calledTwice.should.be['true'];

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should force stop unlocker in Chrome sessions', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver.opts.browserName = 'Chrome';
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver.deleteSession());

          case 3:
            driver.adb.forceStop.calledOnce.should.be['true'];

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should uninstall APK if required', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver.opts.fullReset = true;
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver.deleteSession());

          case 3:
            driver.adb.uninstallApk.calledOnce.should.be['true'];

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
  });
  describe('startAndroidSession', function () {
    beforeEach(function callee$2$0() {
      var fakeBootstrap;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver = new _2['default']();
            driver.adb = new _appiumAdb2['default']();
            driver.bootstrap = new _libAndroidHelpers2['default'].bootstrap(driver.adb);
            driver.settings = { update: function update() {} };
            driver.caps = {};

            // create a fake bootstrap because we can't mock
            // driver.bootstrap.<whatever> in advance
            fakeBootstrap = { start: function start() {},
              onUnexpectedShutdown: { 'catch': function _catch() {} }
            };

            sandbox.stub(_libAndroidHelpers2['default'], 'initDevice');
            sandbox.stub(_libAndroidHelpers2['default'], 'unlock');
            sandbox.stub(_libAndroidHelpers2['default'], 'bootstrap').returns(fakeBootstrap);
            sandbox.stub(driver, 'initAUT');
            sandbox.stub(driver, 'startAUT');
            sandbox.stub(driver, 'defaultWebviewName');
            sandbox.stub(driver, 'setContext');
            sandbox.stub(driver, 'startChromeSession');
            sandbox.stub(driver.settings, 'update');
            sandbox.stub(driver.adb, 'getPlatformVersion');

          case 16:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    afterEach(function () {
      sandbox.restore();
    });
    it('should set actual platform version', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.startAndroidSession());

          case 2:
            driver.adb.getPlatformVersion.calledOnce.should.be['true'];

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should auto launch app if it is on the device', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver.opts.autoLaunch = true;
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver.startAndroidSession());

          case 3:
            driver.initAUT.calledOnce.should.be['true'];

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should handle chrome sessions', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver.opts.browserName = 'Chrome';
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver.startAndroidSession());

          case 3:
            driver.startChromeSession.calledOnce.should.be['true'];

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should unlock the device', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.startAndroidSession());

          case 2:
            _libAndroidHelpers2['default'].unlock.calledOnce.should.be['true'];

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should start AUT if auto lauching', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver.opts.autoLaunch = true;
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver.startAndroidSession());

          case 3:
            driver.initAUT.calledOnce.should.be['true'];

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should not start AUT if not auto lauching', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver.opts.autoLaunch = false;
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver.startAndroidSession());

          case 3:
            driver.initAUT.calledOnce.should.be['false'];

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should set the context if autoWebview is requested', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver.opts.autoWebview = true;
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver.startAndroidSession());

          case 3:
            driver.defaultWebviewName.calledOnce.should.be['true'];
            driver.setContext.calledOnce.should.be['true'];

          case 5:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should set the context if autoWebview is requested using timeout', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver.setContext.onCall(0).throws(_appiumBaseDriver.errors.NoSuchContextError);
            driver.setContext.onCall(1).returns();

            driver.opts.autoWebview = true;
            driver.opts.autoWebviewTimeout = 5000;
            context$3$0.next = 6;
            return _regeneratorRuntime.awrap(driver.startAndroidSession());

          case 6:
            driver.defaultWebviewName.calledOnce.should.be['true'];
            driver.setContext.calledTwice.should.be['true'];

          case 8:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should respect timeout if autoWebview is requested', function callee$2$0() {
      var begin, end;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver.setContext.throws(new _appiumBaseDriver.errors.NoSuchContextError());

            begin = Date.now();

            driver.opts.autoWebview = true;
            driver.opts.autoWebviewTimeout = 5000;
            context$3$0.next = 6;
            return _regeneratorRuntime.awrap(driver.startAndroidSession().should.eventually.be.rejected);

          case 6:
            driver.defaultWebviewName.calledOnce.should.be['true'];

            // we have a timeout of 5000ms, retrying on 500ms, so expect 10 times
            driver.setContext.callCount.should.equal(10);

            end = Date.now();

            (end - begin).should.be.above(5000);

          case 10:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should not set the context if autoWebview is not requested', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.startAndroidSession());

          case 2:
            driver.defaultWebviewName.calledOnce.should.be['false'];
            driver.setContext.calledOnce.should.be['false'];

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should set ignoreUnimportantViews cap', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver.opts.ignoreUnimportantViews = true;

            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver.startAndroidSession());

          case 3:
            driver.settings.update.calledOnce.should.be['true'];
            driver.settings.update.firstCall.args[0].ignoreUnimportantViews.should.be['true'];

          case 5:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
  });
  describe('validateDesiredCaps', function () {
    before(function () {
      driver = new _2['default']();
    });
    it('should throw an error if caps do not contain an app, package or valid browser', function () {
      expect(function () {
        driver.validateDesiredCaps({ platformName: 'Android', deviceName: 'device' });
      }).to['throw'](/must include/);
      expect(function () {
        driver.validateDesiredCaps({ platformName: 'Android', deviceName: 'device', browserName: 'Netscape Navigator' });
      }).to['throw'](/must include/);
    });
    it('should not throw an error if caps contain an app, package or valid browser', function () {
      expect(function () {
        driver.validateDesiredCaps({ platformName: 'Android', deviceName: 'device', app: '/path/to/some.apk' });
      }).to.not['throw'](Error);
      expect(function () {
        driver.validateDesiredCaps({ platformName: 'Android', deviceName: 'device', browserName: 'Chrome' });
      }).to.not['throw'](Error);
      expect(function () {
        driver.validateDesiredCaps({ platformName: 'Android', deviceName: 'device', appPackage: 'some.app.package' });
      }).to.not['throw'](/must include/);
    });
    it('should not be sensitive to platform name casing', function () {
      expect(function () {
        driver.validateDesiredCaps({ platformName: 'AnDrOiD', deviceName: 'device', app: '/path/to/some.apk' });
      }).to.not['throw'](Error);
    });
    it('should not throw an error if caps contain both an app and browser, for grid compatibility', function () {
      expect(function () {
        driver.validateDesiredCaps({ platformName: 'Android', deviceName: 'device', app: '/path/to/some.apk', browserName: 'iPhone' });
      }).to.not['throw'](Error);
    });
    it('should not throw an error if caps contain androidScreenshotPath capability', function () {
      expect(function () {
        driver.validateDesiredCaps({ platformName: 'Android', deviceName: 'device', app: '/path/to/some.apk', androidScreenshotPath: '/path/to/screenshotdir' });
      }).to.not['throw'](Error);
    });
  });
  describe('proxying', function () {
    before(function () {
      driver = new _2['default']();
      driver.sessionId = 'abc';
    });
    describe('#proxyActive', function () {
      it('should exist', function () {
        driver.proxyActive.should.be.an['instanceof'](Function);
      });
      it('should return false', function () {
        driver.proxyActive('abc').should.be['false'];
      });
      it('should throw an error if session id is wrong', function () {
        (function () {
          driver.proxyActive('aaa');
        }).should['throw'];
      });
    });

    describe('#getProxyAvoidList', function () {
      it('should exist', function () {
        driver.getProxyAvoidList.should.be.an['instanceof'](Function);
      });
      it('should return jwpProxyAvoid array', function () {
        var avoidList = driver.getProxyAvoidList('abc');
        avoidList.should.be.an['instanceof'](Array);
        avoidList.should.eql(driver.jwpProxyAvoid);
      });
      it('should throw an error if session id is wrong', function () {
        (function () {
          driver.getProxyAvoidList('aaa');
        }).should['throw'];
      });
    });

    describe('#canProxy', function () {
      it('should exist', function () {
        driver.canProxy.should.be.an['instanceof'](Function);
      });
      it('should return false', function () {
        driver.canProxy('abc').should.be['false'];
      });
      it('should throw an error if session id is wrong', function () {
        (function () {
          driver.canProxy('aaa');
        }).should['throw'];
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvdW5pdC9kcml2ZXItc3BlY3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBQWlCLE1BQU07Ozs7OEJBQ0ksa0JBQWtCOzs7O3lCQUM3QixrQkFBa0I7Ozs7cUJBQ2hCLE9BQU87Ozs7aUNBQ0wsMkJBQTJCOzs7O2dCQUNyQixPQUFPOzs7O3lCQUNqQixZQUFZOzs7O2dDQUNMLG9CQUFvQjs7QUFHM0MsSUFBSSxNQUFNLFlBQUEsQ0FBQztBQUNYLElBQUksT0FBTyxHQUFHLG1CQUFNLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNyQyxJQUFJLE1BQU0sR0FBRyxrQkFBSyxNQUFNLENBQUM7QUFDekIsa0JBQUssTUFBTSxFQUFFLENBQUM7QUFDZCxrQkFBSyxHQUFHLDZCQUFnQixDQUFDOztBQUV6QixRQUFRLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDdkIsVUFBUSxDQUFDLGFBQWEsRUFBRSxZQUFNO0FBQzVCLE1BQUUsQ0FBQyw4Q0FBOEMsRUFBRSxZQUFNO0FBQ3ZELFVBQUksTUFBTSxHQUFHLGtCQUFrQixFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0FBQzdDLFlBQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3BCLFlBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckMsQ0FBQyxDQUFDO0FBQ0gsTUFBRSxDQUFDLDhCQUE4QixFQUFFLFlBQU07QUFDdkMsVUFBSSxNQUFNLEdBQUcsa0JBQWtCLEVBQUMsR0FBRyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7QUFDN0MsWUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFlBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDNUMsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFD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QUFDLENBQUM7QUFDSCxRQUFFLENBQUMsOENBQThDLEVBQUUsWUFBTTtBQUN2RCxTQUFDLFlBQU07QUFBRSxnQkFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUUsQ0FBQSxDQUFFLE1BQU0sU0FBTSxDQUFDO09BQzNELENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQzs7QUFFSCxZQUFRLENBQUMsV0FBVyxFQUFFLFlBQU07QUFDMUIsUUFBRSxDQUFDLGNBQWMsRUFBRSxZQUFNO0FBQ3ZCLGNBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLGNBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNuRCxDQUFDLENBQUM7QUFDSCxRQUFFLENBQUMscUJBQXFCLEVBQUUsWUFBTTtBQUM5QixjQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQU0sQ0FBQztPQUN4QyxDQUFDLENBQUM7QUFDSCxRQUFFLENBQUMsOENBQThDLEVBQUUsWUFBTTtBQUN2RCxTQUFDLFlBQU07QUFBRSxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFFLENBQUEsQ0FBRSxNQUFNLFNBQU0sQ0FBQztPQUNsRCxDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoidGVzdC91bml0L2RyaXZlci1zcGVjcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFpIGZyb20gJ2NoYWknO1xuaW1wb3J0IGNoYWlBc1Byb21pc2VkIGZyb20gJ2NoYWktYXMtcHJvbWlzZWQnO1xuaW1wb3J0IGxvZyBmcm9tICcuLi8uLi9saWIvbG9nZ2VyJztcbmltcG9ydCBzaW5vbiBmcm9tICdzaW5vbic7XG5pbXBvcnQgaGVscGVycyBmcm9tICcuLi8uLi9saWIvYW5kcm9pZC1oZWxwZXJzJztcbmltcG9ydCBBbmRyb2lkRHJpdmVyIGZyb20gJy4uLy4uJztcbmltcG9ydCBBREIgZnJvbSAnYXBwaXVtLWFkYic7XG5pbXBvcnQgeyBlcnJvcnMgfSBmcm9tICdhcHBpdW0tYmFzZS1kcml2ZXInO1xuXG5cbmxldCBkcml2ZXI7XG5sZXQgc2FuZGJveCA9IHNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG5sZXQgZXhwZWN0ID0gY2hhaS5leHBlY3Q7XG5jaGFpLnNob3VsZCgpO1xuY2hhaS51c2UoY2hhaUFzUHJvbWlzZWQpO1xuXG5kZXNjcmliZSgnZHJpdmVyJywgKCkgPT4ge1xuICBkZXNjcmliZSgnY29uc3RydWN0b3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIEJhc2VEcml2ZXIgY29uc3RydWN0b3Igd2l0aCBvcHRzJywgKCkgPT4ge1xuICAgICAgbGV0IGRyaXZlciA9IG5ldyBBbmRyb2lkRHJpdmVyKHtmb286ICdiYXInfSk7XG4gICAgICBkcml2ZXIuc2hvdWxkLmV4aXN0O1xuICAgICAgZHJpdmVyLm9wdHMuZm9vLnNob3VsZC5lcXVhbCgnYmFyJyk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIHRoaXMuZmluZEVsT3JFbHMnLCAoKSA9PiB7XG4gICAgICBsZXQgZHJpdmVyID0gbmV3IEFuZHJvaWREcml2ZXIoe2ZvbzogJ2Jhcid9KTtcbiAgICAgIGRyaXZlci5maW5kRWxPckVscy5zaG91bGQuZXhpc3Q7XG4gICAgICBkcml2ZXIuZmluZEVsT3JFbHMuc2hvdWxkLmJlLmEoJ2Z1bmN0aW9uJyk7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZSgnY3JlYXRlU2Vzc2lvbicsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGRyaXZlciA9IG5ldyBBbmRyb2lkRHJpdmVyKCk7XG4gICAgICBzYW5kYm94LnN0dWIoZHJpdmVyLCAnY2hlY2tBcHBQcmVzZW50Jyk7XG4gICAgICBzYW5kYm94LnN0dWIoZHJpdmVyLCAnY2hlY2tQYWNrYWdlUHJlc2VudCcpO1xuICAgICAgc2FuZGJveC5zdHViKGRyaXZlciwgJ3N0YXJ0QW5kcm9pZFNlc3Npb24nKTtcbiAgICAgIHNhbmRib3guc3R1YihBREIsICdjcmVhdGVBREInLCBhc3luYyAob3B0cykgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGdldERldmljZXNXaXRoUmV0cnk6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIHt1ZGlkOiAnZW11bGF0b3ItMTIzNCd9LFxuICAgICAgICAgICAgICB7dWRpZDogJ3JvdGFsdW1lLTEzMzcnfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldFBvcnRGcm9tRW11bGF0b3JTdHJpbmc6ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAxMjM0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0RGV2aWNlSWQ6ICgpID0+IHt9LFxuICAgICAgICAgIHNldEVtdWxhdG9yUG9ydDogKCkgPT4ge30sXG4gICAgICAgICAgYWRiUG9ydDogb3B0cy5hZGJQb3J0XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBhZnRlckVhY2goKCkgPT4ge1xuICAgICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBnZXQgamF2YSB2ZXJzaW9uIGlmIG5vbmUgaXMgcHJvdmlkZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBkcml2ZXIuY3JlYXRlU2Vzc2lvbih7cGxhdGZvcm1OYW1lOiAnQW5kcm9pZCcsIGRldmljZU5hbWU6ICdkZXZpY2UnLCBhcHA6ICcvcGF0aC90by9zb21lLmFwayd9KTtcbiAgICAgIGRyaXZlci5vcHRzLmphdmFWZXJzaW9uLnNob3VsZC5leGlzdDtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGdldCBicm93c2VyIHBhY2thZ2UgZGV0YWlscyBpZiBicm93c2VyTmFtZSBpcyBwcm92aWRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHNhbmRib3guc3B5KGhlbHBlcnMsICdnZXRDaHJvbWVQa2cnKTtcbiAgICAgIGF3YWl0IGRyaXZlci5jcmVhdGVTZXNzaW9uKHtwbGF0Zm9ybU5hbWU6ICdBbmRyb2lkJywgZGV2aWNlTmFtZTogJ2RldmljZScsIGJyb3dzZXJOYW1lOiAnQ2hyb21lJ30pO1xuICAgICAgaGVscGVycy5nZXRDaHJvbWVQa2cuY2FsbGVkT25jZS5zaG91bGQuYmUudHJ1ZTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGNoZWNrIGFuIGFwcCBpcyBwcmVzZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgZHJpdmVyLmNyZWF0ZVNlc3Npb24oe3BsYXRmb3JtTmFtZTogJ0FuZHJvaWQnLCBkZXZpY2VOYW1lOiAnZGV2aWNlJywgYXBwOiAnL3BhdGgvdG8vc29tZS5hcGsnfSk7XG4gICAgICBkcml2ZXIuY2hlY2tBcHBQcmVzZW50LmNhbGxlZE9uY2Uuc2hvdWxkLmJlLnRydWU7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBjaGVjayBhIHBhY2thZ2UgaXMgcHJlc2VudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IGRyaXZlci5jcmVhdGVTZXNzaW9uKHtwbGF0Zm9ybU5hbWU6ICdBbmRyb2lkJywgZGV2aWNlTmFtZTogJ2RldmljZScsIGFwcFBhY2thZ2U6ICdzb21lLmFwcC5wYWNrYWdlJ30pO1xuICAgICAgZHJpdmVyLmNoZWNrUGFja2FnZVByZXNlbnQuY2FsbGVkT25jZS5zaG91bGQuYmUudHJ1ZTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGFjY2VwdCBhIHBhY2thZ2UgdmlhIHRoZSBhcHAgY2FwYWJpbGl0eScsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IGRyaXZlci5jcmVhdGVTZXNzaW9uKHtwbGF0Zm9ybU5hbWU6ICdBbmRyb2lkJywgZGV2aWNlTmFtZTogJ2RldmljZScsIGFwcDogJ3NvbWUuYXBwLnBhY2thZ2UnfSk7XG4gICAgICBkcml2ZXIuY2hlY2tQYWNrYWdlUHJlc2VudC5jYWxsZWRPbmNlLnNob3VsZC5iZS50cnVlO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgYWRkIHNlcnZlciBkZXRhaWxzIHRvIGNhcHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBkcml2ZXIuY3JlYXRlU2Vzc2lvbih7cGxhdGZvcm1OYW1lOiAnQW5kcm9pZCcsIGRldmljZU5hbWU6ICdkZXZpY2UnLCBhcHBQYWNrYWdlOiAnc29tZS5hcHAucGFja2FnZSd9KTtcbiAgICAgIGRyaXZlci5jYXBzLndlYlN0b3JhZ2VFbmFibGVkLnNob3VsZC5leGlzdDtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGRlbGV0ZSBhIHNlc3Npb24gb24gZmFpbHVyZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEZvcmNlIGFuIGVycm9yIHRvIG1ha2Ugc3VyZSBkZWxldGVTZXNzaW9uIGdldHMgY2FsbGVkXG4gICAgICBzYW5kYm94LnN0dWIoaGVscGVycywgJ2dldEphdmFWZXJzaW9uJykudGhyb3dzKCk7XG4gICAgICBzYW5kYm94LnN0dWIoZHJpdmVyLCAnZGVsZXRlU2Vzc2lvbicpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgZHJpdmVyLmNyZWF0ZVNlc3Npb24oe3BsYXRmb3JtTmFtZTogJ0FuZHJvaWQnLCBkZXZpY2VOYW1lOiAnZGV2aWNlJywgYXBwUGFja2FnZTogJ3NvbWUuYXBwLnBhY2thZ2UnfSk7XG4gICAgICB9IGNhdGNoIChpZ24pIHt9XG4gICAgICBkcml2ZXIuZGVsZXRlU2Vzc2lvbi5jYWxsZWRPbmNlLnNob3VsZC5iZS50cnVlO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgcGFzcyBhbG9uZyBhZGJQb3J0IGNhcGFiaWxpdHkgdG8gQURCJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgZHJpdmVyLmNyZWF0ZVNlc3Npb24oe3BsYXRmb3JtTmFtZTogJ0FuZHJvaWQnLCBkZXZpY2VOYW1lOiAnZGV2aWNlJywgYXBwUGFja2FnZTogJ3NvbWUuYXBwLnBhY2thZ2UnLCBhZGJQb3J0OiAxMTExfSk7XG4gICAgICBkcml2ZXIuYWRiLmFkYlBvcnQuc2hvdWxkLmVxdWFsKDExMTEpO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgcHJveHkgc2NyZWVuc2hvdCBpZiBuYXRpdmVXZWJTY3JlZW5zaG90IGlzIG9mZicsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IGRyaXZlci5jcmVhdGVTZXNzaW9uKHtwbGF0Zm9ybU5hbWU6ICdBbmRyb2lkJywgZGV2aWNlTmFtZTogJ2RldmljZScsIGJyb3dzZXJOYW1lOiAnY2hyb21lJywgbmF0aXZlV2ViU2NyZWVuc2hvdDogZmFsc2V9KTtcbiAgICAgIGRyaXZlci5nZXRQcm94eUF2b2lkTGlzdCgpLnNob3VsZC5oYXZlLmxlbmd0aCg4KTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIG5vdCBwcm94eSBzY3JlZW5zaG90IGlmIG5hdGl2ZVdlYlNjcmVlbnNob3QgaXMgb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBkcml2ZXIuY3JlYXRlU2Vzc2lvbih7cGxhdGZvcm1OYW1lOiAnQW5kcm9pZCcsIGRldmljZU5hbWU6ICdkZXZpY2UnLCBicm93c2VyTmFtZTogJ2Nocm9tZScsIG5hdGl2ZVdlYlNjcmVlbnNob3Q6IHRydWV9KTtcbiAgICAgIGRyaXZlci5nZXRQcm94eUF2b2lkTGlzdCgpLnNob3VsZC5oYXZlLmxlbmd0aCg5KTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdkZWxldGVTZXNzaW9uJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgZHJpdmVyID0gbmV3IEFuZHJvaWREcml2ZXIoKTtcbiAgICAgIGRyaXZlci5hZGIgPSBuZXcgQURCKCk7XG4gICAgICBkcml2ZXIuYm9vdHN0cmFwID0gbmV3IGhlbHBlcnMuYm9vdHN0cmFwKGRyaXZlci5hZGIpO1xuICAgICAgc2FuZGJveC5zdHViKGRyaXZlciwgJ3N0b3BDaHJvbWVkcml2ZXJQcm94aWVzJyk7XG4gICAgICBzYW5kYm94LnN0dWIoZHJpdmVyLmFkYiwgJ3NldElNRScpO1xuICAgICAgc2FuZGJveC5zdHViKGRyaXZlci5hZGIsICdmb3JjZVN0b3AnKTtcbiAgICAgIHNhbmRib3guc3R1Yihkcml2ZXIuYWRiLCAnZ29Ub0hvbWUnKTtcbiAgICAgIHNhbmRib3guc3R1Yihkcml2ZXIuYWRiLCAndW5pbnN0YWxsQXBrJyk7XG4gICAgICBzYW5kYm94LnN0dWIoZHJpdmVyLmFkYiwgJ3N0b3BMb2djYXQnKTtcbiAgICAgIHNhbmRib3guc3R1Yihkcml2ZXIuYm9vdHN0cmFwLCAnc2h1dGRvd24nKTtcbiAgICAgIHNhbmRib3guc3B5KGxvZywgJ2RlYnVnJyk7XG4gICAgfSk7XG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgIHNhbmRib3gucmVzdG9yZSgpO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgbm90IGRvIGFueXRoaW5nIGlmIEFuZHJvaWQgRHJpdmVyIGhhcyBhbHJlYWR5IHNodXQgZG93bicsIGFzeW5jICgpID0+IHtcbiAgICAgIGRyaXZlci5ib290c3RyYXAgPSBudWxsO1xuICAgICAgYXdhaXQgZHJpdmVyLmRlbGV0ZVNlc3Npb24oKTtcbiAgICAgIGxvZy5kZWJ1Zy5jYWxsQ291bnQuc2hvdWxkLmVxbCgzKTtcbiAgICAgIGRyaXZlci5zdG9wQ2hyb21lZHJpdmVyUHJveGllcy5jYWxsZWQuc2hvdWxkLmJlLmZhbHNlO1xuICAgICAgZHJpdmVyLmFkYi5zdG9wTG9nY2F0LmNhbGxlZC5zaG91bGQuYmUudHJ1ZTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHJlc2V0IGtleWJvYXJkIHRvIGRlZmF1bHQgSU1FJywgYXN5bmMgKCkgPT4ge1xuICAgICAgZHJpdmVyLm9wdHMudW5pY29kZUtleWJvYXJkID0gdHJ1ZTtcbiAgICAgIGRyaXZlci5vcHRzLnJlc2V0S2V5Ym9hcmQgPSB0cnVlO1xuICAgICAgZHJpdmVyLmRlZmF1bHRJTUUgPSAnc29tZURlZmF1bHRJTUUnO1xuICAgICAgYXdhaXQgZHJpdmVyLmRlbGV0ZVNlc3Npb24oKTtcbiAgICAgIGRyaXZlci5hZGIuc2V0SU1FLmNhbGxlZE9uY2Uuc2hvdWxkLmJlLnRydWU7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBmb3JjZSBzdG9wIG5vbi1DaHJvbWUgc2Vzc2lvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBkcml2ZXIuZGVsZXRlU2Vzc2lvbigpO1xuICAgICAgZHJpdmVyLmFkYi5mb3JjZVN0b3AuY2FsbGVkVHdpY2Uuc2hvdWxkLmJlLnRydWU7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBmb3JjZSBzdG9wIHVubG9ja2VyIGluIENocm9tZSBzZXNzaW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIGRyaXZlci5vcHRzLmJyb3dzZXJOYW1lID0gJ0Nocm9tZSc7XG4gICAgICBhd2FpdCBkcml2ZXIuZGVsZXRlU2Vzc2lvbigpO1xuICAgICAgZHJpdmVyLmFkYi5mb3JjZVN0b3AuY2FsbGVkT25jZS5zaG91bGQuYmUudHJ1ZTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHVuaW5zdGFsbCBBUEsgaWYgcmVxdWlyZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBkcml2ZXIub3B0cy5mdWxsUmVzZXQgPSB0cnVlO1xuICAgICAgYXdhaXQgZHJpdmVyLmRlbGV0ZVNlc3Npb24oKTtcbiAgICAgIGRyaXZlci5hZGIudW5pbnN0YWxsQXBrLmNhbGxlZE9uY2Uuc2hvdWxkLmJlLnRydWU7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZSgnc3RhcnRBbmRyb2lkU2Vzc2lvbicsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgIGRyaXZlciA9IG5ldyBBbmRyb2lkRHJpdmVyKCk7XG4gICAgICBkcml2ZXIuYWRiID0gbmV3IEFEQigpO1xuICAgICAgZHJpdmVyLmJvb3RzdHJhcCA9IG5ldyBoZWxwZXJzLmJvb3RzdHJhcChkcml2ZXIuYWRiKTtcbiAgICAgIGRyaXZlci5zZXR0aW5ncyA9IHsgdXBkYXRlICgpIHt9IH07XG4gICAgICBkcml2ZXIuY2FwcyA9IHt9O1xuXG4gICAgICAvLyBjcmVhdGUgYSBmYWtlIGJvb3RzdHJhcCBiZWNhdXNlIHdlIGNhbid0IG1vY2tcbiAgICAgIC8vIGRyaXZlci5ib290c3RyYXAuPHdoYXRldmVyPiBpbiBhZHZhbmNlXG4gICAgICBsZXQgZmFrZUJvb3RzdHJhcCA9IHtzdGFydCAoKSB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uVW5leHBlY3RlZFNodXRkb3duOiB7Y2F0Y2ggKCkge319XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgIHNhbmRib3guc3R1YihoZWxwZXJzLCAnaW5pdERldmljZScpO1xuICAgICAgc2FuZGJveC5zdHViKGhlbHBlcnMsICd1bmxvY2snKTtcbiAgICAgIHNhbmRib3guc3R1YihoZWxwZXJzLCAnYm9vdHN0cmFwJykucmV0dXJucyhmYWtlQm9vdHN0cmFwKTtcbiAgICAgIHNhbmRib3guc3R1Yihkcml2ZXIsICdpbml0QVVUJyk7XG4gICAgICBzYW5kYm94LnN0dWIoZHJpdmVyLCAnc3RhcnRBVVQnKTtcbiAgICAgIHNhbmRib3guc3R1Yihkcml2ZXIsICdkZWZhdWx0V2Vidmlld05hbWUnKTtcbiAgICAgIHNhbmRib3guc3R1Yihkcml2ZXIsICdzZXRDb250ZXh0Jyk7XG4gICAgICBzYW5kYm94LnN0dWIoZHJpdmVyLCAnc3RhcnRDaHJvbWVTZXNzaW9uJyk7XG4gICAgICBzYW5kYm94LnN0dWIoZHJpdmVyLnNldHRpbmdzLCAndXBkYXRlJyk7XG4gICAgICBzYW5kYm94LnN0dWIoZHJpdmVyLmFkYiwgJ2dldFBsYXRmb3JtVmVyc2lvbicpO1xuICAgIH0pO1xuICAgIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHNldCBhY3R1YWwgcGxhdGZvcm0gdmVyc2lvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IGRyaXZlci5zdGFydEFuZHJvaWRTZXNzaW9uKCk7XG4gICAgICBkcml2ZXIuYWRiLmdldFBsYXRmb3JtVmVyc2lvbi5jYWxsZWRPbmNlLnNob3VsZC5iZS50cnVlO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgYXV0byBsYXVuY2ggYXBwIGlmIGl0IGlzIG9uIHRoZSBkZXZpY2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBkcml2ZXIub3B0cy5hdXRvTGF1bmNoID0gdHJ1ZTtcbiAgICAgIGF3YWl0IGRyaXZlci5zdGFydEFuZHJvaWRTZXNzaW9uKCk7XG4gICAgICBkcml2ZXIuaW5pdEFVVC5jYWxsZWRPbmNlLnNob3VsZC5iZS50cnVlO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNocm9tZSBzZXNzaW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIGRyaXZlci5vcHRzLmJyb3dzZXJOYW1lID0gJ0Nocm9tZSc7XG4gICAgICBhd2FpdCBkcml2ZXIuc3RhcnRBbmRyb2lkU2Vzc2lvbigpO1xuICAgICAgZHJpdmVyLnN0YXJ0Q2hyb21lU2Vzc2lvbi5jYWxsZWRPbmNlLnNob3VsZC5iZS50cnVlO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgdW5sb2NrIHRoZSBkZXZpY2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBkcml2ZXIuc3RhcnRBbmRyb2lkU2Vzc2lvbigpO1xuICAgICAgaGVscGVycy51bmxvY2suY2FsbGVkT25jZS5zaG91bGQuYmUudHJ1ZTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHN0YXJ0IEFVVCBpZiBhdXRvIGxhdWNoaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgZHJpdmVyLm9wdHMuYXV0b0xhdW5jaCA9IHRydWU7XG4gICAgICBhd2FpdCBkcml2ZXIuc3RhcnRBbmRyb2lkU2Vzc2lvbigpO1xuICAgICAgZHJpdmVyLmluaXRBVVQuY2FsbGVkT25jZS5zaG91bGQuYmUudHJ1ZTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIG5vdCBzdGFydCBBVVQgaWYgbm90IGF1dG8gbGF1Y2hpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBkcml2ZXIub3B0cy5hdXRvTGF1bmNoID0gZmFsc2U7XG4gICAgICBhd2FpdCBkcml2ZXIuc3RhcnRBbmRyb2lkU2Vzc2lvbigpO1xuICAgICAgZHJpdmVyLmluaXRBVVQuY2FsbGVkT25jZS5zaG91bGQuYmUuZmFsc2U7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBzZXQgdGhlIGNvbnRleHQgaWYgYXV0b1dlYnZpZXcgaXMgcmVxdWVzdGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgZHJpdmVyLm9wdHMuYXV0b1dlYnZpZXcgPSB0cnVlO1xuICAgICAgYXdhaXQgZHJpdmVyLnN0YXJ0QW5kcm9pZFNlc3Npb24oKTtcbiAgICAgIGRyaXZlci5kZWZhdWx0V2Vidmlld05hbWUuY2FsbGVkT25jZS5zaG91bGQuYmUudHJ1ZTtcbiAgICAgIGRyaXZlci5zZXRDb250ZXh0LmNhbGxlZE9uY2Uuc2hvdWxkLmJlLnRydWU7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBzZXQgdGhlIGNvbnRleHQgaWYgYXV0b1dlYnZpZXcgaXMgcmVxdWVzdGVkIHVzaW5nIHRpbWVvdXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBkcml2ZXIuc2V0Q29udGV4dC5vbkNhbGwoMCkudGhyb3dzKGVycm9ycy5Ob1N1Y2hDb250ZXh0RXJyb3IpO1xuICAgICAgZHJpdmVyLnNldENvbnRleHQub25DYWxsKDEpLnJldHVybnMoKTtcblxuICAgICAgZHJpdmVyLm9wdHMuYXV0b1dlYnZpZXcgPSB0cnVlO1xuICAgICAgZHJpdmVyLm9wdHMuYXV0b1dlYnZpZXdUaW1lb3V0ID0gNTAwMDtcbiAgICAgIGF3YWl0IGRyaXZlci5zdGFydEFuZHJvaWRTZXNzaW9uKCk7XG4gICAgICBkcml2ZXIuZGVmYXVsdFdlYnZpZXdOYW1lLmNhbGxlZE9uY2Uuc2hvdWxkLmJlLnRydWU7XG4gICAgICBkcml2ZXIuc2V0Q29udGV4dC5jYWxsZWRUd2ljZS5zaG91bGQuYmUudHJ1ZTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHJlc3BlY3QgdGltZW91dCBpZiBhdXRvV2VidmlldyBpcyByZXF1ZXN0ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBkcml2ZXIuc2V0Q29udGV4dC50aHJvd3MobmV3IGVycm9ycy5Ob1N1Y2hDb250ZXh0RXJyb3IoKSk7XG5cbiAgICAgIGxldCBiZWdpbiA9IERhdGUubm93KCk7XG5cbiAgICAgIGRyaXZlci5vcHRzLmF1dG9XZWJ2aWV3ID0gdHJ1ZTtcbiAgICAgIGRyaXZlci5vcHRzLmF1dG9XZWJ2aWV3VGltZW91dCA9IDUwMDA7XG4gICAgICBhd2FpdCBkcml2ZXIuc3RhcnRBbmRyb2lkU2Vzc2lvbigpLnNob3VsZC5ldmVudHVhbGx5LmJlLnJlamVjdGVkO1xuICAgICAgZHJpdmVyLmRlZmF1bHRXZWJ2aWV3TmFtZS5jYWxsZWRPbmNlLnNob3VsZC5iZS50cnVlO1xuXG4gICAgICAvLyB3ZSBoYXZlIGEgdGltZW91dCBvZiA1MDAwbXMsIHJldHJ5aW5nIG9uIDUwMG1zLCBzbyBleHBlY3QgMTAgdGltZXNcbiAgICAgIGRyaXZlci5zZXRDb250ZXh0LmNhbGxDb3VudC5zaG91bGQuZXF1YWwoMTApO1xuXG4gICAgICBsZXQgZW5kID0gRGF0ZS5ub3coKTtcbiAgICAgIChlbmQgLSBiZWdpbikuc2hvdWxkLmJlLmFib3ZlKDUwMDApO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgbm90IHNldCB0aGUgY29udGV4dCBpZiBhdXRvV2VidmlldyBpcyBub3QgcmVxdWVzdGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgZHJpdmVyLnN0YXJ0QW5kcm9pZFNlc3Npb24oKTtcbiAgICAgIGRyaXZlci5kZWZhdWx0V2Vidmlld05hbWUuY2FsbGVkT25jZS5zaG91bGQuYmUuZmFsc2U7XG4gICAgICBkcml2ZXIuc2V0Q29udGV4dC5jYWxsZWRPbmNlLnNob3VsZC5iZS5mYWxzZTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHNldCBpZ25vcmVVbmltcG9ydGFudFZpZXdzIGNhcCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGRyaXZlci5vcHRzLmlnbm9yZVVuaW1wb3J0YW50Vmlld3MgPSB0cnVlO1xuXG4gICAgICBhd2FpdCBkcml2ZXIuc3RhcnRBbmRyb2lkU2Vzc2lvbigpO1xuICAgICAgZHJpdmVyLnNldHRpbmdzLnVwZGF0ZS5jYWxsZWRPbmNlLnNob3VsZC5iZS50cnVlO1xuICAgICAgZHJpdmVyLnNldHRpbmdzLnVwZGF0ZS5maXJzdENhbGwuYXJnc1swXS5pZ25vcmVVbmltcG9ydGFudFZpZXdzLnNob3VsZC5iZS50cnVlO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ3ZhbGlkYXRlRGVzaXJlZENhcHMnLCAoKSA9PiB7XG4gICAgYmVmb3JlKCgpID0+IHtcbiAgICAgIGRyaXZlciA9IG5ldyBBbmRyb2lkRHJpdmVyKCk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCB0aHJvdyBhbiBlcnJvciBpZiBjYXBzIGRvIG5vdCBjb250YWluIGFuIGFwcCwgcGFja2FnZSBvciB2YWxpZCBicm93c2VyJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgZHJpdmVyLnZhbGlkYXRlRGVzaXJlZENhcHMoe3BsYXRmb3JtTmFtZTogJ0FuZHJvaWQnLCBkZXZpY2VOYW1lOiAnZGV2aWNlJ30pO1xuICAgICAgfSkudG8udGhyb3coL211c3QgaW5jbHVkZS8pO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgZHJpdmVyLnZhbGlkYXRlRGVzaXJlZENhcHMoe3BsYXRmb3JtTmFtZTogJ0FuZHJvaWQnLCBkZXZpY2VOYW1lOiAnZGV2aWNlJywgYnJvd3Nlck5hbWU6ICdOZXRzY2FwZSBOYXZpZ2F0b3InfSk7XG4gICAgICB9KS50by50aHJvdygvbXVzdCBpbmNsdWRlLyk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBub3QgdGhyb3cgYW4gZXJyb3IgaWYgY2FwcyBjb250YWluIGFuIGFwcCwgcGFja2FnZSBvciB2YWxpZCBicm93c2VyJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgZHJpdmVyLnZhbGlkYXRlRGVzaXJlZENhcHMoe3BsYXRmb3JtTmFtZTogJ0FuZHJvaWQnLCBkZXZpY2VOYW1lOiAnZGV2aWNlJywgYXBwOiAnL3BhdGgvdG8vc29tZS5hcGsnfSk7XG4gICAgICB9KS50by5ub3QudGhyb3coRXJyb3IpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgZHJpdmVyLnZhbGlkYXRlRGVzaXJlZENhcHMoe3BsYXRmb3JtTmFtZTogJ0FuZHJvaWQnLCBkZXZpY2VOYW1lOiAnZGV2aWNlJywgYnJvd3Nlck5hbWU6ICdDaHJvbWUnfSk7XG4gICAgICB9KS50by5ub3QudGhyb3coRXJyb3IpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgZHJpdmVyLnZhbGlkYXRlRGVzaXJlZENhcHMoe3BsYXRmb3JtTmFtZTogJ0FuZHJvaWQnLCBkZXZpY2VOYW1lOiAnZGV2aWNlJywgYXBwUGFja2FnZTogJ3NvbWUuYXBwLnBhY2thZ2UnfSk7XG4gICAgICB9KS50by5ub3QudGhyb3coL211c3QgaW5jbHVkZS8pO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgbm90IGJlIHNlbnNpdGl2ZSB0byBwbGF0Zm9ybSBuYW1lIGNhc2luZycsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGRyaXZlci52YWxpZGF0ZURlc2lyZWRDYXBzKHtwbGF0Zm9ybU5hbWU6ICdBbkRyT2lEJywgZGV2aWNlTmFtZTogJ2RldmljZScsIGFwcDogJy9wYXRoL3RvL3NvbWUuYXBrJ30pO1xuICAgICAgfSkudG8ubm90LnRocm93KEVycm9yKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIG5vdCB0aHJvdyBhbiBlcnJvciBpZiBjYXBzIGNvbnRhaW4gYm90aCBhbiBhcHAgYW5kIGJyb3dzZXIsIGZvciBncmlkIGNvbXBhdGliaWxpdHknLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBkcml2ZXIudmFsaWRhdGVEZXNpcmVkQ2Fwcyh7cGxhdGZvcm1OYW1lOiAnQW5kcm9pZCcsIGRldmljZU5hbWU6ICdkZXZpY2UnLCBhcHA6ICcvcGF0aC90by9zb21lLmFwaycsIGJyb3dzZXJOYW1lOiAnaVBob25lJ30pO1xuICAgICAgfSkudG8ubm90LnRocm93KEVycm9yKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIG5vdCB0aHJvdyBhbiBlcnJvciBpZiBjYXBzIGNvbnRhaW4gYW5kcm9pZFNjcmVlbnNob3RQYXRoIGNhcGFiaWxpdHknLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBkcml2ZXIudmFsaWRhdGVEZXNpcmVkQ2Fwcyh7cGxhdGZvcm1OYW1lOiAnQW5kcm9pZCcsIGRldmljZU5hbWU6ICdkZXZpY2UnLCBhcHA6ICcvcGF0aC90by9zb21lLmFwaycsIGFuZHJvaWRTY3JlZW5zaG90UGF0aDogJy9wYXRoL3RvL3NjcmVlbnNob3RkaXInfSk7XG4gICAgICB9KS50by5ub3QudGhyb3coRXJyb3IpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ3Byb3h5aW5nJywgKCkgPT4ge1xuICAgIGJlZm9yZSgoKSA9PiB7XG4gICAgICBkcml2ZXIgPSBuZXcgQW5kcm9pZERyaXZlcigpO1xuICAgICAgZHJpdmVyLnNlc3Npb25JZCA9ICdhYmMnO1xuICAgIH0pO1xuICAgIGRlc2NyaWJlKCcjcHJveHlBY3RpdmUnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGV4aXN0JywgKCkgPT4ge1xuICAgICAgICBkcml2ZXIucHJveHlBY3RpdmUuc2hvdWxkLmJlLmFuLmluc3RhbmNlb2YoRnVuY3Rpb24pO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZScsICgpID0+IHtcbiAgICAgICAgZHJpdmVyLnByb3h5QWN0aXZlKCdhYmMnKS5zaG91bGQuYmUuZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgdGhyb3cgYW4gZXJyb3IgaWYgc2Vzc2lvbiBpZCBpcyB3cm9uZycsICgpID0+IHtcbiAgICAgICAgKCgpID0+IHsgZHJpdmVyLnByb3h5QWN0aXZlKCdhYWEnKTsgfSkuc2hvdWxkLnRocm93O1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnI2dldFByb3h5QXZvaWRMaXN0JywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBleGlzdCcsICgpID0+IHtcbiAgICAgICAgZHJpdmVyLmdldFByb3h5QXZvaWRMaXN0LnNob3VsZC5iZS5hbi5pbnN0YW5jZW9mKEZ1bmN0aW9uKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gandwUHJveHlBdm9pZCBhcnJheScsICgpID0+IHtcbiAgICAgICAgbGV0IGF2b2lkTGlzdCA9IGRyaXZlci5nZXRQcm94eUF2b2lkTGlzdCgnYWJjJyk7XG4gICAgICAgIGF2b2lkTGlzdC5zaG91bGQuYmUuYW4uaW5zdGFuY2VvZihBcnJheSk7XG4gICAgICAgIGF2b2lkTGlzdC5zaG91bGQuZXFsKGRyaXZlci5qd3BQcm94eUF2b2lkKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCB0aHJvdyBhbiBlcnJvciBpZiBzZXNzaW9uIGlkIGlzIHdyb25nJywgKCkgPT4ge1xuICAgICAgICAoKCkgPT4geyBkcml2ZXIuZ2V0UHJveHlBdm9pZExpc3QoJ2FhYScpOyB9KS5zaG91bGQudGhyb3c7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCcjY2FuUHJveHknLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGV4aXN0JywgKCkgPT4ge1xuICAgICAgICBkcml2ZXIuY2FuUHJveHkuc2hvdWxkLmJlLmFuLmluc3RhbmNlb2YoRnVuY3Rpb24pO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZScsICgpID0+IHtcbiAgICAgICAgZHJpdmVyLmNhblByb3h5KCdhYmMnKS5zaG91bGQuYmUuZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgdGhyb3cgYW4gZXJyb3IgaWYgc2Vzc2lvbiBpZCBpcyB3cm9uZycsICgpID0+IHtcbiAgICAgICAgKCgpID0+IHsgZHJpdmVyLmNhblByb3h5KCdhYWEnKTsgfSkuc2hvdWxkLnRocm93O1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uLy4uIn0=
