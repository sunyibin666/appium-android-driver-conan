'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _appiumBaseDriver = require('appium-base-driver');

var _appiumChromedriver = require('appium-chromedriver');

var _appiumChromedriver2 = _interopRequireDefault(_appiumChromedriver);

var _desiredCaps = require('./desired-caps');

var _desiredCaps2 = _interopRequireDefault(_desiredCaps);

var _commandsIndex = require('./commands/index');

var _commandsIndex2 = _interopRequireDefault(_commandsIndex);

var _commandsContext = require('./commands/context');

var _androidHelpers = require('./android-helpers');

var _androidHelpers2 = _interopRequireDefault(_androidHelpers);

var _webviewHelpers = require('./webview-helpers');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appiumAdb = require('appium-adb');

var _appiumSupport = require('appium-support');

var _asyncbox = require('asyncbox');

var _packageJson = require('../../package.json');

// eslint-disable-line import/no-unresolved

var APP_EXTENSION = '.apk';
var DEVICE_PORT = 4724;

// This is a set of methods and paths that we never want to proxy to
// Chromedriver
var NO_PROXY = [['POST', new RegExp('^/session/[^/]+/context')], ['GET', new RegExp('^/session/[^/]+/context')], ['POST', new RegExp('^/session/[^/]+/appium')], ['GET', new RegExp('^/session/[^/]+/appium')], ['POST', new RegExp('^/session/[^/]+/touch/perform')], ['POST', new RegExp('^/session/[^/]+/touch/multi/perform')], ['POST', new RegExp('^/session/[^/]+/orientation')], ['GET', new RegExp('^/session/[^/]+/orientation')]];

