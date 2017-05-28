'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appiumAdb = require('appium-adb');

var _appiumAdb2 = _interopRequireDefault(_appiumAdb);

var _asyncbox = require('asyncbox');

var adb = new _appiumAdb2['default']();

var commands = {},
    helpers = {},
    extensions = {};

var NETWORK_KEYS = [['bucketStart', 'activeTime', 'rxBytes', 'rxPackets', 'txBytes', 'txPackets', 'operations', 'bucketDuration'], ['st', 'activeTime', 'rb', 'rp', 'tb', 'tp', 'op', 'bucketDuration']];
var CPU_KEYS = ['user', 'kernel'];
var BATTERY_KEYS = ['power'];
var MEMORY_KEYS = ['totalPrivateDirty', 'nativePrivateDirty', 'dalvikPrivateDirty', 'eglPrivateDirty', 'glPrivateDirty', 'totalPss', 'nativePss', 'dalvikPss', 'eglPss', 'glPss', 'nativeHeapAllocatedSize', 'nativeHeapSize'];

var SUPPORTED_PERFORMANCE_DATA_TYPES = {
  cpuinfo: 'the amount of cpu by user and kernel process - cpu information for applications on real devices and simulators',
  memoryinfo: 'the amount of memory used by the process - memory information for applications on real devices and simulators',
  batteryinfo: 'the remaining battery power - battery power information for applications on real devices and simulators',
  networkinfo: 'the network statistics - network rx/tx information for applications on real devices and simulators'
};

//
// returns the information type of the system state which is supported to read as like cpu, memory, network traffic, and battery.
// output - array like below
//[cpuinfo, batteryinfo, networkinfo, memoryinfo]
//
commands.getPerformanceDataTypes = function () {
  return _lodash2['default'].keys(SUPPORTED_PERFORMANCE_DATA_TYPES);
};

// returns the information type of the system state which is supported to read as like cpu, memory, network traffic, and battery.
//input - (packageName) the package name of the application
//        (dataType) the type of system state which wants to read. It should be one of the keys of the SUPPORTED_PERFORMANCE_DATA_TYPES
//        (dataReadTimeout) the number of attempts to read
// output - table of the performance data, The first line of the table represents the type of data. The remaining lines represent the values of the data.
//
// in case of battery info : [[power], [23]]
// in case of memory info :  [[totalPrivateDirty, nativePrivateDirty, dalvikPrivateDirty, eglPrivateDirty, glPrivateDirty, totalPss, nativePss, dalvikPss, eglPss, glPss, nativeHeapAllocatedSize, nativeHeapSize], [18360, 8296, 6132, null, null, 42588, 8406, 7024, null, null, 26519, 10344]]
// in case of network info : [[bucketStart, activeTime, rxBytes, rxPackets, txBytes, txPackets, operations, bucketDuration,], [1478091600000, null, 1099075, 610947, 928, 114362, 769, 0, 3600000], [1478095200000, null, 1306300, 405997, 509, 46359, 370, 0, 3600000]]
// in case of network info : [[st, activeTime, rb, rp, tb, tp, op, bucketDuration], [1478088000, null, null, 32115296, 34291, 2956805, 25705, 0, 3600], [1478091600, null, null, 2714683, 11821, 1420564, 12650, 0, 3600], [1478095200, null, null, 10079213, 19962, 2487705, 20015, 0, 3600], [1478098800, null, null, 4444433, 10227, 1430356, 10493, 0, 3600]]
// in case of cpu info : [[user, kernel], [0.9, 1.3]]
//
commands.getPerformanceData = function callee$0$0(packageName, dataType, dataReadTimeout) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!_lodash2['default'].isEqual(dataType, 'batteryinfo')) {
          context$1$0.next = 4;
          break;
        }

        return context$1$0.abrupt('return', this.getBatteryInfo(dataReadTimeout));

      case 4:
        if (!_lodash2['default'].isEqual(dataType, 'cpuinfo')) {
          context$1$0.next = 8;
          break;
        }

        return context$1$0.abrupt('return', this.getCPUInfo(packageName, dataReadTimeout));

      case 8:
        if (!_lodash2['default'].isEqual(dataType, 'memoryinfo')) {
          context$1$0.next = 12;
          break;
        }

        return context$1$0.abrupt('return', this.getMemoryInfo(packageName, dataReadTimeout));

      case 12:
        if (!_lodash2['default'].isEqual(dataType, 'networkinfo')) {
          context$1$0.next = 16;
          break;
        }

        return context$1$0.abrupt('return', this.getNetworkTrafficInfo(dataReadTimeout));

      case 16:
        throw new Error('No performance data of type \'' + dataType + '\' found.');

      case 17:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getCPUInfo = function callee$0$0(packageName, dataReadTimeout) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(dataReadTimeout, 1000, function callee$1$0() {
          var cmd, data, start, end, user, kernel, returnValue, k;
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                cmd = undefined, data = undefined, start = undefined, end = undefined, user = undefined, kernel = undefined;

                cmd = ['dumpsys', 'cpuinfo', '|', 'grep', '\'' + packageName + '\''];

                context$2$0.next = 4;
                return _regeneratorRuntime.awrap(adb.shell(cmd));

              case 4:
                data = context$2$0.sent;

                if (!(!_lodash2['default'].isEqual(data, "") && !_lodash2['default'].isUndefined(data) && !_lodash2['default'].isNull(data))) {
                  context$2$0.next = 19;
                  break;
                }

                start = data.indexOf(":");
                end = data.indexOf("%", start + 1);
                if (data.indexOf(":", start + 1) > 0 && data.indexOf("faults", start + 1) < 0) start = data.indexOf(":", start + 1);
                user = data.substring(start + 1, end).trim();
                start = data.indexOf("+");
                end = data.indexOf("%", start + 1);
                kernel = data.substring(start + 1, end).trim();

                if (!(!_lodash2['default'].isEqual(user, "") && !_lodash2['default'].isUndefined(user) && !_lodash2['default'].isEqual(user, "nodex"))) {
                  context$2$0.next = 19;
                  break;
                }

                returnValue = [];

                returnValue[0] = [];
                for (k = 0; k < CPU_KEYS.length; ++k) {
                  returnValue[0][k] = CPU_KEYS[k];
                }returnValue[1] = [user, kernel];
                return context$2$0.abrupt('return', returnValue);

              case 19:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        }));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getBatteryInfo = function callee$0$0(dataReadTimeout) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this2 = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(dataReadTimeout, 10000, function callee$1$0() {
          var start, end, power, cmd, data, returnValue, k;
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                start = undefined, end = undefined, power = undefined;
                cmd = ['dumpsys', 'battery', '|', 'grep', "\'level\'"];
                context$2$0.next = 4;
                return _regeneratorRuntime.awrap(adb.shell(cmd));

              case 4:
                data = context$2$0.sent;

                if (!(!_lodash2['default'].isEqual(data, "") && !_lodash2['default'].isUndefined(data) && !_lodash2['default'].isNull(data))) {
                  context$2$0.next = 15;
                  break;
                }

                start = data.indexOf(":");
                end = _lodash2['default'].size(data);
                power = data.substring(start + 1, end).trim();

                if (!(!_lodash2['default'].isEqual(power, "") && !_lodash2['default'].isUndefined(power) && !_lodash2['default'].isEqual(power, "nodex"))) {
                  context$2$0.next = 15;
                  break;
                }

                returnValue = [];

                returnValue[0] = [];
                for (k = 0; k < BATTERY_KEYS.length; ++k) {
                  returnValue[0][k] = BATTERY_KEYS[k];
                }returnValue[1] = [power];
                return context$2$0.abrupt('return', returnValue);

              case 15:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this2);
        }));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getMemoryInfo = function callee$0$0(packageName, dataReadTimeout) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this3 = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(dataReadTimeout, 1000, function callee$1$0() {
          var cmd, data, totalPrivateDirty, nativePrivateDirty, dalvikPrivateDirty, eglPrivateDirty, glPrivateDirty, totalPss, nativePss, dalvikPss, eglPss, glPss, nativeHeapSize, nativeHeapAllocatedSize, arrayList, arrayList2, i, testString, returnValue, k;
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                cmd = undefined, data = undefined, totalPrivateDirty = undefined, nativePrivateDirty = undefined, dalvikPrivateDirty = undefined, eglPrivateDirty = undefined, glPrivateDirty = undefined, totalPss = undefined, nativePss = undefined, dalvikPss = undefined, eglPss = undefined, glPss = undefined, nativeHeapSize = undefined, nativeHeapAllocatedSize = undefined;

                cmd = ['dumpsys', 'meminfo', '\'' + packageName + '\'', '|', 'grep', '-E', "\'Native|Dalvik|EGL|GL|TOTAL\'"];
                context$2$0.next = 4;
                return _regeneratorRuntime.awrap(adb.shell(cmd));

              case 4:
                data = context$2$0.sent;

                if (!(!_lodash2['default'].isEqual(data, "") && !_lodash2['default'].isUndefined(data) && !_lodash2['default'].isNull(data))) {
                  context$2$0.next = 15;
                  break;
                }

                arrayList = data.split("\n");
                arrayList2 = undefined;

                for (i = 0; i < arrayList.length; i++) {
                  testString = arrayList[i].replace(/\s/g, ",");
                  // remove spaces at the end of the string
                  testString = testString.replace(/,{1,}/g, ","); // remove spaces at the end of the string
                  arrayList2 = testString.split(",");

                  if ((_lodash2['default'].isEqual(arrayList2[0], "Native") || _lodash2['default'].isEqual(arrayList2[0], "Native")) && (_lodash2['default'].isEqual(arrayList2[1], "Heap") || _lodash2['default'].isEqual(arrayList2[2], "Heap"))) {
                    //native heap
                    nativePrivateDirty = arrayList2[3];
                    nativePss = arrayList2[2];
                    nativeHeapAllocatedSize = arrayList2[6];
                    nativeHeapSize = arrayList2[8];
                  } else if ((_lodash2['default'].isEqual(arrayList2[0], "Dalvik") || _lodash2['default'].isEqual(arrayList2[1], "Dalvik")) && (_lodash2['default'].isEqual(arrayList2[1], "Heap") || _lodash2['default'].isEqual(arrayList2[2], "Heap"))) {
                    //dalvik heap
                    dalvikPrivateDirty = arrayList2[4];
                    dalvikPss = arrayList2[3];
                  } else if ((_lodash2['default'].isEqual(arrayList2[0], "Dalvik") || _lodash2['default'].isEqual(arrayList2[1], "Dalvik")) && (_lodash2['default'].isEqual(arrayList2[1], "Other") || _lodash2['default'].isEqual(arrayList2[2], "Other"))) {//dalvik others
                  } else if ((_lodash2['default'].isEqual(arrayList2[0], "EGL") || _lodash2['default'].isEqual(arrayList2[1], "EGL")) && (_lodash2['default'].isEqual(arrayList2[1], "mtrack") || _lodash2['default'].isEqual(arrayList2[2], "mtrack"))) {
                      //egl
                      eglPrivateDirty = arrayList2[4];
                      eglPss = arrayList2[3];
                    } else if ((_lodash2['default'].isEqual(arrayList2[0], "GL") || _lodash2['default'].isEqual(arrayList2[1], "GL")) && (_lodash2['default'].isEqual(arrayList2[1], "mtrack") || _lodash2['default'].isEqual(arrayList2[2], "mtrack"))) {
                      //gl
                      glPrivateDirty = arrayList2[4];
                      glPss = arrayList2[3];
                    } else if (_lodash2['default'].isEqual(arrayList2[0], "TOTAL") || _lodash2['default'].isEqual(arrayList2[1], "TOTAL")) {
                      //total
                      totalPrivateDirty = arrayList2[3];
                      totalPss = arrayList2[2];
                    }
                }

                if (!(!_lodash2['default'].isEqual(totalPrivateDirty, "") && !_lodash2['default'].isUndefined(totalPrivateDirty) && !_lodash2['default'].isEqual(totalPrivateDirty, "nodex"))) {
                  context$2$0.next = 15;
                  break;
                }

                returnValue = [];

                returnValue[0] = [];
                for (k = 0; k < MEMORY_KEYS.length; ++k) {
                  returnValue[0][k] = MEMORY_KEYS[k];
                }returnValue[1] = [totalPrivateDirty, nativePrivateDirty, dalvikPrivateDirty, eglPrivateDirty, glPrivateDirty, totalPss, nativePss, dalvikPss, eglPss, glPss, nativeHeapAllocatedSize, nativeHeapSize];
                return context$2$0.abrupt('return', returnValue);

              case 15:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this3);
        }));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getNetworkTrafficInfo = function callee$0$0(dataReadTimeout) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this4 = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(dataReadTimeout, 1000, function callee$1$0() {
          var returnValue, cmd, data, start, delimiter, end, pendingBytes, bucketDuration, bucketStart, activeTime, rxBytes, rxPackets, txBytes, txPackets, operations, index, fromXtstats, arrayList, j, k, returnIndex, i;
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                returnValue = [];
                cmd = undefined, data = undefined, start = undefined, delimiter = undefined, end = undefined, pendingBytes = undefined, bucketDuration = undefined, bucketStart = undefined, activeTime = undefined, rxBytes = undefined, rxPackets = undefined, txBytes = undefined, txPackets = undefined, operations = undefined;

                cmd = ['dumpsys', 'netstats'];

                context$2$0.next = 5;
                return _regeneratorRuntime.awrap(adb.shell(cmd));

              case 5:
                data = context$2$0.sent;

                if (!(!_lodash2['default'].isEqual(data, "") && !_lodash2['default'].isUndefined(data) && !_lodash2['default'].isNull(data))) {
                  context$2$0.next = 34;
                  break;
                }

                index = 0;
                fromXtstats = data.indexOf("Xt stats:");

                start = data.indexOf("Pending bytes:", fromXtstats);
                delimiter = data.indexOf(":", start + 1);
                end = data.indexOf("\n", delimiter + 1);
                pendingBytes = data.substring(delimiter + 1, end).trim();

                if (end > delimiter) {
                  start = data.indexOf("bucketDuration", end + 1);
                  delimiter = data.indexOf("=", start + 1);
                  end = data.indexOf("\n", delimiter + 1);
                  bucketDuration = data.substring(delimiter + 1, end).trim();
                }

                if (!(start >= 0)) {
                  context$2$0.next = 32;
                  break;
                }

                data = data.substring(end + 1, data.length);
                arrayList = data.split("\n");

                if (!(arrayList.length > 0)) {
                  context$2$0.next = 32;
                  break;
                }

                start = -1;

                j = 0;

              case 20:
                if (!(j < NETWORK_KEYS.length)) {
                  context$2$0.next = 30;
                  break;
                }

                start = arrayList[0].indexOf(NETWORK_KEYS[j][0]);

                if (!(start >= 0)) {
                  context$2$0.next = 27;
                  break;
                }

                index = j;
                returnValue[0] = [];

                for (k = 0; k < NETWORK_KEYS[j].length; ++k) {
                  returnValue[0][k] = NETWORK_KEYS[j][k];
                }return context$2$0.abrupt('break', 30);

              case 27:
                ++j;
                context$2$0.next = 20;
                break;

              case 30:
                returnIndex = 1;

                for (i = 0; i < arrayList.length; i++) {

                  data = arrayList[i];
                  start = data.indexOf(NETWORK_KEYS[index][0]);

                  if (start >= 0) {

                    delimiter = data.indexOf("=", start + 1);
                    end = data.indexOf(" ", delimiter + 1);
                    bucketStart = data.substring(delimiter + 1, end).trim();

                    if (end > delimiter) {
                      start = data.indexOf(NETWORK_KEYS[index][1], end + 1);
                      if (start >= 0) {
                        delimiter = data.indexOf("=", start + 1);
                        end = data.indexOf(" ", delimiter + 1);
                        activeTime = data.substring(delimiter + 1, end).trim();
                      }
                    }

                    if (end > delimiter) {
                      start = data.indexOf(NETWORK_KEYS[index][2], end + 1);
                      if (start >= 0) {
                        delimiter = data.indexOf("=", start + 1);
                        end = data.indexOf(" ", delimiter + 1);
                        rxBytes = data.substring(delimiter + 1, end).trim();
                      }
                    }

                    if (end > delimiter) {
                      start = data.indexOf(NETWORK_KEYS[index][3], end + 1);
                      if (start >= 0) {
                        delimiter = data.indexOf("=", start + 1);
                        end = data.indexOf(" ", delimiter + 1);
                        rxPackets = data.substring(delimiter + 1, end).trim();
                      }
                    }

                    if (end > delimiter) {
                      start = data.indexOf(NETWORK_KEYS[index][4], end + 1);
                      if (start >= 0) {
                        delimiter = data.indexOf("=", start + 1);
                        end = data.indexOf(" ", delimiter + 1);
                        txBytes = data.substring(delimiter + 1, end).trim();
                      }
                    }

                    if (end > delimiter) {
                      start = data.indexOf(NETWORK_KEYS[index][5], end + 1);
                      if (start >= 0) {
                        delimiter = data.indexOf("=", start + 1);
                        end = data.indexOf(" ", delimiter + 1);
                        txPackets = data.substring(delimiter + 1, end).trim();
                      }
                    }

                    if (end > delimiter) {
                      start = data.indexOf(NETWORK_KEYS[index][6], end + 1);
                      if (start >= 0) {
                        delimiter = data.indexOf("=", start + 1);
                        end = data.length;
                        operations = data.substring(delimiter + 1, end).trim();
                      }
                    }
                    returnValue[returnIndex++] = [bucketStart, activeTime, rxBytes, rxPackets, txBytes, txPackets, operations, bucketDuration];
                  }
                }

              case 32:
                if (!(!_lodash2['default'].isEqual(pendingBytes, "") && !_lodash2['default'].isUndefined(pendingBytes) && !_lodash2['default'].isEqual(pendingBytes, "nodex"))) {
                  context$2$0.next = 34;
                  break;
                }

                return context$2$0.abrupt('return', returnValue);

              case 34:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this4);
        }));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