var AndroidDriver = (function (_BaseDriver) {
  _inherits(AndroidDriver, _BaseDriver);

  function AndroidDriver() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var shouldValidateCaps = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, AndroidDriver);

    _get(Object.getPrototypeOf(AndroidDriver.prototype), 'constructor', this).call(this, opts, shouldValidateCaps);

    _logger2['default'].debug('AndroidDriver version: ' + _packageJson.version);

    this.locatorStrategies = ['xpath', 'id', 'class name', 'accessibility id', '-android uiautomator'];
    this.desiredCapConstraints = _desiredCaps2['default'];
    this.sessionChromedrivers = {};
    this.jwpProxyActive = false;
    this.jwpProxyAvoid = _lodash2['default'].clone(NO_PROXY);
    this.settings = new _appiumBaseDriver.DeviceSettings({ ignoreUnimportantViews: false }, this.onSettingsUpdate.bind(this));
    this.chromedriver = null;
    this.apkStrings = {};
    this.acceptSslCerts = !!opts.acceptSslCerts;
    this.bootstrapPort = opts.bootstrapPort || DEVICE_PORT;
  }

  _createClass(AndroidDriver, [{
    key: 'createSession',
    value: function createSession(caps) {
      var sessionId, _ref, _ref2, serverDetails, defaultOpts, _helpers$getChromePkg, pkg, activity, _ref3,

      // get device udid for this session
      udid, emPort;

      return _regeneratorRuntime.async(function createSession$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.prev = 0;
            sessionId = undefined;
            context$2$0.next = 4;
            return _regeneratorRuntime.awrap(_get(Object.getPrototypeOf(AndroidDriver.prototype), 'createSession', this).call(this, caps));

          case 4:
            _ref = context$2$0.sent;
            _ref2 = _slicedToArray(_ref, 1);
            sessionId = _ref2[0];
            serverDetails = { platform: 'LINUX',
              webStorageEnabled: false,
              takesScreenshot: true,
              javascriptEnabled: true,
              databaseEnabled: false,
              networkConnectionEnabled: true,
              locationContextEnabled: false,
              warnings: {},
              desired: this.caps };

            this.caps = _Object$assign(serverDetails, this.caps);

            // assigning defaults
            context$2$0.next = 11;
            return _regeneratorRuntime.awrap(_appiumSupport.tempDir.staticDir());

          case 11:
            context$2$0.t0 = context$2$0.sent;
            context$2$0.t1 = _appiumAdb.DEFAULT_ADB_PORT;
            defaultOpts = {
              action: "android.intent.action.MAIN",
              category: "android.intent.category.LAUNCHER",
              flags: "0x10200000",
              disableAndroidWatchers: false,
              tmpDir: context$2$0.t0,
              fullReset: false,
              autoLaunch: true,
              adbPort: context$2$0.t1,
              androidInstallTimeout: 90000
            };

            _lodash2['default'].defaults(this.opts, defaultOpts);

            if (this.opts.javaVersion) {
              context$2$0.next = 19;
              break;
            }

            context$2$0.next = 18;
            return _regeneratorRuntime.awrap(_androidHelpers2['default'].getJavaVersion());

          case 18:
            this.opts.javaVersion = context$2$0.sent;

          case 19:

            // not user visible via caps
            if (this.opts.noReset === true) this.opts.fullReset = false;
            if (this.opts.fullReset === true) this.opts.noReset = false;
            this.opts.fastReset = !this.opts.fullReset && !this.opts.noReset;
            this.opts.skipUninstall = this.opts.fastReset || this.opts.noReset;

            this.curContext = this.defaultContextName();

            if (this.isChromeSession) {
              _logger2['default'].info("We're going to run a Chrome-based session");
              _helpers$getChromePkg = _androidHelpers2['default'].getChromePkg(this.opts.browserName);
              pkg = _helpers$getChromePkg.pkg;
              activity = _helpers$getChromePkg.activity;

              this.opts.appPackage = pkg;
              this.opts.appActivity = activity;
              _logger2['default'].info('Chrome-type package and activity are ' + pkg + ' and ' + activity);
            }

            if (this.opts.nativeWebScreenshot) {
              this.jwpProxyAvoid.push(['GET', new RegExp('^/session/[^/]+/screenshot')]);
            }

            if (this.opts.reboot) {
              this.setAvdFromCapabilities(caps);
              this.addWipeDataToAvdArgs();
            }context$2$0.next = 29;
            return _regeneratorRuntime.awrap(_androidHelpers2['default'].getDeviceInfoFromCaps(this.opts));

          case 29:
            _ref3 = context$2$0.sent;
            udid = _ref3.udid;
            emPort = _ref3.emPort;

            this.opts.udid = udid;
            this.opts.emPort = emPort;

            // set up an instance of ADB
            context$2$0.next = 36;
            return _regeneratorRuntime.awrap(_androidHelpers2['default'].createADB(this.opts.javaVersion, this.opts.udid, this.opts.emPort, this.opts.adbPort));

          case 36:
            this.adb = context$2$0.sent;

            if (this.helpers.isPackageOrBundle(this.opts.app)) {
              // user provided package instead of app for 'app' capability, massage options
              this.opts.appPackage = this.opts.app;
              this.opts.app = null;
            }

            if (!this.opts.app) {
              context$2$0.next = 47;
              break;
            }

            context$2$0.next = 41;
            return _regeneratorRuntime.awrap(this.helpers.configureApp(this.opts.app, APP_EXTENSION));

          case 41:
            this.opts.app = context$2$0.sent;

            this.opts.appIsTemp = caps.app !== this.opts.app; // did we make a temporary copy?
            context$2$0.next = 45;
            return _regeneratorRuntime.awrap(this.checkAppPresent());

          case 45:
            context$2$0.next = 51;
            break;

          case 47:
            if (!this.appOnDevice) {
              context$2$0.next = 51;
              break;
            }

            // the app isn't an actual app file but rather something we want to
            // assume is on the device and just launch via the appPackage
            _logger2['default'].info('App file was not listed, instead we\'re going to run ' + (this.opts.appPackage + ' directly on the device'));
            context$2$0.next = 51;
            return _regeneratorRuntime.awrap(this.checkPackagePresent());

          case 51:
            context$2$0.next = 53;
            return _regeneratorRuntime.awrap(this.startAndroidSession(this.opts));

          case 53:
            return context$2$0.abrupt('return', [sessionId, this.caps]);

          case 56:
            context$2$0.prev = 56;
            context$2$0.t2 = context$2$0['catch'](0);
            context$2$0.prev = 58;
            context$2$0.next = 61;
            return _regeneratorRuntime.awrap(this.deleteSession());

          case 61:
            context$2$0.next = 65;
            break;

          case 63:
            context$2$0.prev = 63;
            context$2$0.t3 = context$2$0['catch'](58);

          case 65:
            throw context$2$0.t2;

          case 66:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[0, 56], [58, 63]]);
    }
  }, {
    key: 'setAvdFromCapabilities',
    value: function setAvdFromCapabilities(caps) {
      if (this.opts.avd) {
        _logger2['default'].info('avd name defined, ignoring device name and platform version');
      } else {
        if (!caps.deviceName) {
          _logger2['default'].errorAndThrow('avd or deviceName should be specified when reboot option is enables');
        }
        if (!caps.platformVersion) {
          _logger2['default'].errorAndThrow('avd or platformVersion should be specified when reboot option is enabled');
        }
        var avdDevice = caps.deviceName.replace(/[^a-zA-Z0-9_.]/g, "-");
        this.opts.avd = avdDevice + '__' + caps.platformVersion;
      }
    }
  }, {
    key: 'addWipeDataToAvdArgs',
    value: function addWipeDataToAvdArgs() {
      if (!this.opts.avdArgs) {
        this.opts.avdArgs = '-wipe-data';
      } else if (this.opts.avdArgs.toLowerCase().indexOf("-wipe-data") === -1) {
        this.opts.avdArgs += ' -wipe-data';
      }
    }
  }, {
    key: 'onSettingsUpdate',
    value: function onSettingsUpdate(key, value) {
      return _regeneratorRuntime.async(function onSettingsUpdate$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!(key === "ignoreUnimportantViews")) {
              context$2$0.next = 3;
              break;
            }

            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(this.setCompressedLayoutHierarchy(value));

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'startAndroidSession',
    value: function startAndroidSession() {
      return _regeneratorRuntime.async(function startAndroidSession$(context$2$0) {
        var _this = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            _logger2['default'].info('Starting Android session');
            // set up the device to run on (real or emulator, etc)
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(_androidHelpers2['default'].initDevice(this.adb, this.opts));

          case 3:
            this.defaultIME = context$2$0.sent;

            // set actual device name, udid & platform version
            this.caps.deviceName = this.adb.curDeviceId;
            this.caps.deviceUDID = this.opts.udid;
            context$2$0.next = 8;
            return _regeneratorRuntime.awrap(this.adb.getPlatformVersion());

          case 8:
            this.caps.platformVersion = context$2$0.sent;
            context$2$0.next = 11;
            return _regeneratorRuntime.awrap(_androidHelpers2['default'].unlock(this.adb));

          case 11:
            if (!this.opts.autoLaunch) {
              context$2$0.next = 14;
              break;
            }

            context$2$0.next = 14;
            return _regeneratorRuntime.awrap(this.initAUT());

          case 14:
            // start UiAutomator
            this.bootstrap = new _androidHelpers2['default'].bootstrap(this.adb, this.bootstrapPort, this.opts.websocket);
            context$2$0.next = 17;
            return _regeneratorRuntime.awrap(this.bootstrap.start(this.opts.appPackage, this.opts.disableAndroidWatchers));

          case 17:
            // handling unexpected shutdown
            this.bootstrap.onUnexpectedShutdown['catch'](function callee$2$0(err) {
              return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    if (this.bootstrap.ignoreUnexpectedShutdown) {
                      context$3$0.next = 3;
                      break;
                    }

                    context$3$0.next = 3;
                    return _regeneratorRuntime.awrap(this.startUnexpectedShutdown(err));

                  case 3:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this);
            });

            // Set CompressedLayoutHierarchy on the device based on current settings object
            // this has to happen _after_ bootstrap is initialized

            if (!this.opts.ignoreUnimportantViews) {
              context$2$0.next = 21;
              break;
            }

            context$2$0.next = 21;
            return _regeneratorRuntime.awrap(this.settings.update({ ignoreUnimportantViews: this.opts.ignoreUnimportantViews }));

          case 21:
            if (!this.isChromeSession) {
              context$2$0.next = 26;
              break;
            }

            context$2$0.next = 24;
            return _regeneratorRuntime.awrap(this.startChromeSession());

          case 24:
            context$2$0.next = 29;
            break;

          case 26:
            if (!this.opts.autoLaunch) {
              context$2$0.next = 29;
              break;
            }

            context$2$0.next = 29;
            return _regeneratorRuntime.awrap(this.startAUT());

          case 29:
            context$2$0.next = 31;
            return _regeneratorRuntime.awrap(this.initAutoWebview());

          case 31:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'initAutoWebview',
    value: function initAutoWebview() {
      return _regeneratorRuntime.async(function initAutoWebview$(context$2$0) {
        var _this3 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!this.opts.autoWebview) {
              context$2$0.next = 3;
              break;
            }

            context$2$0.next = 3;
            return _regeneratorRuntime.awrap((function callee$2$0() {
              var viewName, timeout;
              return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                var _this2 = this;

                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    viewName = this.defaultWebviewName();
                    timeout = this.opts.autoWebviewTimeout || 2000;

                    _logger2['default'].info('Setting auto webview to context \'' + viewName + '\' with timeout ' + timeout + 'ms');

                    // try every 500ms until timeout is over
                    context$3$0.next = 5;
                    return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(timeout / 500, 500, function callee$3$0() {
                      return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                        while (1) switch (context$4$0.prev = context$4$0.next) {
                          case 0:
                            context$4$0.next = 2;
                            return _regeneratorRuntime.awrap(this.setContext(viewName));

                          case 2:
                          case 'end':
                            return context$4$0.stop();
                        }
                      }, null, _this2);
                    }));

                  case 5:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this3);
            })());

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'initAUT',
    value: function initAUT() {
      var launchInfo;
      return _regeneratorRuntime.async(function initAUT$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(_androidHelpers2['default'].getLaunchInfo(this.adb, this.opts));

          case 2:
            launchInfo = context$2$0.sent;

            _Object$assign(this.opts, launchInfo);
            _Object$assign(this.caps, launchInfo);
            // install app

            if (this.opts.app) {
              context$2$0.next = 12;
              break;
            }

            if (this.opts.fullReset) {
              _logger2['default'].errorAndThrow('Full reset requires an app capability, use fastReset if app is not provided');
            }
            _logger2['default'].debug('No app capability. Assuming it is already on the device');

            if (!this.opts.fastReset) {
              context$2$0.next = 11;
              break;
            }

            context$2$0.next = 11;
            return _regeneratorRuntime.awrap(_androidHelpers2['default'].resetApp(this.adb, this.opts.app, this.opts.appPackage, this.opts.fastReset));

          case 11:
            return context$2$0.abrupt('return');

          case 12:
            if (this.opts.skipUninstall) {
              context$2$0.next = 15;
              break;
            }

            context$2$0.next = 15;
            return _regeneratorRuntime.awrap(this.adb.uninstallApk(this.opts.appPackage));

          case 15:
            context$2$0.next = 17;
            return _regeneratorRuntime.awrap(_androidHelpers2['default'].installApkRemotely(this.adb, this.opts));

          case 17:
            context$2$0.next = 19;
            return _regeneratorRuntime.awrap(_androidHelpers2['default'].pushStrings(this.opts.language, this.adb, this.opts));

          case 19:
            this.apkStrings[this.opts.language] = context$2$0.sent;

          case 20:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'startChromeSession',
    value: function startChromeSession() {
      var opts, knownPackages;
      return _regeneratorRuntime.async(function startChromeSession$(context$2$0) {
        var _this4 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            _logger2['default'].info("Starting a chrome-based browser session");
            opts = _lodash2['default'].cloneDeep(this.opts);

            opts.chromeUseRunningApp = false;

            knownPackages = ["org.chromium.chrome.shell", "com.android.chrome", "com.chrome.beta", "org.chromium.chrome"];

            if (!_lodash2['default'].contains(knownPackages, this.opts.appPackage)) {
              opts.chromeAndroidActivity = this.opts.appActivity;
            }
            context$2$0.next = 7;
            return _regeneratorRuntime.awrap((0, _commandsContext.setupNewChromedriver)(opts, this.adb.curDeviceId, this.adb.getAdbServerPort()));

          case 7:
            this.chromedriver = context$2$0.sent;

            this.chromedriver.on(_appiumChromedriver2['default'].EVENT_CHANGED, function (msg) {
              if (msg.state === _appiumChromedriver2['default'].STATE_STOPPED) {
                _this4.onChromedriverStop(_webviewHelpers.CHROMIUM_WIN);
              }
            });

            // Now that we have a Chrome session, we ensure that the context is
            // appropriately set and that this chromedriver is added to the list
            // of session chromedrivers so we can switch back and forth
            this.curContext = _webviewHelpers.CHROMIUM_WIN;
            this.sessionChromedrivers[_webviewHelpers.CHROMIUM_WIN] = this.chromedriver;
            this.proxyReqRes = this.chromedriver.proxyReq.bind(this.chromedriver);
            this.jwpProxyActive = true;

          case 13:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'checkAppPresent',
    value: function checkAppPresent() {
      return _regeneratorRuntime.async(function checkAppPresent$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            _logger2['default'].debug("Checking whether app is actually present");
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(this.opts.app));

          case 3:
            if (context$2$0.sent) {
              context$2$0.next = 5;
              break;
            }

            _logger2['default'].errorAndThrow('Could not find app apk at ' + this.opts.app);

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'checkPackagePresent',
    value: function checkPackagePresent() {
      return _regeneratorRuntime.async(function checkPackagePresent$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            _logger2['default'].debug("Checking whether package is present on the device");
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(this.adb.shell(['pm', 'list', 'packages', this.opts.appPackage]));

          case 3:
            if (context$2$0.sent) {
              context$2$0.next = 5;
              break;
            }

            _logger2['default'].errorAndThrow('Could not find package ' + this.opts.appPackage + ' on the device');

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }

    // Set CompressedLayoutHierarchy on the device
  }, {
    key: 'setCompressedLayoutHierarchy',
    value: function setCompressedLayoutHierarchy(compress) {
      return _regeneratorRuntime.async(function setCompressedLayoutHierarchy$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.bootstrap.sendAction("compressedLayoutHierarchy", { compressLayout: compress }));

          case 2:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'deleteSession',
    value: function deleteSession() {
      var avdName;
      return _regeneratorRuntime.async(function deleteSession$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            _logger2['default'].debug("Shutting down Android driver");
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(_get(Object.getPrototypeOf(AndroidDriver.prototype), 'deleteSession', this).call(this));

          case 3:
            if (!this.bootstrap) {
              context$2$0.next = 24;
              break;
            }

            context$2$0.next = 6;
            return _regeneratorRuntime.awrap(this.stopChromedriverProxies());

          case 6:
            if (!(this.opts.unicodeKeyboard && this.opts.resetKeyboard && this.defaultIME)) {
              context$2$0.next = 10;
              break;
            }

            _logger2['default'].debug('Resetting IME to ' + this.defaultIME);
            context$2$0.next = 10;
            return _regeneratorRuntime.awrap(this.adb.setIME(this.defaultIME));

          case 10:
            if (this.isChromeSession) {
              context$2$0.next = 13;
              break;
            }

            context$2$0.next = 13;
            return _regeneratorRuntime.awrap(this.adb.forceStop(this.opts.appPackage));

          case 13:
            context$2$0.next = 15;
            return _regeneratorRuntime.awrap(this.adb.goToHome());

          case 15:
            if (!(this.opts.fullReset && !this.opts.skipUninstall && !this.appOnDevice)) {
              context$2$0.next = 18;
              break;
            }

            context$2$0.next = 18;
            return _regeneratorRuntime.awrap(this.adb.uninstallApk(this.opts.appPackage));

          case 18:
            context$2$0.next = 20;
            return _regeneratorRuntime.awrap(this.bootstrap.shutdown());

          case 20:
            if (this.opts.reboot) {
              avdName = this.opts.avd.replace('@', '');

              _logger2['default'].debug('closing emulator \'' + avdName + '\'');
              this.adb.killEmulator(avdName);
            }
            this.bootstrap = null;
            context$2$0.next = 25;
            break;

          case 24:
            _logger2['default'].debug("Called deleteSession but bootstrap wasn't active");

          case 25:
            context$2$0.next = 27;
            return _regeneratorRuntime.awrap(this.adb.forceStop('io.appium.unlock'));

          case 27:
            context$2$0.next = 29;
            return _regeneratorRuntime.awrap(this.adb.stopLogcat());

          case 29:
            if (!this.opts.clearSystemFiles) {
              context$2$0.next = 45;
              break;
            }

            if (!this.opts.appIsTemp) {
              context$2$0.next = 42;
              break;
            }

            _logger2['default'].debug('Temporary copy of app was made: deleting \'' + this.opts.app + '\'');
            context$2$0.prev = 32;
            context$2$0.next = 35;
            return _regeneratorRuntime.awrap(_appiumSupport.fs.rimraf(this.opts.app));

          case 35:
            context$2$0.next = 40;
            break;

          case 37:
            context$2$0.prev = 37;
            context$2$0.t0 = context$2$0['catch'](32);

            _logger2['default'].warn('Unable to delete temporary app: ' + context$2$0.t0.message);

          case 40:
            context$2$0.next = 43;
            break;

          case 42:
            _logger2['default'].debug('App was not copied, so not deleting');

          case 43:
            context$2$0.next = 46;
            break;

          case 45:
            _logger2['default'].debug('Not cleaning generated files. Add `clearSystemFiles` capability if wanted.');

          case 46:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[32, 37]]);
    }
  }, {
    key: 'validateDesiredCaps',
    value: function validateDesiredCaps(caps) {
      // check with the base class, and return if it fails
      var res = _get(Object.getPrototypeOf(AndroidDriver.prototype), 'validateDesiredCaps', this).call(this, caps);
      if (!res) return res;

      // make sure that the capabilities have one of `app`, `appPackage` or `browser`
      if ((!caps.browserName || !_androidHelpers2['default'].isChromeBrowser(caps.browserName)) && !caps.app && !caps.appPackage) {
        var msg = 'The desired capabilities must include either an app, package or browser';
        _logger2['default'].errorAndThrow(msg);
      }
      // warn if the capabilities have both `app` and `browser, although this
      // is common with selenium grid
      if (caps.browserName && caps.app) {
        var msg = 'The desired capabilities should generally not include both an app and a browser';
        _logger2['default'].warn(msg);
      }
    }
  }, {
    key: 'proxyActive',
    value: function proxyActive(sessionId) {
      _get(Object.getPrototypeOf(AndroidDriver.prototype), 'proxyActive', this).call(this, sessionId);

      return this.jwpProxyActive;
    }
  }, {
    key: 'getProxyAvoidList',
    value: function getProxyAvoidList(sessionId) {
      _get(Object.getPrototypeOf(AndroidDriver.prototype), 'getProxyAvoidList', this).call(this, sessionId);

      return this.jwpProxyAvoid;
    }
  }, {
    key: 'canProxy',
    value: function canProxy(sessionId) {
      _get(Object.getPrototypeOf(AndroidDriver.prototype), 'canProxy', this).call(this, sessionId);

      // this will change depending on ChromeDriver status
      return _lodash2['default'].isFunction(this.proxyReqRes);
    }
  }, {
    key: 'appOnDevice',
    get: function get() {
      return this.helpers.isPackageOrBundle(this.opts.app) || !this.opts.app && this.helpers.isPackageOrBundle(this.opts.appPackage);
    }
  }, {
    key: 'isChromeSession',
    get: function get() {
      return _androidHelpers2['default'].isChromeBrowser(this.opts.browserName);
    }
  }]);

  return AndroidDriver;
})(_appiumBaseDriver.BaseDriver);

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {

  for (var _iterator = _getIterator(_lodash2['default'].pairs(_commandsIndex2['default'])), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var _step$value = _slicedToArray(_step.value, 2);

    var cmd = _step$value[0];
    var fn = _step$value[1];

    AndroidDriver.prototype[cmd] = fn;
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

exports['default'] = AndroidDriver;
module.exports = exports['default'];

// the whole createSession flow is surrounded in a try-catch statement
// if creating a session fails at any point, we teardown everything we
// set up before throwing the error.

// find and copy, or download and unzip an app url or path

// ignoring delete session exception if any and throw the real error
// that happened while creating the session.

// Let's try to unlock before installing the app
// unlock the device

// If the user sets autoLaunch to false, they are responsible for initAUT() and startAUT()

// set up app under test

// start a chromedriver session and proxy to it

// start app

// populate appPackage, appActivity, appWaitPackage, appWaitActivity,
// and the device being used
// in the opts and caps (so it gets back to the user on session creation)

// certain cleanup we only care to do if the bootstrap was ever run

// some cleanup we want to do regardless, in case we are shutting down
// mid-startup
//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFDZixpQkFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7R0FDbkM7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBRWMsYUFBYSIsImZpbGUiOiJsaWIvZHJpdmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZURyaXZlciwgRGV2aWNlU2V0dGluZ3MgfSBmcm9tICdhcHBpdW0tYmFzZS1kcml2ZXInO1xuaW1wb3J0IENocm9tZWRyaXZlciBmcm9tICdhcHBpdW0tY2hyb21lZHJpdmVyJztcbmltcG9ydCBkZXNpcmVkQ29uc3RyYWludHMgZnJvbSAnLi9kZXNpcmVkLWNhcHMnO1xuaW1wb3J0IGNvbW1hbmRzIGZyb20gJy4vY29tbWFuZHMvaW5kZXgnO1xuaW1wb3J0IHsgc2V0dXBOZXdDaHJvbWVkcml2ZXIgfSBmcm9tICcuL2NvbW1hbmRzL2NvbnRleHQnO1xuaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi9hbmRyb2lkLWhlbHBlcnMnO1xuaW1wb3J0IHsgQ0hST01JVU1fV0lOIH0gZnJvbSAnLi93ZWJ2aWV3LWhlbHBlcnMnO1xuaW1wb3J0IGxvZyBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgREVGQVVMVF9BREJfUE9SVCB9IGZyb20gJ2FwcGl1bS1hZGInO1xuaW1wb3J0IHsgZnMsIHRlbXBEaXIgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5pbXBvcnQgeyByZXRyeUludGVydmFsIH0gZnJvbSAnYXN5bmNib3gnO1xuaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gJy4uLy4uL3BhY2thZ2UuanNvbic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLXVucmVzb2x2ZWRcblxuXG5jb25zdCBBUFBfRVhURU5TSU9OID0gJy5hcGsnO1xuY29uc3QgREVWSUNFX1BPUlQgPSA0NzI0O1xuXG4vLyBUaGlzIGlzIGEgc2V0IG9mIG1ldGhvZHMgYW5kIHBhdGhzIHRoYXQgd2UgbmV2ZXIgd2FudCB0byBwcm94eSB0b1xuLy8gQ2hyb21lZHJpdmVyXG5jb25zdCBOT19QUk9YWSA9IFtcbiAgWydQT1NUJywgbmV3IFJlZ0V4cCgnXi9zZXNzaW9uL1teL10rL2NvbnRleHQnKV0sXG4gIFsnR0VUJywgbmV3IFJlZ0V4cCgnXi9zZXNzaW9uL1teL10rL2NvbnRleHQnKV0sXG4gIFsnUE9TVCcsIG5ldyBSZWdFeHAoJ14vc2Vzc2lvbi9bXi9dKy9hcHBpdW0nKV0sXG4gIFsnR0VUJywgbmV3IFJlZ0V4cCgnXi9zZXNzaW9uL1teL10rL2FwcGl1bScpXSxcbiAgWydQT1NUJywgbmV3IFJlZ0V4cCgnXi9zZXNzaW9uL1teL10rL3RvdWNoL3BlcmZvcm0nKV0sXG4gIFsnUE9TVCcsIG5ldyBSZWdFeHAoJ14vc2Vzc2lvbi9bXi9dKy90b3VjaC9tdWx0aS9wZXJmb3JtJyldLFxuICBbJ1BPU1QnLCBuZXcgUmVnRXhwKCdeL3Nlc3Npb24vW14vXSsvb3JpZW50YXRpb24nKV0sXG4gIFsnR0VUJywgbmV3IFJlZ0V4cCgnXi9zZXNzaW9uL1teL10rL29yaWVudGF0aW9uJyldLFxuXTtcblxuY2xhc3MgQW5kcm9pZERyaXZlciBleHRlbmRzIEJhc2VEcml2ZXIge1xuICBjb25zdHJ1Y3RvciAob3B0cyA9IHt9LCBzaG91bGRWYWxpZGF0ZUNhcHMgPSB0cnVlKSB7XG4gICAgc3VwZXIob3B0cywgc2hvdWxkVmFsaWRhdGVDYXBzKTtcblxuICAgIGxvZy5kZWJ1ZyhgQW5kcm9pZERyaXZlciB2ZXJzaW9uOiAke3ZlcnNpb259YCk7XG5cbiAgICB0aGlzLmxvY2F0b3JTdHJhdGVnaWVzID0gW1xuICAgICAgJ3hwYXRoJyxcbiAgICAgICdpZCcsXG4gICAgICAnY2xhc3MgbmFtZScsXG4gICAgICAnYWNjZXNzaWJpbGl0eSBpZCcsXG4gICAgICAnLWFuZHJvaWQgdWlhdXRvbWF0b3InXG4gICAgXTtcbiAgICB0aGlzLmRlc2lyZWRDYXBDb25zdHJhaW50cyA9IGRlc2lyZWRDb25zdHJhaW50cztcbiAgICB0aGlzLnNlc3Npb25DaHJvbWVkcml2ZXJzID0ge307XG4gICAgdGhpcy5qd3BQcm94eUFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuandwUHJveHlBdm9pZCA9IF8uY2xvbmUoTk9fUFJPWFkpO1xuICAgIHRoaXMuc2V0dGluZ3MgPSBuZXcgRGV2aWNlU2V0dGluZ3Moe2lnbm9yZVVuaW1wb3J0YW50Vmlld3M6IGZhbHNlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25TZXR0aW5nc1VwZGF0ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNocm9tZWRyaXZlciA9IG51bGw7XG4gICAgdGhpcy5hcGtTdHJpbmdzID0ge307XG4gICAgdGhpcy5hY2NlcHRTc2xDZXJ0cyA9ICEhb3B0cy5hY2NlcHRTc2xDZXJ0cztcbiAgICB0aGlzLmJvb3RzdHJhcFBvcnQgPSBvcHRzLmJvb3RzdHJhcFBvcnQgfHwgREVWSUNFX1BPUlQ7XG4gIH1cblxuICBhc3luYyBjcmVhdGVTZXNzaW9uIChjYXBzKSB7XG4gICAgLy8gdGhlIHdob2xlIGNyZWF0ZVNlc3Npb24gZmxvdyBpcyBzdXJyb3VuZGVkIGluIGEgdHJ5LWNhdGNoIHN0YXRlbWVudFxuICAgIC8vIGlmIGNyZWF0aW5nIGEgc2Vzc2lvbiBmYWlscyBhdCBhbnkgcG9pbnQsIHdlIHRlYXJkb3duIGV2ZXJ5dGhpbmcgd2VcbiAgICAvLyBzZXQgdXAgYmVmb3JlIHRocm93aW5nIHRoZSBlcnJvci5cbiAgICB0cnkge1xuICAgICAgbGV0IHNlc3Npb25JZDtcbiAgICAgIFtzZXNzaW9uSWRdID0gYXdhaXQgc3VwZXIuY3JlYXRlU2Vzc2lvbihjYXBzKTtcblxuICAgICAgbGV0IHNlcnZlckRldGFpbHMgPSB7cGxhdGZvcm06ICdMSU5VWCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWJTdG9yYWdlRW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0YWtlc1NjcmVlbnNob3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFiYXNlRW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBuZXR3b3JrQ29ubmVjdGlvbkVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbkNvbnRleHRFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhcm5pbmdzOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2lyZWQ6IHRoaXMuY2Fwc307XG5cbiAgICAgIHRoaXMuY2FwcyA9IE9iamVjdC5hc3NpZ24oc2VydmVyRGV0YWlscywgdGhpcy5jYXBzKTtcblxuICAgICAgLy8gYXNzaWduaW5nIGRlZmF1bHRzXG4gICAgICBsZXQgZGVmYXVsdE9wdHMgPSB7XG4gICAgICAgIGFjdGlvbjogXCJhbmRyb2lkLmludGVudC5hY3Rpb24uTUFJTlwiLFxuICAgICAgICBjYXRlZ29yeTogXCJhbmRyb2lkLmludGVudC5jYXRlZ29yeS5MQVVOQ0hFUlwiLFxuICAgICAgICBmbGFnczogXCIweDEwMjAwMDAwXCIsXG4gICAgICAgIGRpc2FibGVBbmRyb2lkV2F0Y2hlcnM6IGZhbHNlLFxuICAgICAgICB0bXBEaXI6IGF3YWl0IHRlbXBEaXIuc3RhdGljRGlyKCksXG4gICAgICAgIGZ1bGxSZXNldDogZmFsc2UsXG4gICAgICAgIGF1dG9MYXVuY2g6IHRydWUsXG4gICAgICAgIGFkYlBvcnQ6IERFRkFVTFRfQURCX1BPUlQsXG4gICAgICAgIGFuZHJvaWRJbnN0YWxsVGltZW91dDogOTAwMDBcbiAgICAgIH07XG4gICAgICBfLmRlZmF1bHRzKHRoaXMub3B0cywgZGVmYXVsdE9wdHMpO1xuICAgICAgaWYgKCF0aGlzLm9wdHMuamF2YVZlcnNpb24pIHtcbiAgICAgICAgdGhpcy5vcHRzLmphdmFWZXJzaW9uID0gYXdhaXQgaGVscGVycy5nZXRKYXZhVmVyc2lvbigpO1xuICAgICAgfVxuXG4gICAgICAvLyBub3QgdXNlciB2aXNpYmxlIHZpYSBjYXBzXG4gICAgICBpZiAodGhpcy5vcHRzLm5vUmVzZXQgPT09IHRydWUpIHRoaXMub3B0cy5mdWxsUmVzZXQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLm9wdHMuZnVsbFJlc2V0ID09PSB0cnVlKSB0aGlzLm9wdHMubm9SZXNldCA9IGZhbHNlO1xuICAgICAgdGhpcy5vcHRzLmZhc3RSZXNldCA9ICF0aGlzLm9wdHMuZnVsbFJlc2V0ICYmICF0aGlzLm9wdHMubm9SZXNldDtcbiAgICAgIHRoaXMub3B0cy5za2lwVW5pbnN0YWxsID0gdGhpcy5vcHRzLmZhc3RSZXNldCB8fCB0aGlzLm9wdHMubm9SZXNldDtcblxuICAgICAgdGhpcy5jdXJDb250ZXh0ID0gdGhpcy5kZWZhdWx0Q29udGV4dE5hbWUoKTtcblxuICAgICAgaWYgKHRoaXMuaXNDaHJvbWVTZXNzaW9uKSB7XG4gICAgICAgIGxvZy5pbmZvKFwiV2UncmUgZ29pbmcgdG8gcnVuIGEgQ2hyb21lLWJhc2VkIHNlc3Npb25cIik7XG4gICAgICAgIGxldCB7cGtnLCBhY3Rpdml0eX0gPSBoZWxwZXJzLmdldENocm9tZVBrZyh0aGlzLm9wdHMuYnJvd3Nlck5hbWUpO1xuICAgICAgICB0aGlzLm9wdHMuYXBwUGFja2FnZSA9IHBrZztcbiAgICAgICAgdGhpcy5vcHRzLmFwcEFjdGl2aXR5ID0gYWN0aXZpdHk7XG4gICAgICAgIGxvZy5pbmZvKGBDaHJvbWUtdHlwZSBwYWNrYWdlIGFuZCBhY3Rpdml0eSBhcmUgJHtwa2d9IGFuZCAke2FjdGl2aXR5fWApO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRzLm5hdGl2ZVdlYlNjcmVlbnNob3QpIHtcbiAgICAgICAgdGhpcy5qd3BQcm94eUF2b2lkLnB1c2goWydHRVQnLCBuZXcgUmVnRXhwKCdeL3Nlc3Npb24vW14vXSsvc2NyZWVuc2hvdCcpXSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdHMucmVib290KSB7XG4gICAgICAgIHRoaXMuc2V0QXZkRnJvbUNhcGFiaWxpdGllcyhjYXBzKTtcbiAgICAgICAgdGhpcy5hZGRXaXBlRGF0YVRvQXZkQXJncygpO1xuICAgICAgfVxuXG4gICAgICAvLyBnZXQgZGV2aWNlIHVkaWQgZm9yIHRoaXMgc2Vzc2lvblxuICAgICAgbGV0IHt1ZGlkLCBlbVBvcnR9ID0gYXdhaXQgaGVscGVycy5nZXREZXZpY2VJbmZvRnJvbUNhcHModGhpcy5vcHRzKTtcbiAgICAgIHRoaXMub3B0cy51ZGlkID0gdWRpZDtcbiAgICAgIHRoaXMub3B0cy5lbVBvcnQgPSBlbVBvcnQ7XG5cbiAgICAgIC8vIHNldCB1cCBhbiBpbnN0YW5jZSBvZiBBREJcbiAgICAgIHRoaXMuYWRiID0gYXdhaXQgaGVscGVycy5jcmVhdGVBREIodGhpcy5vcHRzLmphdmFWZXJzaW9uLCB0aGlzLm9wdHMudWRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRzLmVtUG9ydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRzLmFkYlBvcnQpO1xuXG4gICAgICBpZiAodGhpcy5oZWxwZXJzLmlzUGFja2FnZU9yQnVuZGxlKHRoaXMub3B0cy5hcHApKXtcbiAgICAgICAgLy8gdXNlciBwcm92aWRlZCBwYWNrYWdlIGluc3RlYWQgb2YgYXBwIGZvciAnYXBwJyBjYXBhYmlsaXR5LCBtYXNzYWdlIG9wdGlvbnNcbiAgICAgICAgdGhpcy5vcHRzLmFwcFBhY2thZ2UgPSB0aGlzLm9wdHMuYXBwO1xuICAgICAgICB0aGlzLm9wdHMuYXBwID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0cy5hcHApIHtcbiAgICAgICAgLy8gZmluZCBhbmQgY29weSwgb3IgZG93bmxvYWQgYW5kIHVuemlwIGFuIGFwcCB1cmwgb3IgcGF0aFxuICAgICAgICB0aGlzLm9wdHMuYXBwID0gYXdhaXQgdGhpcy5oZWxwZXJzLmNvbmZpZ3VyZUFwcCh0aGlzLm9wdHMuYXBwLCBBUFBfRVhURU5TSU9OKTtcbiAgICAgICAgdGhpcy5vcHRzLmFwcElzVGVtcCA9IGNhcHMuYXBwICE9PSB0aGlzLm9wdHMuYXBwOyAvLyBkaWQgd2UgbWFrZSBhIHRlbXBvcmFyeSBjb3B5P1xuICAgICAgICBhd2FpdCB0aGlzLmNoZWNrQXBwUHJlc2VudCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmFwcE9uRGV2aWNlKSB7XG4gICAgICAgIC8vIHRoZSBhcHAgaXNuJ3QgYW4gYWN0dWFsIGFwcCBmaWxlIGJ1dCByYXRoZXIgc29tZXRoaW5nIHdlIHdhbnQgdG9cbiAgICAgICAgLy8gYXNzdW1lIGlzIG9uIHRoZSBkZXZpY2UgYW5kIGp1c3QgbGF1bmNoIHZpYSB0aGUgYXBwUGFja2FnZVxuICAgICAgICBsb2cuaW5mbyhgQXBwIGZpbGUgd2FzIG5vdCBsaXN0ZWQsIGluc3RlYWQgd2UncmUgZ29pbmcgdG8gcnVuIGAgK1xuICAgICAgICAgICAgICAgICBgJHt0aGlzLm9wdHMuYXBwUGFja2FnZX0gZGlyZWN0bHkgb24gdGhlIGRldmljZWApO1xuICAgICAgICBhd2FpdCB0aGlzLmNoZWNrUGFja2FnZVByZXNlbnQoKTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy5zdGFydEFuZHJvaWRTZXNzaW9uKHRoaXMub3B0cyk7XG4gICAgICByZXR1cm4gW3Nlc3Npb25JZCwgdGhpcy5jYXBzXTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBpZ25vcmluZyBkZWxldGUgc2Vzc2lvbiBleGNlcHRpb24gaWYgYW55IGFuZCB0aHJvdyB0aGUgcmVhbCBlcnJvclxuICAgICAgLy8gdGhhdCBoYXBwZW5lZCB3aGlsZSBjcmVhdGluZyB0aGUgc2Vzc2lvbi5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMuZGVsZXRlU2Vzc2lvbigpO1xuICAgICAgfSBjYXRjaCAoaWduKSB7fVxuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cblxuICBzZXRBdmRGcm9tQ2FwYWJpbGl0aWVzIChjYXBzKSB7XG4gICAgaWYgKHRoaXMub3B0cy5hdmQpIHtcbiAgICAgIGxvZy5pbmZvKCdhdmQgbmFtZSBkZWZpbmVkLCBpZ25vcmluZyBkZXZpY2UgbmFtZSBhbmQgcGxhdGZvcm0gdmVyc2lvbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNhcHMuZGV2aWNlTmFtZSkge1xuICAgICAgICBsb2cuZXJyb3JBbmRUaHJvdygnYXZkIG9yIGRldmljZU5hbWUgc2hvdWxkIGJlIHNwZWNpZmllZCB3aGVuIHJlYm9vdCBvcHRpb24gaXMgZW5hYmxlcycpO1xuICAgICAgfVxuICAgICAgaWYgKCFjYXBzLnBsYXRmb3JtVmVyc2lvbikge1xuICAgICAgICBsb2cuZXJyb3JBbmRUaHJvdygnYXZkIG9yIHBsYXRmb3JtVmVyc2lvbiBzaG91bGQgYmUgc3BlY2lmaWVkIHdoZW4gcmVib290IG9wdGlvbiBpcyBlbmFibGVkJyk7XG4gICAgICB9XG4gICAgICBsZXQgYXZkRGV2aWNlID0gY2Fwcy5kZXZpY2VOYW1lLnJlcGxhY2UoL1teYS16QS1aMC05Xy5dL2csIFwiLVwiKTtcbiAgICAgIHRoaXMub3B0cy5hdmQgPSBgJHthdmREZXZpY2V9X18ke2NhcHMucGxhdGZvcm1WZXJzaW9ufWA7XG4gICAgfVxuICB9XG5cbiAgYWRkV2lwZURhdGFUb0F2ZEFyZ3MgKCkge1xuICAgIGlmICghdGhpcy5vcHRzLmF2ZEFyZ3MpIHtcbiAgICAgIHRoaXMub3B0cy5hdmRBcmdzID0gJy13aXBlLWRhdGEnO1xuICAgIH0gZWxzZSAgaWYgKHRoaXMub3B0cy5hdmRBcmdzLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcIi13aXBlLWRhdGFcIikgPT09IC0xKSB7XG4gICAgICB0aGlzLm9wdHMuYXZkQXJncyArPSAnIC13aXBlLWRhdGEnO1xuICAgIH1cbiAgfVxuXG4gIGdldCBhcHBPbkRldmljZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGVscGVycy5pc1BhY2thZ2VPckJ1bmRsZSh0aGlzLm9wdHMuYXBwKSB8fCAoIXRoaXMub3B0cy5hcHAgJiZcbiAgICAgICAgICAgdGhpcy5oZWxwZXJzLmlzUGFja2FnZU9yQnVuZGxlKHRoaXMub3B0cy5hcHBQYWNrYWdlKSk7XG4gIH1cblxuICBnZXQgaXNDaHJvbWVTZXNzaW9uICgpIHtcbiAgICByZXR1cm4gaGVscGVycy5pc0Nocm9tZUJyb3dzZXIodGhpcy5vcHRzLmJyb3dzZXJOYW1lKTtcbiAgfVxuXG4gIGFzeW5jIG9uU2V0dGluZ3NVcGRhdGUgKGtleSwgdmFsdWUpIHtcbiAgICBpZiAoa2V5ID09PSBcImlnbm9yZVVuaW1wb3J0YW50Vmlld3NcIikge1xuICAgICAgYXdhaXQgdGhpcy5zZXRDb21wcmVzc2VkTGF5b3V0SGllcmFyY2h5KHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzdGFydEFuZHJvaWRTZXNzaW9uICgpIHtcbiAgICBsb2cuaW5mbyhgU3RhcnRpbmcgQW5kcm9pZCBzZXNzaW9uYCk7XG4gICAgLy8gc2V0IHVwIHRoZSBkZXZpY2UgdG8gcnVuIG9uIChyZWFsIG9yIGVtdWxhdG9yLCBldGMpXG4gICAgdGhpcy5kZWZhdWx0SU1FID0gYXdhaXQgaGVscGVycy5pbml0RGV2aWNlKHRoaXMuYWRiLCB0aGlzLm9wdHMpO1xuXG4gICAgLy8gc2V0IGFjdHVhbCBkZXZpY2UgbmFtZSwgdWRpZCAmIHBsYXRmb3JtIHZlcnNpb25cbiAgICB0aGlzLmNhcHMuZGV2aWNlTmFtZSA9IHRoaXMuYWRiLmN1ckRldmljZUlkO1xuICAgIHRoaXMuY2Fwcy5kZXZpY2VVRElEID0gdGhpcy5vcHRzLnVkaWQ7XG4gICAgdGhpcy5jYXBzLnBsYXRmb3JtVmVyc2lvbiA9IGF3YWl0IHRoaXMuYWRiLmdldFBsYXRmb3JtVmVyc2lvbigpO1xuXG4gICAgLy8gTGV0J3MgdHJ5IHRvIHVubG9jayBiZWZvcmUgaW5zdGFsbGluZyB0aGUgYXBwXG4gICAgLy8gdW5sb2NrIHRoZSBkZXZpY2VcbiAgICBhd2FpdCBoZWxwZXJzLnVubG9jayh0aGlzLmFkYik7XG4gICAgLy8gSWYgdGhlIHVzZXIgc2V0cyBhdXRvTGF1bmNoIHRvIGZhbHNlLCB0aGV5IGFyZSByZXNwb25zaWJsZSBmb3IgaW5pdEFVVCgpIGFuZCBzdGFydEFVVCgpXG4gICAgaWYgKHRoaXMub3B0cy5hdXRvTGF1bmNoKSB7XG4gICAgICAvLyBzZXQgdXAgYXBwIHVuZGVyIHRlc3RcbiAgICAgIGF3YWl0IHRoaXMuaW5pdEFVVCgpO1xuICAgIH1cbiAgICAvLyBzdGFydCBVaUF1dG9tYXRvclxuICAgIHRoaXMuYm9vdHN0cmFwID0gbmV3IGhlbHBlcnMuYm9vdHN0cmFwKHRoaXMuYWRiLCB0aGlzLmJvb3RzdHJhcFBvcnQsIHRoaXMub3B0cy53ZWJzb2NrZXQpO1xuICAgIGF3YWl0IHRoaXMuYm9vdHN0cmFwLnN0YXJ0KHRoaXMub3B0cy5hcHBQYWNrYWdlLCB0aGlzLm9wdHMuZGlzYWJsZUFuZHJvaWRXYXRjaGVycyk7XG4gICAgLy8gaGFuZGxpbmcgdW5leHBlY3RlZCBzaHV0ZG93blxuICAgIHRoaXMuYm9vdHN0cmFwLm9uVW5leHBlY3RlZFNodXRkb3duLmNhdGNoKGFzeW5jIChlcnIpID0+IHtcbiAgICAgIGlmICghdGhpcy5ib290c3RyYXAuaWdub3JlVW5leHBlY3RlZFNodXRkb3duKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc3RhcnRVbmV4cGVjdGVkU2h1dGRvd24oZXJyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNldCBDb21wcmVzc2VkTGF5b3V0SGllcmFyY2h5IG9uIHRoZSBkZXZpY2UgYmFzZWQgb24gY3VycmVudCBzZXR0aW5ncyBvYmplY3RcbiAgICAvLyB0aGlzIGhhcyB0byBoYXBwZW4gX2FmdGVyXyBib290c3RyYXAgaXMgaW5pdGlhbGl6ZWRcbiAgICBpZiAodGhpcy5vcHRzLmlnbm9yZVVuaW1wb3J0YW50Vmlld3MpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2V0dGluZ3MudXBkYXRlKHtpZ25vcmVVbmltcG9ydGFudFZpZXdzOiB0aGlzLm9wdHMuaWdub3JlVW5pbXBvcnRhbnRWaWV3c30pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzQ2hyb21lU2Vzc2lvbikge1xuICAgICAgLy8gc3RhcnQgYSBjaHJvbWVkcml2ZXIgc2Vzc2lvbiBhbmQgcHJveHkgdG8gaXRcbiAgICAgIGF3YWl0IHRoaXMuc3RhcnRDaHJvbWVTZXNzaW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdHMuYXV0b0xhdW5jaCkge1xuICAgICAgICAvLyBzdGFydCBhcHBcbiAgICAgICAgYXdhaXQgdGhpcy5zdGFydEFVVCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBhd2FpdCB0aGlzLmluaXRBdXRvV2VidmlldygpO1xuICB9XG5cbiAgYXN5bmMgaW5pdEF1dG9XZWJ2aWV3ICgpIHtcbiAgICBpZiAodGhpcy5vcHRzLmF1dG9XZWJ2aWV3KSB7XG4gICAgICBsZXQgdmlld05hbWUgPSB0aGlzLmRlZmF1bHRXZWJ2aWV3TmFtZSgpO1xuICAgICAgbGV0IHRpbWVvdXQgPSAodGhpcy5vcHRzLmF1dG9XZWJ2aWV3VGltZW91dCkgfHwgMjAwMDtcblxuICAgICAgbG9nLmluZm8oYFNldHRpbmcgYXV0byB3ZWJ2aWV3IHRvIGNvbnRleHQgJyR7dmlld05hbWV9JyB3aXRoIHRpbWVvdXQgJHt0aW1lb3V0fW1zYCk7XG5cbiAgICAgIC8vIHRyeSBldmVyeSA1MDBtcyB1bnRpbCB0aW1lb3V0IGlzIG92ZXJcbiAgICAgIGF3YWl0IHJldHJ5SW50ZXJ2YWwodGltZW91dCAvIDUwMCwgNTAwLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2V0Q29udGV4dCh2aWV3TmFtZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuXG4gIGFzeW5jIGluaXRBVVQgKCkge1xuICAgIC8vIHBvcHVsYXRlIGFwcFBhY2thZ2UsIGFwcEFjdGl2aXR5LCBhcHBXYWl0UGFja2FnZSwgYXBwV2FpdEFjdGl2aXR5LFxuICAgIC8vIGFuZCB0aGUgZGV2aWNlIGJlaW5nIHVzZWRcbiAgICAvLyBpbiB0aGUgb3B0cyBhbmQgY2FwcyAoc28gaXQgZ2V0cyBiYWNrIHRvIHRoZSB1c2VyIG9uIHNlc3Npb24gY3JlYXRpb24pXG4gICAgbGV0IGxhdW5jaEluZm8gPSBhd2FpdCBoZWxwZXJzLmdldExhdW5jaEluZm8odGhpcy5hZGIsIHRoaXMub3B0cyk7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdHMsIGxhdW5jaEluZm8pO1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5jYXBzLCBsYXVuY2hJbmZvKTtcbiAgICAvLyBpbnN0YWxsIGFwcFxuICAgIGlmICghdGhpcy5vcHRzLmFwcCkge1xuICAgICAgaWYgKHRoaXMub3B0cy5mdWxsUmVzZXQpIHtcbiAgICAgICAgbG9nLmVycm9yQW5kVGhyb3coJ0Z1bGwgcmVzZXQgcmVxdWlyZXMgYW4gYXBwIGNhcGFiaWxpdHksIHVzZSBmYXN0UmVzZXQgaWYgYXBwIGlzIG5vdCBwcm92aWRlZCcpO1xuICAgICAgfVxuICAgICAgbG9nLmRlYnVnKCdObyBhcHAgY2FwYWJpbGl0eS4gQXNzdW1pbmcgaXQgaXMgYWxyZWFkeSBvbiB0aGUgZGV2aWNlJyk7XG4gICAgICBpZiAodGhpcy5vcHRzLmZhc3RSZXNldCkge1xuICAgICAgICBhd2FpdCBoZWxwZXJzLnJlc2V0QXBwKHRoaXMuYWRiLCB0aGlzLm9wdHMuYXBwLCB0aGlzLm9wdHMuYXBwUGFja2FnZSwgdGhpcy5vcHRzLmZhc3RSZXNldCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5vcHRzLnNraXBVbmluc3RhbGwpIHtcbiAgICAgIGF3YWl0IHRoaXMuYWRiLnVuaW5zdGFsbEFwayh0aGlzLm9wdHMuYXBwUGFja2FnZSk7XG4gICAgfVxuICAgIGF3YWl0IGhlbHBlcnMuaW5zdGFsbEFwa1JlbW90ZWx5KHRoaXMuYWRiLCB0aGlzLm9wdHMpO1xuICAgIHRoaXMuYXBrU3RyaW5nc1t0aGlzLm9wdHMubGFuZ3VhZ2VdID0gYXdhaXQgaGVscGVycy5wdXNoU3RyaW5ncyhcbiAgICAgICAgdGhpcy5vcHRzLmxhbmd1YWdlLCB0aGlzLmFkYiwgdGhpcy5vcHRzKTtcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0Q2hyb21lU2Vzc2lvbiAoKSB7XG4gICAgbG9nLmluZm8oXCJTdGFydGluZyBhIGNocm9tZS1iYXNlZCBicm93c2VyIHNlc3Npb25cIik7XG4gICAgbGV0IG9wdHMgPSBfLmNsb25lRGVlcCh0aGlzLm9wdHMpO1xuICAgIG9wdHMuY2hyb21lVXNlUnVubmluZ0FwcCA9IGZhbHNlO1xuXG4gICAgY29uc3Qga25vd25QYWNrYWdlcyA9IFtcIm9yZy5jaHJvbWl1bS5jaHJvbWUuc2hlbGxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tLmFuZHJvaWQuY2hyb21lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbS5jaHJvbWUuYmV0YVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJvcmcuY2hyb21pdW0uY2hyb21lXCJdO1xuXG4gICAgaWYgKCFfLmNvbnRhaW5zKGtub3duUGFja2FnZXMsIHRoaXMub3B0cy5hcHBQYWNrYWdlKSkge1xuICAgICAgb3B0cy5jaHJvbWVBbmRyb2lkQWN0aXZpdHkgPSB0aGlzLm9wdHMuYXBwQWN0aXZpdHk7XG4gICAgfVxuICAgIHRoaXMuY2hyb21lZHJpdmVyID0gYXdhaXQgc2V0dXBOZXdDaHJvbWVkcml2ZXIob3B0cywgdGhpcy5hZGIuY3VyRGV2aWNlSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkYi5nZXRBZGJTZXJ2ZXJQb3J0KCkpO1xuICAgIHRoaXMuY2hyb21lZHJpdmVyLm9uKENocm9tZWRyaXZlci5FVkVOVF9DSEFOR0VELCAobXNnKSA9PiB7XG4gICAgICBpZiAobXNnLnN0YXRlID09PSBDaHJvbWVkcml2ZXIuU1RBVEVfU1RPUFBFRCkge1xuICAgICAgICB0aGlzLm9uQ2hyb21lZHJpdmVyU3RvcChDSFJPTUlVTV9XSU4pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTm93IHRoYXQgd2UgaGF2ZSBhIENocm9tZSBzZXNzaW9uLCB3ZSBlbnN1cmUgdGhhdCB0aGUgY29udGV4dCBpc1xuICAgIC8vIGFwcHJvcHJpYXRlbHkgc2V0IGFuZCB0aGF0IHRoaXMgY2hyb21lZHJpdmVyIGlzIGFkZGVkIHRvIHRoZSBsaXN0XG4gICAgLy8gb2Ygc2Vzc2lvbiBjaHJvbWVkcml2ZXJzIHNvIHdlIGNhbiBzd2l0Y2ggYmFjayBhbmQgZm9ydGhcbiAgICB0aGlzLmN1ckNvbnRleHQgPSBDSFJPTUlVTV9XSU47XG4gICAgdGhpcy5zZXNzaW9uQ2hyb21lZHJpdmVyc1tDSFJPTUlVTV9XSU5dID0gdGhpcy5jaHJvbWVkcml2ZXI7XG4gICAgdGhpcy5wcm94eVJlcVJlcyA9IHRoaXMuY2hyb21lZHJpdmVyLnByb3h5UmVxLmJpbmQodGhpcy5jaHJvbWVkcml2ZXIpO1xuICAgIHRoaXMuandwUHJveHlBY3RpdmUgPSB0cnVlO1xuICB9XG5cbiAgYXN5bmMgY2hlY2tBcHBQcmVzZW50ICgpIHtcbiAgICBsb2cuZGVidWcoXCJDaGVja2luZyB3aGV0aGVyIGFwcCBpcyBhY3R1YWxseSBwcmVzZW50XCIpO1xuICAgIGlmICghKGF3YWl0IGZzLmV4aXN0cyh0aGlzLm9wdHMuYXBwKSkpIHtcbiAgICAgIGxvZy5lcnJvckFuZFRocm93KGBDb3VsZCBub3QgZmluZCBhcHAgYXBrIGF0ICR7dGhpcy5vcHRzLmFwcH1gKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBjaGVja1BhY2thZ2VQcmVzZW50ICgpIHtcbiAgICBsb2cuZGVidWcoXCJDaGVja2luZyB3aGV0aGVyIHBhY2thZ2UgaXMgcHJlc2VudCBvbiB0aGUgZGV2aWNlXCIpO1xuICAgIGlmICghKGF3YWl0IHRoaXMuYWRiLnNoZWxsKFsncG0nLCAnbGlzdCcsICdwYWNrYWdlcycsIHRoaXMub3B0cy5hcHBQYWNrYWdlXSkpKSB7XG4gICAgICBsb2cuZXJyb3JBbmRUaHJvdyhgQ291bGQgbm90IGZpbmQgcGFja2FnZSAke3RoaXMub3B0cy5hcHBQYWNrYWdlfSBvbiB0aGUgZGV2aWNlYCk7XG4gICAgfVxuICB9XG5cbiAgLy8gU2V0IENvbXByZXNzZWRMYXlvdXRIaWVyYXJjaHkgb24gdGhlIGRldmljZVxuICBhc3luYyBzZXRDb21wcmVzc2VkTGF5b3V0SGllcmFyY2h5IChjb21wcmVzcykge1xuICAgIGF3YWl0IHRoaXMuYm9vdHN0cmFwLnNlbmRBY3Rpb24oXCJjb21wcmVzc2VkTGF5b3V0SGllcmFyY2h5XCIsIHtjb21wcmVzc0xheW91dDogY29tcHJlc3N9KTtcbiAgfVxuXG4gIGFzeW5jIGRlbGV0ZVNlc3Npb24gKCkge1xuICAgIGxvZy5kZWJ1ZyhcIlNodXR0aW5nIGRvd24gQW5kcm9pZCBkcml2ZXJcIik7XG4gICAgYXdhaXQgc3VwZXIuZGVsZXRlU2Vzc2lvbigpO1xuICAgIGlmICh0aGlzLmJvb3RzdHJhcCkge1xuICAgICAgLy8gY2VydGFpbiBjbGVhbnVwIHdlIG9ubHkgY2FyZSB0byBkbyBpZiB0aGUgYm9vdHN0cmFwIHdhcyBldmVyIHJ1blxuICAgICAgYXdhaXQgdGhpcy5zdG9wQ2hyb21lZHJpdmVyUHJveGllcygpO1xuICAgICAgaWYgKHRoaXMub3B0cy51bmljb2RlS2V5Ym9hcmQgJiYgdGhpcy5vcHRzLnJlc2V0S2V5Ym9hcmQgJiYgdGhpcy5kZWZhdWx0SU1FKSB7XG4gICAgICAgIGxvZy5kZWJ1ZyhgUmVzZXR0aW5nIElNRSB0byAke3RoaXMuZGVmYXVsdElNRX1gKTtcbiAgICAgICAgYXdhaXQgdGhpcy5hZGIuc2V0SU1FKHRoaXMuZGVmYXVsdElNRSk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuaXNDaHJvbWVTZXNzaW9uKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYWRiLmZvcmNlU3RvcCh0aGlzLm9wdHMuYXBwUGFja2FnZSk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmFkYi5nb1RvSG9tZSgpO1xuICAgICAgaWYgKHRoaXMub3B0cy5mdWxsUmVzZXQgJiYgIXRoaXMub3B0cy5za2lwVW5pbnN0YWxsICYmICF0aGlzLmFwcE9uRGV2aWNlKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYWRiLnVuaW5zdGFsbEFwayh0aGlzLm9wdHMuYXBwUGFja2FnZSk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmJvb3RzdHJhcC5zaHV0ZG93bigpO1xuICAgICAgaWYgKHRoaXMub3B0cy5yZWJvb3QpIHtcbiAgICAgICAgbGV0IGF2ZE5hbWUgPSB0aGlzLm9wdHMuYXZkLnJlcGxhY2UoJ0AnLCAnJyk7XG4gICAgICAgIGxvZy5kZWJ1ZyhgY2xvc2luZyBlbXVsYXRvciAnJHthdmROYW1lfSdgKTtcbiAgICAgICAgdGhpcy5hZGIua2lsbEVtdWxhdG9yKGF2ZE5hbWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5ib290c3RyYXAgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cuZGVidWcoXCJDYWxsZWQgZGVsZXRlU2Vzc2lvbiBidXQgYm9vdHN0cmFwIHdhc24ndCBhY3RpdmVcIik7XG4gICAgfVxuICAgIC8vIHNvbWUgY2xlYW51cCB3ZSB3YW50IHRvIGRvIHJlZ2FyZGxlc3MsIGluIGNhc2Ugd2UgYXJlIHNodXR0aW5nIGRvd25cbiAgICAvLyBtaWQtc3RhcnR1cFxuICAgIGF3YWl0IHRoaXMuYWRiLmZvcmNlU3RvcCgnaW8uYXBwaXVtLnVubG9jaycpO1xuICAgIGF3YWl0IHRoaXMuYWRiLnN0b3BMb2djYXQoKTtcblxuICAgIGlmICh0aGlzLm9wdHMuY2xlYXJTeXN0ZW1GaWxlcykge1xuICAgICAgaWYgKHRoaXMub3B0cy5hcHBJc1RlbXApIHtcbiAgICAgICAgbG9nLmRlYnVnKGBUZW1wb3JhcnkgY29weSBvZiBhcHAgd2FzIG1hZGU6IGRlbGV0aW5nICcke3RoaXMub3B0cy5hcHB9J2ApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IGZzLnJpbXJhZih0aGlzLm9wdHMuYXBwKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgbG9nLndhcm4oYFVuYWJsZSB0byBkZWxldGUgdGVtcG9yYXJ5IGFwcDogJHtlcnIubWVzc2FnZX1gKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nLmRlYnVnKCdBcHAgd2FzIG5vdCBjb3BpZWQsIHNvIG5vdCBkZWxldGluZycpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsb2cuZGVidWcoJ05vdCBjbGVhbmluZyBnZW5lcmF0ZWQgZmlsZXMuIEFkZCBgY2xlYXJTeXN0ZW1GaWxlc2AgY2FwYWJpbGl0eSBpZiB3YW50ZWQuJyk7XG4gICAgfVxuICB9XG5cbiAgdmFsaWRhdGVEZXNpcmVkQ2FwcyAoY2Fwcykge1xuICAgIC8vIGNoZWNrIHdpdGggdGhlIGJhc2UgY2xhc3MsIGFuZCByZXR1cm4gaWYgaXQgZmFpbHNcbiAgICBsZXQgcmVzID0gc3VwZXIudmFsaWRhdGVEZXNpcmVkQ2FwcyhjYXBzKTtcbiAgICBpZiAoIXJlcykgcmV0dXJuIHJlcztcblxuICAgIC8vIG1ha2Ugc3VyZSB0aGF0IHRoZSBjYXBhYmlsaXRpZXMgaGF2ZSBvbmUgb2YgYGFwcGAsIGBhcHBQYWNrYWdlYCBvciBgYnJvd3NlcmBcbiAgICBpZiAoKCFjYXBzLmJyb3dzZXJOYW1lIHx8ICFoZWxwZXJzLmlzQ2hyb21lQnJvd3NlcihjYXBzLmJyb3dzZXJOYW1lKSkgJiZcbiAgICAgICFjYXBzLmFwcCAmJiAhY2Fwcy5hcHBQYWNrYWdlKSB7XG4gICAgICBsZXQgbXNnID0gJ1RoZSBkZXNpcmVkIGNhcGFiaWxpdGllcyBtdXN0IGluY2x1ZGUgZWl0aGVyIGFuIGFwcCwgcGFja2FnZSBvciBicm93c2VyJztcbiAgICAgIGxvZy5lcnJvckFuZFRocm93KG1zZyk7XG4gICAgfVxuICAgIC8vIHdhcm4gaWYgdGhlIGNhcGFiaWxpdGllcyBoYXZlIGJvdGggYGFwcGAgYW5kIGBicm93c2VyLCBhbHRob3VnaCB0aGlzXG4gICAgLy8gaXMgY29tbW9uIHdpdGggc2VsZW5pdW0gZ3JpZFxuICAgIGlmIChjYXBzLmJyb3dzZXJOYW1lICYmIGNhcHMuYXBwKSB7XG4gICAgICBsZXQgbXNnID0gJ1RoZSBkZXNpcmVkIGNhcGFiaWxpdGllcyBzaG91bGQgZ2VuZXJhbGx5IG5vdCBpbmNsdWRlIGJvdGggYW4gYXBwIGFuZCBhIGJyb3dzZXInO1xuICAgICAgbG9nLndhcm4obXNnKTtcbiAgICB9XG4gIH1cblxuICBwcm94eUFjdGl2ZSAoc2Vzc2lvbklkKSB7XG4gICAgc3VwZXIucHJveHlBY3RpdmUoc2Vzc2lvbklkKTtcblxuICAgIHJldHVybiB0aGlzLmp3cFByb3h5QWN0aXZlO1xuICB9XG5cbiAgZ2V0UHJveHlBdm9pZExpc3QgKHNlc3Npb25JZCkge1xuICAgIHN1cGVyLmdldFByb3h5QXZvaWRMaXN0KHNlc3Npb25JZCk7XG5cbiAgICByZXR1cm4gdGhpcy5qd3BQcm94eUF2b2lkO1xuICB9XG5cbiAgY2FuUHJveHkgKHNlc3Npb25JZCkge1xuICAgIHN1cGVyLmNhblByb3h5KHNlc3Npb25JZCk7XG5cbiAgICAvLyB0aGlzIHdpbGwgY2hhbmdlIGRlcGVuZGluZyBvbiBDaHJvbWVEcml2ZXIgc3RhdHVzXG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih0aGlzLnByb3h5UmVxUmVzKTtcbiAgfVxufVxuXG5mb3IgKGxldCBbY21kLCBmbl0gb2YgXy5wYWlycyhjb21tYW5kcykpIHtcbiAgQW5kcm9pZERyaXZlci5wcm90b3R5cGVbY21kXSA9IGZuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBBbmRyb2lkRHJpdmVyO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLiJ9