_Object$assign(extensions, commands, helpers);
exports.commands = commands;
exports.helpers = helpers;
exports['default'] = extensions;

//sometimes, the function of 'adb.shell' fails. when I tested this function on the target of 'Galaxy Note5',
//adb.shell(dumpsys cpuinfo) returns cpu datas for other application packages, but I can't find the data for packageName.
//It usually fails 30 times and success for the next time, 
//Since then, he has continued to succeed.

//In case of network traffic information, it is different for the return data between emulator and real device.
//the return data of emulator
//Xt stats:
//Pending bytes: 39250
//History since boot:
//ident=[[type=WIFI, subType=COMBINED, networkId="WiredSSID"]] uid=-1 set=ALL tag=0x0
//NetworkStatsHistory: bucketDuration=3600000
//bucketStart=1478098800000 activeTime=31824 rxBytes=21502 rxPackets=78 txBytes=17748 txPackets=90 operations=0
//the return data of real device
//
//the return data of real device
//Xt stats:
//Pending bytes: 0
//History since boot:
//ident=[{type=MOBILE, subType=COMBINED, subscriberId=450050...}] uid=-1 set=ALL tag=0x0
//NetworkStatsHistory: bucketDuration=3600
//st=1478088000 rb=32115296 rp=34291 tb=2956805 tp=25705 op=0
//st=1478091600 rb=2714683 rp=11821 tb=1420564 tp=12650 op=0
//st=1478095200 rb=10079213 rp=19962 tb=2487705 tp=20015 op=0
//st=1478098800 rb=4444433 rp=10227 tb=1430356 tp=10493 op=0
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb21tYW5kcy9wZXJmb3JtYW5jZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7Ozt5QkFDTixZQUFZOzs7O3dCQUNFLFVBQVU7O0FBRXhDLElBQUksR0FBRyxHQUFHLDRCQUFTLENBQUM7O0FBRXBCLElBQUksUUFBUSxHQUFHLEVBQUU7SUFBRSxPQUFPLEdBQUcsRUFBRTtJQUFFLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRWpELElBQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7QUFDM00sSUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDcEMsSUFBTSxZQUFZLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixJQUFNLFdBQVcsR0FBRyxDQUFDLG1CQUFtQixFQUFFLG9CQUFvQixFQUFFLG9CQUFvQixFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFak8sSUFBTSxnQ0FBZ0MsR0FBRztBQUN2QyxTQUFPLEVBQUUsZ0hBQWdIO0FBQ3pILFlBQVUsRUFBRSwrR0FBK0c7QUFDM0gsYUFBVyxFQUFFLHlHQUF5RztBQUN0SCxhQUFXLEVBQUUsb0dBQW9HO0NBQ2xILENBQUM7Ozs7Ozs7QUFPRixRQUFRLENBQUMsdUJBQXVCLEdBQUcsWUFBWTtBQUM3QyxTQUFPLG9CQUFFLElBQUksQ0FBQyxn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QUM7QUFDbEIsa0NBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7dUJBRXREO3FCQUNGO0FBQ0QsK0JBQVcsQ0FBQyxXQUFXLEVBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDO21CQUM3SDtpQkFDRjs7O3NCQUtBLENBQUMsb0JBQUUsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFFLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLG9CQUFFLE9BQU8sQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUE7Ozs7O29EQUM3RixXQUFXOzs7Ozs7O1NBR3ZCLENBQUM7Ozs7Ozs7Ozs7Q0FFSCxDQUFDOztBQUVGLGVBQWMsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwQyxRQUFRLEdBQVIsUUFBUTtRQUFFLE9BQU8sR0FBUCxPQUFPO3FCQUNYLFVBQVUiLCJmaWxlIjoibGliL2NvbW1hbmRzL3BlcmZvcm1hbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBBREIgZnJvbSAnYXBwaXVtLWFkYic7XG5pbXBvcnQgeyByZXRyeUludGVydmFsIH0gZnJvbSAnYXN5bmNib3gnO1xuXG5sZXQgYWRiID0gbmV3IEFEQigpO1xuXG5sZXQgY29tbWFuZHMgPSB7fSwgaGVscGVycyA9IHt9LCBleHRlbnNpb25zID0ge307XG5cbmNvbnN0IE5FVFdPUktfS0VZUyA9IFtbJ2J1Y2tldFN0YXJ0JywgJ2FjdGl2ZVRpbWUnLCAncnhCeXRlcycsICdyeFBhY2tldHMnLCAndHhCeXRlcycsICd0eFBhY2tldHMnLCAnb3BlcmF0aW9ucycsICdidWNrZXREdXJhdGlvbiddLCBbJ3N0JywgJ2FjdGl2ZVRpbWUnLCAncmInLCAncnAnLCAndGInLCAndHAnLCAnb3AnLCAnYnVja2V0RHVyYXRpb24nXV07XG5jb25zdCBDUFVfS0VZUyA9IFsndXNlcicsICdrZXJuZWwnXTtcbmNvbnN0IEJBVFRFUllfS0VZUyA9IFsncG93ZXInXTtcbmNvbnN0IE1FTU9SWV9LRVlTID0gWyd0b3RhbFByaXZhdGVEaXJ0eScsICduYXRpdmVQcml2YXRlRGlydHknLCAnZGFsdmlrUHJpdmF0ZURpcnR5JywgJ2VnbFByaXZhdGVEaXJ0eScsICdnbFByaXZhdGVEaXJ0eScsICd0b3RhbFBzcycsICduYXRpdmVQc3MnLCAnZGFsdmlrUHNzJywgJ2VnbFBzcycsICdnbFBzcycsICduYXRpdmVIZWFwQWxsb2NhdGVkU2l6ZScsICduYXRpdmVIZWFwU2l6ZSddO1xuICBcbmNvbnN0IFNVUFBPUlRFRF9QRVJGT1JNQU5DRV9EQVRBX1RZUEVTID0ge1xuICBjcHVpbmZvOiAndGhlIGFtb3VudCBvZiBjcHUgYnkgdXNlciBhbmQga2VybmVsIHByb2Nlc3MgLSBjcHUgaW5mb3JtYXRpb24gZm9yIGFwcGxpY2F0aW9ucyBvbiByZWFsIGRldmljZXMgYW5kIHNpbXVsYXRvcnMnLFxuICBtZW1vcnlpbmZvOiAndGhlIGFtb3VudCBvZiBtZW1vcnkgdXNlZCBieSB0aGUgcHJvY2VzcyAtIG1lbW9yeSBpbmZvcm1hdGlvbiBmb3IgYXBwbGljYXRpb25zIG9uIHJlYWwgZGV2aWNlcyBhbmQgc2ltdWxhdG9ycycsXG4gIGJhdHRlcnlpbmZvOiAndGhlIHJlbWFpbmluZyBiYXR0ZXJ5IHBvd2VyIC0gYmF0dGVyeSBwb3dlciBpbmZvcm1hdGlvbiBmb3IgYXBwbGljYXRpb25zIG9uIHJlYWwgZGV2aWNlcyBhbmQgc2ltdWxhdG9ycycsXG4gIG5ldHdvcmtpbmZvOiAndGhlIG5ldHdvcmsgc3RhdGlzdGljcyAtIG5ldHdvcmsgcngvdHggaW5mb3JtYXRpb24gZm9yIGFwcGxpY2F0aW9ucyBvbiByZWFsIGRldmljZXMgYW5kIHNpbXVsYXRvcnMnXG59O1xuXG4vL1xuLy8gcmV0dXJucyB0aGUgaW5mb3JtYXRpb24gdHlwZSBvZiB0aGUgc3lzdGVtIHN0YXRlIHdoaWNoIGlzIHN1cHBvcnRlZCB0byByZWFkIGFzIGxpa2UgY3B1LCBtZW1vcnksIG5ldHdvcmsgdHJhZmZpYywgYW5kIGJhdHRlcnkuXG4vLyBvdXRwdXQgLSBhcnJheSBsaWtlIGJlbG93XG4vL1tjcHVpbmZvLCBiYXR0ZXJ5aW5mbywgbmV0d29ya2luZm8sIG1lbW9yeWluZm9dIFxuLy9cbmNvbW1hbmRzLmdldFBlcmZvcm1hbmNlRGF0YVR5cGVzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gXy5rZXlzKFNVUFBPUlRFRF9QRVJGT1JNQU5DRV9EQVRBX1RZUEVTKTtcbn07XG5cbi8vIHJldHVybnMgdGhlIGluZm9ybWF0aW9uIHR5cGUgb2YgdGhlIHN5c3RlbSBzdGF0ZSB3aGljaCBpcyBzdXBwb3J0ZWQgdG8gcmVhZCBhcyBsaWtlIGNwdSwgbWVtb3J5LCBuZXR3b3JrIHRyYWZmaWMsIGFuZCBiYXR0ZXJ5LlxuLy9pbnB1dCAtIChwYWNrYWdlTmFtZSkgdGhlIHBhY2thZ2UgbmFtZSBvZiB0aGUgYXBwbGljYXRpb24gXG4vLyAgICAgICAgKGRhdGFUeXBlKSB0aGUgdHlwZSBvZiBzeXN0ZW0gc3RhdGUgd2hpY2ggd2FudHMgdG8gcmVhZC4gSXQgc2hvdWxkIGJlIG9uZSBvZiB0aGUga2V5cyBvZiB0aGUgU1VQUE9SVEVEX1BFUkZPUk1BTkNFX0RBVEFfVFlQRVNcbi8vICAgICAgICAoZGF0YVJlYWRUaW1lb3V0KSB0aGUgbnVtYmVyIG9mIGF0dGVtcHRzIHRvIHJlYWRcbi8vIG91dHB1dCAtIHRhYmxlIG9mIHRoZSBwZXJmb3JtYW5jZSBkYXRhLCBUaGUgZmlyc3QgbGluZSBvZiB0aGUgdGFibGUgcmVwcmVzZW50cyB0aGUgdHlwZSBvZiBkYXRhLiBUaGUgcmVtYWluaW5nIGxpbmVzIHJlcHJlc2VudCB0aGUgdmFsdWVzIG9mIHRoZSBkYXRhLlxuLy9cbi8vIGluIGNhc2Ugb2YgYmF0dGVyeSBpbmZvIDogW1twb3dlcl0sIFsyM11dXG4vLyBpbiBjYXNlIG9mIG1lbW9yeSBpbmZvIDogIFtbdG90YWxQcml2YXRlRGlydHksIG5hdGl2ZVByaXZhdGVEaXJ0eSwgZGFsdmlrUHJpdmF0ZURpcnR5LCBlZ2xQcml2YXRlRGlydHksIGdsUHJpdmF0ZURpcnR5LCB0b3RhbFBzcywgbmF0aXZlUHNzLCBkYWx2aWtQc3MsIGVnbFBzcywgZ2xQc3MsIG5hdGl2ZUhlYXBBbGxvY2F0ZWRTaXplLCBuYXRpdmVIZWFwU2l6ZV0sIFsxODM2MCwgODI5NiwgNjEzMiwgbnVsbCwgbnVsbCwgNDI1ODgsIDg0MDYsIDcwMjQsIG51bGwsIG51bGwsIDI2NTE5LCAxMDM0NF1dXG4vLyBpbiBjYXNlIG9mIG5ldHdvcmsgaW5mbyA6IFtbYnVja2V0U3RhcnQsIGFjdGl2ZVRpbWUsIHJ4Qnl0ZXMsIHJ4UGFja2V0cywgdHhCeXRlcywgdHhQYWNrZXRzLCBvcGVyYXRpb25zLCBidWNrZXREdXJhdGlvbixdLCBbMTQ3ODA5MTYwMDAwMCwgbnVsbCwgMTA5OTA3NSwgNjEwOTQ3LCA5MjgsIDExNDM2MiwgNzY5LCAwLCAzNjAwMDAwXSwgWzE0NzgwOTUyMDAwMDAsIG51bGwsIDEzMDYzMDAsIDQwNTk5NywgNTA5LCA0NjM1OSwgMzcwLCAwLCAzNjAwMDAwXV1cbi8vIGluIGNhc2Ugb2YgbmV0d29yayBpbmZvIDogW1tzdCwgYWN0aXZlVGltZSwgcmIsIHJwLCB0YiwgdHAsIG9wLCBidWNrZXREdXJhdGlvbl0sIFsxNDc4MDg4MDAwLCBudWxsLCBudWxsLCAzMjExNTI5NiwgMzQyOTEsIDI5NTY4MDUsIDI1NzA1LCAwLCAzNjAwXSwgWzE0NzgwOTE2MDAsIG51bGwsIG51bGwsIDI3MTQ2ODMsIDExODIxLCAxNDIwNTY0LCAxMjY1MCwgMCwgMzYwMF0sIFsxNDc4MDk1MjAwLCBudWxsLCBudWxsLCAxMDA3OTIxMywgMTk5NjIsIDI0ODc3MDUsIDIwMDE1LCAwLCAzNjAwXSwgWzE0NzgwOTg4MDAsIG51bGwsIG51bGwsIDQ0NDQ0MzMsIDEwMjI3LCAxNDMwMzU2LCAxMDQ5MywgMCwgMzYwMF1dXG4vLyBpbiBjYXNlIG9mIGNwdSBpbmZvIDogW1t1c2VyLCBrZXJuZWxdLCBbMC45LCAxLjNdXVxuLy9cbmNvbW1hbmRzLmdldFBlcmZvcm1hbmNlRGF0YSA9IGFzeW5jIGZ1bmN0aW9uIChwYWNrYWdlTmFtZSwgZGF0YVR5cGUsIGRhdGFSZWFkVGltZW91dCkge1xuXG4gIGlmIChfLmlzRXF1YWwoZGF0YVR5cGUsICdiYXR0ZXJ5aW5mbycpKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QmF0dGVyeUluZm8oZGF0YVJlYWRUaW1lb3V0KTtcbiAgfSBlbHNlIGlmIChfLmlzRXF1YWwoZGF0YVR5cGUsICdjcHVpbmZvJykpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDUFVJbmZvKHBhY2thZ2VOYW1lLCBkYXRhUmVhZFRpbWVvdXQpO1xuICB9IGVsc2UgaWYgKF8uaXNFcXVhbChkYXRhVHlwZSwgJ21lbW9yeWluZm8nKSkge1xuICAgIHJldHVybiB0aGlzLmdldE1lbW9yeUluZm8ocGFja2FnZU5hbWUsIGRhdGFSZWFkVGltZW91dCk7XG4gIH0gZWxzZSBpZiAoXy5pc0VxdWFsKGRhdGFUeXBlLCAnbmV0d29ya2luZm8nKSkge1xuICAgIHJldHVybiB0aGlzLmdldE5ldHdvcmtUcmFmZmljSW5mbyhkYXRhUmVhZFRpbWVvdXQpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gcGVyZm9ybWFuY2UgZGF0YSBvZiB0eXBlIFxcJycgKyBkYXRhVHlwZSArICdcXCcgZm91bmQuJyk7XG4gIH1cbn07XG5cbmhlbHBlcnMuZ2V0Q1BVSW5mbyA9IGFzeW5jIGZ1bmN0aW9uIChwYWNrYWdlTmFtZSwgZGF0YVJlYWRUaW1lb3V0KSB7XG4gICAgXG4gIC8vc29tZXRpbWVzLCB0aGUgZnVuY3Rpb24gb2YgJ2FkYi5zaGVsbCcgZmFpbHMuIHdoZW4gSSB0ZXN0ZWQgdGhpcyBmdW5jdGlvbiBvbiB0aGUgdGFyZ2V0IG9mICdHYWxheHkgTm90ZTUnLCBcbiAgLy9hZGIuc2hlbGwoZHVtcHN5cyBjcHVpbmZvKSByZXR1cm5zIGNwdSBkYXRhcyBmb3Igb3RoZXIgYXBwbGljYXRpb24gcGFja2FnZXMsIGJ1dCBJIGNhbid0IGZpbmQgdGhlIGRhdGEgZm9yIHBhY2thZ2VOYW1lLlxuICAvL0l0IHVzdWFsbHkgZmFpbHMgMzAgdGltZXMgYW5kIHN1Y2Nlc3MgZm9yIHRoZSBuZXh0IHRpbWUsICBcbiAgLy9TaW5jZSB0aGVuLCBoZSBoYXMgY29udGludWVkIHRvIHN1Y2NlZWQuXG4gIHJldHVybiBhd2FpdCByZXRyeUludGVydmFsKGRhdGFSZWFkVGltZW91dCwgMTAwMCwgYXN5bmMgKCkgPT4ge1xuICAgIGxldCBjbWQsIGRhdGEsIHN0YXJ0LCBlbmQsIHVzZXIsIGtlcm5lbDtcblxuICAgIGNtZCA9IFsnZHVtcHN5cycsICdjcHVpbmZvJywgJ3wnLCAnZ3JlcCcsIGAnJHtwYWNrYWdlTmFtZX0nYF07XG5cbiAgICBkYXRhID0gYXdhaXQgYWRiLnNoZWxsKGNtZCk7IFxuXG4gICAgaWYgKCFfLmlzRXF1YWwoZGF0YSwgXCJcIikgJiYgIV8uaXNVbmRlZmluZWQoZGF0YSkgJiYgIV8uaXNOdWxsKGRhdGEpICl7XG4gICAgICBzdGFydCA9IGRhdGEuaW5kZXhPZihcIjpcIik7XG4gICAgICBlbmQgICA9IGRhdGEuaW5kZXhPZihcIiVcIiwgc3RhcnQrMSk7XG4gICAgICBpZiAoZGF0YS5pbmRleE9mKFwiOlwiLCBzdGFydCsxKSA+IDAgJiYgZGF0YS5pbmRleE9mKFwiZmF1bHRzXCIsIHN0YXJ0KzEpIDwgMCkgIFxuICAgICAgICBzdGFydCA9IGRhdGEuaW5kZXhPZihcIjpcIiwgc3RhcnQrMSk7XG4gICAgICB1c2VyID0gZGF0YS5zdWJzdHJpbmcoc3RhcnQrMSwgZW5kKS50cmltKCk7XG4gICAgICBzdGFydCA9IGRhdGEuaW5kZXhPZihcIitcIik7XG4gICAgICBlbmQgPSBkYXRhLmluZGV4T2YoXCIlXCIsIHN0YXJ0KzEpO1xuICAgICAga2VybmVsID0gZGF0YS5zdWJzdHJpbmcoc3RhcnQrMSwgZW5kKS50cmltKCk7XG4gICAgICAgICAgICBcbiAgICAgIGlmICggIV8uaXNFcXVhbCh1c2VyLCBcIlwiKSAmJiAhXy5pc1VuZGVmaW5lZCh1c2VyKSAmJiAhXy5pc0VxdWFsKHVzZXIsIFwibm9kZXhcIiApKXtcbiAgICAgICAgbGV0IHJldHVyblZhbHVlID0gW107XG4gICAgICAgIHJldHVyblZhbHVlWzBdID0gW107XG4gICAgICAgIGZvciAobGV0IGsgPSAwIDsgayA8IENQVV9LRVlTLmxlbmd0aCA7ICsrIGspXG4gICAgICAgICAgcmV0dXJuVmFsdWVbMF1ba10gPSBDUFVfS0VZU1trXTtcbiAgICAgICAgcmV0dXJuVmFsdWVbMV0gPSBbdXNlciwga2VybmVsXTtcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICB9KTtcblxufTtcblxuaGVscGVycy5nZXRCYXR0ZXJ5SW5mbyA9IGFzeW5jIGZ1bmN0aW9uIChkYXRhUmVhZFRpbWVvdXQpIHtcblxuICByZXR1cm4gYXdhaXQgcmV0cnlJbnRlcnZhbChkYXRhUmVhZFRpbWVvdXQsIDEwMDAwLCBhc3luYyAoKSA9PiB7XG4gICAgbGV0IHN0YXJ0LCBlbmQsIHBvd2VyO1xuXG4gICAgbGV0IGNtZCA9IFsnZHVtcHN5cycsICdiYXR0ZXJ5JywgJ3wnLCAnZ3JlcCcsIFwiXFwnbGV2ZWxcXCdcIl07XG5cbiAgICBsZXQgZGF0YSA9IGF3YWl0IGFkYi5zaGVsbChjbWQpO1xuXG4gICAgaWYgKCFfLmlzRXF1YWwoZGF0YSwgXCJcIikgJiYgIV8uaXNVbmRlZmluZWQoZGF0YSkgJiYgIV8uaXNOdWxsKGRhdGEpKXtcbiAgICAgIHN0YXJ0ID0gZGF0YS5pbmRleE9mKFwiOlwiKTtcbiAgICAgIGVuZCA9IF8uc2l6ZShkYXRhKTtcbiAgICAgIHBvd2VyID0gZGF0YS5zdWJzdHJpbmcoc3RhcnQrMSwgZW5kKS50cmltKCk7XG5cbiAgICAgIGlmICggIV8uaXNFcXVhbChwb3dlciwgXCJcIikgJiYgIV8uaXNVbmRlZmluZWQocG93ZXIpICYmICFfLmlzRXF1YWwocG93ZXIsIFwibm9kZXhcIikpe1xuICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSBbXTtcbiAgICAgICAgcmV0dXJuVmFsdWVbMF0gPSBbXTsgICAgICAgIFxuICAgICAgICBmb3IgKGxldCBrID0gMCA7IGsgPCBCQVRURVJZX0tFWVMubGVuZ3RoIDsgKysgaylcbiAgICAgICAgICByZXR1cm5WYWx1ZVswXVtrXSA9IEJBVFRFUllfS0VZU1trXTtcbiAgICAgICAgcmV0dXJuVmFsdWVbMV0gPSBbcG93ZXJdO1xuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgICB9ICAgICAgICAgICAgXG4gICAgfVxuICB9KTtcblxufTtcblxuaGVscGVycy5nZXRNZW1vcnlJbmZvID0gYXN5bmMgZnVuY3Rpb24gKHBhY2thZ2VOYW1lLCBkYXRhUmVhZFRpbWVvdXQpIHtcblxuICByZXR1cm4gYXdhaXQgcmV0cnlJbnRlcnZhbChkYXRhUmVhZFRpbWVvdXQsIDEwMDAsIGFzeW5jICgpID0+IHtcbiAgICAgIFxuICAgIGxldCBjbWQsIGRhdGEsIHRvdGFsUHJpdmF0ZURpcnR5LCBuYXRpdmVQcml2YXRlRGlydHksIGRhbHZpa1ByaXZhdGVEaXJ0eSwgZWdsUHJpdmF0ZURpcnR5LCBnbFByaXZhdGVEaXJ0eSwgdG90YWxQc3MsIG5hdGl2ZVBzcywgZGFsdmlrUHNzLCBlZ2xQc3MsIGdsUHNzLCBuYXRpdmVIZWFwU2l6ZSwgbmF0aXZlSGVhcEFsbG9jYXRlZFNpemU7XG5cbiAgICBjbWQgPSBbJ2R1bXBzeXMnLCAnbWVtaW5mbycsIGAnJHtwYWNrYWdlTmFtZX0nYCwgJ3wnLCAnZ3JlcCcsICctRScsIFwiXFwnTmF0aXZlfERhbHZpa3xFR0x8R0x8VE9UQUxcXCdcIl07XG4gICAgZGF0YSA9IGF3YWl0IGFkYi5zaGVsbChjbWQpO1xuXG4gICAgaWYgKCFfLmlzRXF1YWwoZGF0YSwgXCJcIikgJiYgIV8uaXNVbmRlZmluZWQoZGF0YSkgJiYgIV8uaXNOdWxsKGRhdGEpKXtcbiAgICAgIGxldCBhcnJheUxpc3QgPSBkYXRhLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgbGV0IGFycmF5TGlzdDI7ICBcbiAgICAgIGZvciAobGV0IGk9MCA7IGkgPCBhcnJheUxpc3QubGVuZ3RoIDsgaSsrKXtcbiAgICAgICAgbGV0IHRlc3RTdHJpbmcgPSBhcnJheUxpc3RbaV0ucmVwbGFjZSgvXFxzL2csIFwiLFwiKTsgLy8gcmVtb3ZlIHNwYWNlcyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmdcbiAgICAgICAgdGVzdFN0cmluZyA9IHRlc3RTdHJpbmcucmVwbGFjZSgvLHsxLH0vZywgXCIsXCIpOyAvLyByZW1vdmUgc3BhY2VzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZ1xuICAgICAgICBhcnJheUxpc3QyID0gdGVzdFN0cmluZy5zcGxpdChcIixcIik7XG5cbiAgICAgICAgaWYgKCAoXy5pc0VxdWFsKGFycmF5TGlzdDJbMF0sIFwiTmF0aXZlXCIpIHx8IF8uaXNFcXVhbChhcnJheUxpc3QyWzBdLCBcIk5hdGl2ZVwiKSkgJiYgKF8uaXNFcXVhbChhcnJheUxpc3QyWzFdLCBcIkhlYXBcIikgfHwgXy5pc0VxdWFsKGFycmF5TGlzdDJbMl0sIFwiSGVhcFwiKSkgKXsvL25hdGl2ZSBoZWFwXG4gICAgICAgICAgbmF0aXZlUHJpdmF0ZURpcnR5ID0gYXJyYXlMaXN0MlszXSA7XG4gICAgICAgICAgbmF0aXZlUHNzID0gYXJyYXlMaXN0MlsyXTtcbiAgICAgICAgICBuYXRpdmVIZWFwQWxsb2NhdGVkU2l6ZSA9IGFycmF5TGlzdDJbNl07XG4gICAgICAgICAgbmF0aXZlSGVhcFNpemUgPSBhcnJheUxpc3QyWzhdO1xuICAgICAgICB9IGVsc2UgaWYgKCAoXy5pc0VxdWFsKGFycmF5TGlzdDJbMF0sIFwiRGFsdmlrXCIpIHx8IF8uaXNFcXVhbChhcnJheUxpc3QyWzFdLCBcIkRhbHZpa1wiKSkgJiYgKF8uaXNFcXVhbChhcnJheUxpc3QyWzFdLCBcIkhlYXBcIikgfHwgXy5pc0VxdWFsKGFycmF5TGlzdDJbMl0sIFwiSGVhcFwiKSkgKXsgLy9kYWx2aWsgaGVhcFxuICAgICAgICAgIGRhbHZpa1ByaXZhdGVEaXJ0eSA9IGFycmF5TGlzdDJbNF07XG4gICAgICAgICAgZGFsdmlrUHNzID0gYXJyYXlMaXN0MlszXTtcbiAgICAgICAgfSBlbHNlIGlmICggKF8uaXNFcXVhbChhcnJheUxpc3QyWzBdLCBcIkRhbHZpa1wiKSB8fCBfLmlzRXF1YWwoYXJyYXlMaXN0MlsxXSwgXCJEYWx2aWtcIikpICYmIChfLmlzRXF1YWwoYXJyYXlMaXN0MlsxXSwgXCJPdGhlclwiKSB8fCBfLmlzRXF1YWwoYXJyYXlMaXN0MlsyXSwgXCJPdGhlclwiKSkgKXsvL2RhbHZpayBvdGhlcnNcbiAgICAgICAgfSBlbHNlIGlmICggKF8uaXNFcXVhbChhcnJheUxpc3QyWzBdLCBcIkVHTFwiKSB8fCBfLmlzRXF1YWwoYXJyYXlMaXN0MlsxXSwgXCJFR0xcIikpICYmIChfLmlzRXF1YWwoYXJyYXlMaXN0MlsxXSwgXCJtdHJhY2tcIikgfHwgXy5pc0VxdWFsKGFycmF5TGlzdDJbMl0sIFwibXRyYWNrXCIpKSApeyAvL2VnbFxuICAgICAgICAgIGVnbFByaXZhdGVEaXJ0eSA9IGFycmF5TGlzdDJbNF07XG4gICAgICAgICAgZWdsUHNzID0gYXJyYXlMaXN0MlszXTtcbiAgICAgICAgfSBlbHNlIGlmICggKF8uaXNFcXVhbChhcnJheUxpc3QyWzBdLCBcIkdMXCIpIHx8IF8uaXNFcXVhbChhcnJheUxpc3QyWzFdLCBcIkdMXCIpKSAmJiAoXy5pc0VxdWFsKGFycmF5TGlzdDJbMV0sIFwibXRyYWNrXCIpIHx8IF8uaXNFcXVhbChhcnJheUxpc3QyWzJdLCBcIm10cmFja1wiKSkgKXsgLy9nbFxuICAgICAgICAgIGdsUHJpdmF0ZURpcnR5ID0gYXJyYXlMaXN0Mls0XTtcbiAgICAgICAgICBnbFBzcyA9IGFycmF5TGlzdDJbM107XG4gICAgICAgIH0gZWxzZSBpZiAoIF8uaXNFcXVhbChhcnJheUxpc3QyWzBdLCBcIlRPVEFMXCIpIHx8IF8uaXNFcXVhbChhcnJheUxpc3QyWzFdLCBcIlRPVEFMXCIpICl7IC8vdG90YWxcbiAgICAgICAgICB0b3RhbFByaXZhdGVEaXJ0eSA9IGFycmF5TGlzdDJbM107XG4gICAgICAgICAgdG90YWxQc3MgPSBhcnJheUxpc3QyWzJdO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgfVxuICAgICAgICBcbiAgICAgIGlmICggIV8uaXNFcXVhbCh0b3RhbFByaXZhdGVEaXJ0eSwgXCJcIikgJiYgIV8uaXNVbmRlZmluZWQodG90YWxQcml2YXRlRGlydHkpICYmICFfLmlzRXF1YWwodG90YWxQcml2YXRlRGlydHksIFwibm9kZXhcIikgKXtcbiAgICAgICAgbGV0IHJldHVyblZhbHVlID0gW107XG4gICAgICAgIHJldHVyblZhbHVlWzBdID0gW107XG4gICAgICAgIGZvciAobGV0IGsgPSAwIDsgayA8IE1FTU9SWV9LRVlTLmxlbmd0aCA7ICsrIGspXG4gICAgICAgICAgcmV0dXJuVmFsdWVbMF1ba10gPSBNRU1PUllfS0VZU1trXTtcbiAgICAgICAgcmV0dXJuVmFsdWVbMV0gPSBbdG90YWxQcml2YXRlRGlydHksIG5hdGl2ZVByaXZhdGVEaXJ0eSwgZGFsdmlrUHJpdmF0ZURpcnR5LCBlZ2xQcml2YXRlRGlydHksIGdsUHJpdmF0ZURpcnR5LCB0b3RhbFBzcywgbmF0aXZlUHNzLCBkYWx2aWtQc3MsIGVnbFBzcywgZ2xQc3MsIG5hdGl2ZUhlYXBBbGxvY2F0ZWRTaXplLCBuYXRpdmVIZWFwU2l6ZV07XG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfSk7XG5cbn07XG5cbmhlbHBlcnMuZ2V0TmV0d29ya1RyYWZmaWNJbmZvID0gYXN5bmMgZnVuY3Rpb24gKGRhdGFSZWFkVGltZW91dCkge1xuXG4gIHJldHVybiBhd2FpdCByZXRyeUludGVydmFsKGRhdGFSZWFkVGltZW91dCwgMTAwMCwgYXN5bmMgKCkgPT4ge1xuICAgIFxuICAgIGxldCByZXR1cm5WYWx1ZSA9IFtdO1xuICAgIGxldCBjbWQsIGRhdGEsIHN0YXJ0LCBkZWxpbWl0ZXIsIGVuZCwgcGVuZGluZ0J5dGVzLCBidWNrZXREdXJhdGlvbiwgYnVja2V0U3RhcnQsIGFjdGl2ZVRpbWUsIHJ4Qnl0ZXMsIHJ4UGFja2V0cywgdHhCeXRlcywgdHhQYWNrZXRzLCBvcGVyYXRpb25zOyAgXG5cbiAgICBjbWQgPSBbJ2R1bXBzeXMnLCAnbmV0c3RhdHMnXTtcblxuICAgIGRhdGEgPSBhd2FpdCBhZGIuc2hlbGwoY21kKTtcblxuICAgIGlmICggIV8uaXNFcXVhbChkYXRhLCBcIlwiKSAmJiAhXy5pc1VuZGVmaW5lZChkYXRhKSAmJiAhXy5pc051bGwoZGF0YSkgKXtcbiAgICAgIC8vSW4gY2FzZSBvZiBuZXR3b3JrIHRyYWZmaWMgaW5mb3JtYXRpb24sIGl0IGlzIGRpZmZlcmVudCBmb3IgdGhlIHJldHVybiBkYXRhIGJldHdlZW4gZW11bGF0b3IgYW5kIHJlYWwgZGV2aWNlLlxuICAgICAgLy90aGUgcmV0dXJuIGRhdGEgb2YgZW11bGF0b3JcbiAgICAgIC8vWHQgc3RhdHM6XG4gICAgICAvL1BlbmRpbmcgYnl0ZXM6IDM5MjUwXG4gICAgICAvL0hpc3Rvcnkgc2luY2UgYm9vdDpcbiAgICAgIC8vaWRlbnQ9W1t0eXBlPVdJRkksIHN1YlR5cGU9Q09NQklORUQsIG5ldHdvcmtJZD1cIldpcmVkU1NJRFwiXV0gdWlkPS0xIHNldD1BTEwgdGFnPTB4MFxuICAgICAgLy9OZXR3b3JrU3RhdHNIaXN0b3J5OiBidWNrZXREdXJhdGlvbj0zNjAwMDAwXG4gICAgICAvL2J1Y2tldFN0YXJ0PTE0NzgwOTg4MDAwMDAgYWN0aXZlVGltZT0zMTgyNCByeEJ5dGVzPTIxNTAyIHJ4UGFja2V0cz03OCB0eEJ5dGVzPTE3NzQ4IHR4UGFja2V0cz05MCBvcGVyYXRpb25zPTBcbiAgICAgIC8vdGhlIHJldHVybiBkYXRhIG9mIHJlYWwgZGV2aWNlXG4gICAgICAvL1xuICAgICAgLy90aGUgcmV0dXJuIGRhdGEgb2YgcmVhbCBkZXZpY2VcbiAgICAgIC8vWHQgc3RhdHM6XG4gICAgICAvL1BlbmRpbmcgYnl0ZXM6IDBcbiAgICAgIC8vSGlzdG9yeSBzaW5jZSBib290OlxuICAgICAgLy9pZGVudD1be3R5cGU9TU9CSUxFLCBzdWJUeXBlPUNPTUJJTkVELCBzdWJzY3JpYmVySWQ9NDUwMDUwLi4ufV0gdWlkPS0xIHNldD1BTEwgdGFnPTB4MFxuICAgICAgLy9OZXR3b3JrU3RhdHNIaXN0b3J5OiBidWNrZXREdXJhdGlvbj0zNjAwXG4gICAgICAvL3N0PTE0NzgwODgwMDAgcmI9MzIxMTUyOTYgcnA9MzQyOTEgdGI9Mjk1NjgwNSB0cD0yNTcwNSBvcD0wXG4gICAgICAvL3N0PTE0NzgwOTE2MDAgcmI9MjcxNDY4MyBycD0xMTgyMSB0Yj0xNDIwNTY0IHRwPTEyNjUwIG9wPTBcbiAgICAgIC8vc3Q9MTQ3ODA5NTIwMCByYj0xMDA3OTIxMyBycD0xOTk2MiB0Yj0yNDg3NzA1IHRwPTIwMDE1IG9wPTBcbiAgICAgIC8vc3Q9MTQ3ODA5ODgwMCByYj00NDQ0NDMzIHJwPTEwMjI3IHRiPTE0MzAzNTYgdHA9MTA0OTMgb3A9MFxuICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgIGxldCBmcm9tWHRzdGF0cyA9IGRhdGEuaW5kZXhPZihcIlh0IHN0YXRzOlwiKTtcbiAgICAgICAgXG4gICAgICBzdGFydCA9IGRhdGEuaW5kZXhPZihcIlBlbmRpbmcgYnl0ZXM6XCIsIGZyb21YdHN0YXRzKTtcbiAgICAgIGRlbGltaXRlciA9IGRhdGEuaW5kZXhPZihcIjpcIiwgc3RhcnQrMSk7XG4gICAgICBlbmQgPSBkYXRhLmluZGV4T2YoXCJcXG5cIiwgZGVsaW1pdGVyKzEpO1xuICAgICAgcGVuZGluZ0J5dGVzID0gZGF0YS5zdWJzdHJpbmcoZGVsaW1pdGVyKzEsIGVuZCkudHJpbSgpO1xuXG4gICAgICBpZiAoZW5kID4gZGVsaW1pdGVyKXtcbiAgICAgICAgc3RhcnQgPSBkYXRhLmluZGV4T2YoXCJidWNrZXREdXJhdGlvblwiLCBlbmQrMSk7XG4gICAgICAgIGRlbGltaXRlciA9IGRhdGEuaW5kZXhPZihcIj1cIiwgc3RhcnQrMSk7XG4gICAgICAgIGVuZCA9IGRhdGEuaW5kZXhPZihcIlxcblwiLCBkZWxpbWl0ZXIrMSk7XG4gICAgICAgIGJ1Y2tldER1cmF0aW9uID0gZGF0YS5zdWJzdHJpbmcoZGVsaW1pdGVyKzEsIGVuZCkudHJpbSgpOyAgICAgICAgICAgICAgXG4gICAgICB9XG5cbiAgICAgIGlmIChzdGFydCA+PSAwKXtcbiAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKGVuZCArIDEsIGRhdGEubGVuZ3RoKTtcbiAgICAgICAgbGV0IGFycmF5TGlzdCA9IGRhdGEuc3BsaXQoXCJcXG5cIik7XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgKGFycmF5TGlzdC5sZW5ndGggPiAwKXtcbiAgICAgICAgICBzdGFydCA9IC0xO1xuXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDAgOyBqIDwgTkVUV09SS19LRVlTLmxlbmd0aCA7ICsrIGope1xuICAgICAgICAgICAgc3RhcnQgPSBhcnJheUxpc3RbMF0uaW5kZXhPZihORVRXT1JLX0tFWVNbal1bMF0pO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChzdGFydCA+PSAwICl7XG4gICAgICAgICAgICAgIGluZGV4ID0gajtcbiAgICAgICAgICAgICAgcmV0dXJuVmFsdWVbMF0gPSBbXTtcblxuICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCA7IGsgPCBORVRXT1JLX0tFWVNbal0ubGVuZ3RoIDsgKysgaylcbiAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZVswXVtrXSA9IE5FVFdPUktfS0VZU1tqXVtrXTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgICAgICBcbiAgICAgICAgICBsZXQgcmV0dXJuSW5kZXggPSAxO1xuICAgICAgICAgIGZvciAobGV0IGk9MCA7IGkgPCBhcnJheUxpc3QubGVuZ3RoIDsgaSsrKXtcblxuICAgICAgICAgICAgZGF0YSA9IGFycmF5TGlzdFtpXTtcbiAgICAgICAgICAgIHN0YXJ0ID0gZGF0YS5pbmRleE9mKE5FVFdPUktfS0VZU1tpbmRleF1bMF0pO1xuXG4gICAgICAgICAgICBpZiAoc3RhcnQgPj0gMCApe1xuXG4gICAgICAgICAgICAgIGRlbGltaXRlciA9IGRhdGEuaW5kZXhPZihcIj1cIiwgc3RhcnQrMSk7XG4gICAgICAgICAgICAgIGVuZCA9IGRhdGEuaW5kZXhPZihcIiBcIiwgZGVsaW1pdGVyKzEpO1xuICAgICAgICAgICAgICBidWNrZXRTdGFydCA9IGRhdGEuc3Vic3RyaW5nKGRlbGltaXRlcisxLCBlbmQpLnRyaW0oKTsgICAgIFxuXG4gICAgICAgICAgICAgIGlmIChlbmQgPiBkZWxpbWl0ZXIpe1xuICAgICAgICAgICAgICAgIHN0YXJ0ID0gZGF0YS5pbmRleE9mKE5FVFdPUktfS0VZU1tpbmRleF1bMV0sIGVuZCsxKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPj0gMCl7XG4gICAgICAgICAgICAgICAgICBkZWxpbWl0ZXIgPSBkYXRhLmluZGV4T2YoXCI9XCIsIHN0YXJ0KzEpO1xuICAgICAgICAgICAgICAgICAgZW5kID0gZGF0YS5pbmRleE9mKFwiIFwiLCBkZWxpbWl0ZXIrMSk7XG4gICAgICAgICAgICAgICAgICBhY3RpdmVUaW1lID0gZGF0YS5zdWJzdHJpbmcoZGVsaW1pdGVyKzEsIGVuZCkudHJpbSgpOyAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBpZiAoZW5kID4gZGVsaW1pdGVyKXtcbiAgICAgICAgICAgICAgICBzdGFydCA9IGRhdGEuaW5kZXhPZihORVRXT1JLX0tFWVNbaW5kZXhdWzJdLCBlbmQrMSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0ID49IDApe1xuICAgICAgICAgICAgICAgICAgZGVsaW1pdGVyID0gZGF0YS5pbmRleE9mKFwiPVwiLCBzdGFydCsxKTtcbiAgICAgICAgICAgICAgICAgIGVuZCA9IGRhdGEuaW5kZXhPZihcIiBcIiwgZGVsaW1pdGVyKzEpO1xuICAgICAgICAgICAgICAgICAgcnhCeXRlcyA9IGRhdGEuc3Vic3RyaW5nKGRlbGltaXRlcisxLCBlbmQpLnRyaW0oKTsgXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKGVuZCA+IGRlbGltaXRlcil7XG4gICAgICAgICAgICAgICAgc3RhcnQgPSBkYXRhLmluZGV4T2YoTkVUV09SS19LRVlTW2luZGV4XVszXSwgZW5kKzEpO1xuICAgICAgICAgICAgICAgIGlmIChzdGFydCA+PSAwKXtcbiAgICAgICAgICAgICAgICAgIGRlbGltaXRlciA9IGRhdGEuaW5kZXhPZihcIj1cIiwgc3RhcnQrMSk7XG4gICAgICAgICAgICAgICAgICBlbmQgPSBkYXRhLmluZGV4T2YoXCIgXCIsIGRlbGltaXRlcisxKTtcbiAgICAgICAgICAgICAgICAgIHJ4UGFja2V0cyA9IGRhdGEuc3Vic3RyaW5nKGRlbGltaXRlcisxLCBlbmQpLnRyaW0oKTsgXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKGVuZCA+IGRlbGltaXRlcil7XG4gICAgICAgICAgICAgICAgc3RhcnQgPSBkYXRhLmluZGV4T2YoTkVUV09SS19LRVlTW2luZGV4XVs0XSwgZW5kKzEpO1xuICAgICAgICAgICAgICAgIGlmIChzdGFydCA+PSAwKXtcbiAgICAgICAgICAgICAgICAgIGRlbGltaXRlciA9IGRhdGEuaW5kZXhPZihcIj1cIiwgc3RhcnQrMSk7XG4gICAgICAgICAgICAgICAgICBlbmQgPSBkYXRhLmluZGV4T2YoXCIgXCIsIGRlbGltaXRlcisxKTtcbiAgICAgICAgICAgICAgICAgIHR4Qnl0ZXMgPSBkYXRhLnN1YnN0cmluZyhkZWxpbWl0ZXIrMSwgZW5kKS50cmltKCk7ICAgXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGlmIChlbmQgPiBkZWxpbWl0ZXIpe1xuICAgICAgICAgICAgICAgIHN0YXJ0ID0gZGF0YS5pbmRleE9mKE5FVFdPUktfS0VZU1tpbmRleF1bNV0sIGVuZCsxKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPj0gMCl7XG4gICAgICAgICAgICAgICAgICBkZWxpbWl0ZXIgPSBkYXRhLmluZGV4T2YoXCI9XCIsIHN0YXJ0KzEpO1xuICAgICAgICAgICAgICAgICAgZW5kID0gZGF0YS5pbmRleE9mKFwiIFwiLCBkZWxpbWl0ZXIrMSk7XG4gICAgICAgICAgICAgICAgICB0eFBhY2tldHMgPSBkYXRhLnN1YnN0cmluZyhkZWxpbWl0ZXIrMSwgZW5kKS50cmltKCk7IFxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoZW5kID4gZGVsaW1pdGVyKXtcbiAgICAgICAgICAgICAgICBzdGFydCA9IGRhdGEuaW5kZXhPZihORVRXT1JLX0tFWVNbaW5kZXhdWzZdLCBlbmQrMSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0ID49IDApe1xuICAgICAgICAgICAgICAgICAgZGVsaW1pdGVyID0gZGF0YS5pbmRleE9mKFwiPVwiLCBzdGFydCsxKTtcbiAgICAgICAgICAgICAgICAgIGVuZCA9IGRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgb3BlcmF0aW9ucyA9IGRhdGEuc3Vic3RyaW5nKGRlbGltaXRlcisxLCBlbmQpLnRyaW0oKTsgXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVyblZhbHVlW3JldHVybkluZGV4ICsrXSA9IFtidWNrZXRTdGFydCwgYWN0aXZlVGltZSwgcnhCeXRlcywgcnhQYWNrZXRzLCB0eEJ5dGVzLCB0eFBhY2tldHMsIG9wZXJhdGlvbnMsIGJ1Y2tldER1cmF0aW9uXTsgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICB9XG5cbiAgICAgIGlmICggIV8uaXNFcXVhbChwZW5kaW5nQnl0ZXMsIFwiXCIpICYmICFfLmlzVW5kZWZpbmVkKHBlbmRpbmdCeXRlcykgJiYgIV8uaXNFcXVhbChwZW5kaW5nQnl0ZXMsIFwibm9kZXhcIikgKVxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgfVxuICBcbiAgfSk7XG5cbn07XG5cbk9iamVjdC5hc3NpZ24oZXh0ZW5zaW9ucywgY29tbWFuZHMsIGhlbHBlcnMpO1xuZXhwb3J0IHsgY29tbWFuZHMsIGhlbHBlcnMgfTtcbmV4cG9ydCBkZWZhdWx0IGV4dGVuc2lvbnM7XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uLy4uIn0=
