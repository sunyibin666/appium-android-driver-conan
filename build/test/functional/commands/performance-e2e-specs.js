'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _2 = require('../../..');

var _3 = _interopRequireDefault(_2);

var _sampleApps = require('sample-apps');

var _sampleApps2 = _interopRequireDefault(_sampleApps);

var _libCommandsPerformanceJs = require('../../../lib/commands/performance.js');

//SUPPORTED_PERFORMANCE_DATA_TYPES,CPU_KEYS,

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

_chai2['default'].should();
_chai2['default'].use(_chaiAsPromised2['default']);

var driver = undefined;
var caps = {
  app: (0, _sampleApps2['default'])('ApiDemos-debug'),
  deviceName: 'Android',
  platformName: 'Android',
  appPackage: 'io.appium.android.apis',
  appActivity: '.view.TextFields'
};

describe('performance', function () {
  before(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          driver = new _3['default']();
          context$2$0.next = 3;
          return _regeneratorRuntime.awrap(driver.createSession(caps));

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  after(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(driver.deleteSession());

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  describe('getPerformanceData', function () {
    var _this2 = this;

    beforeEach(function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.startActivity(caps.appPackage, caps.appActivity));

          case 2:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });

    it('should get the performancedata', function callee$2$0() {
      var capability;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.getPerformanceDataTypes());

          case 2:
            capability = context$3$0.sent;

            capability.should.eql(_lodash2['default'].keys(_libCommandsPerformanceJs.SUPPORTED_PERFORMANCE_DATA_TYPES));

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });

    it('should throw an Error for unsupported capability data type ', function () {
      driver.getPerformanceData('io.appium.android.apis', 'info', 1000).should.be.rejected;
    });

    it('should get the amount of cpu by user and kernel process', function callee$2$0() {
      var cpu, i;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.getPerformanceData('io.appium.android.apis', 'cpuinfo', 1000));

          case 2:
            cpu = context$3$0.sent;

            cpu.length.should.be.above(0);
            cpu[0].should.eql(_libCommandsPerformanceJs.CPU_KEYS);
            if (cpu.length > 1) {
              for (i = 1; i < cpu.length; ++i) {
                cpu[0].length.should.equal(cpu[i].length);
              }
            }

          case 6:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should get the amount of memory used by the process', function callee$2$0() {
      var memory, i;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(driver.getPerformanceData('io.appium.android.apis', 'memoryinfo', 1000));

          case 2:
            memory = context$3$0.sent;

            memory.length.should.be.above(0);
            memory[0].should.eql(_libCommandsPerformanceJs.MEMORY_KEYS);
            if (memory.length > 1) {
              for (i = 1; i < memory.length; ++i) {
                memory[0].length.should.equal(memory[i].length);
              }
            }

          case 6:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
    it('should get the remaining battery power', function () {
      var battery = driver.getPerformanceData('io.appium.android.apis', 'batteryinfo', 1000);
      battery.length.should.be.above(0);
      battery[0].should.eql(_libCommandsPerformanceJs.BATTERY_KEYS);
      if (battery.length > 1) {
        for (var i = 1; i < battery.length; ++i) {
          battery[0].length.should.equal(battery[i].length);
        }
      }
    });
    it('should get the network statistics', function () {
      var network = driver.getPerformanceData('io.appium.android.apis', 'networkinfo', 1000);
      network.length.should.be.above(0);

      var compare = false;

      for (var j = 0; j < _libCommandsPerformanceJs.NETWORK_KEYS.length; ++j) {
        if (_lodash2['default'].isEqual(_libCommandsPerformanceJs.NETWORK_KEYS[j], network[0])) {
          compare = true;
        }
      }

      compare.should.equal(true);

      if (network.length > 1) {
        for (var i = 1; i < network.length; ++i) {
          network[0].length.should.equal(network[i].length);
        }
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvZnVuY3Rpb25hbC9jb21tYW5kcy9wZXJmb3JtYW5jZS1lMmUtc3BlY3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBQWlCLE1BQU07Ozs7OEJBQ0ksa0JBQWtCOzs7O2lCQUNuQixVQUFVOzs7OzBCQUNiLGFBQWE7Ozs7d0NBQ2dFLHNDQUFzQzs7OztzQkFDNUgsUUFBUTs7OztBQUV0QixrQkFBSyxNQUFNLEVBQUUsQ0FBQztBQUNkLGtCQUFLLEdBQUcsNkJBQWdCLENBQUM7O0FBRXpCLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLElBQUksR0FBRztBQUNULEtBQUcsRUFBRSw2QkFBVyxnQkFBZ0IsQ0FBQztBQUNqQyxZQUFVLEVBQUUsU0FBUztBQUNyQixjQUFZLEVBQUUsU0FBUztBQUN2QixZQUFVLEVBQUUsd0JBQXdCO0FBQ3BDLGFBQVcsRUFBRSxrQkFBa0I7Q0FDaEMsQ0FBQzs7QUFFRixRQUFRLENBQUMsYUFBYSxFQUFFLFlBQU07QUFDNUIsUUFBTSxDQUFDOzs7O0FBQ0wsZ0JBQU0sR0FBRyxtQkFBbUIsQ0FBQzs7MkNBQ3ZCLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDOzs7Ozs7O0dBQ2pDLENBQUMsQ0FBQztBQUNILE9BQUssQ0FBQzs7Ozs7MkNBQ0UsTUFBTSxDQUFDLGFBQWEsRUFBRTs7Ozs7OztHQUM3QixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLG9CQUFvQixFQUFFLFlBQVk7OztBQUN6QyxjQUFVLENBQUM7Ozs7OzZDQUNILE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDOzs7Ozs7O0tBQzlELENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsZ0NBQWdDLEVBQUU7VUFDL0IsVUFBVTs7Ozs7NkNBQVMsTUFBTSxDQUFDLHVCQUF1QixFQUFFOzs7QUFBbkQsc0JBQVU7O0FBQ2Qsc0JBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxD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LEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdkYsYUFBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFbEMsVUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDOztBQUVwQixXQUFNLElBQUksQ0FBQyxHQUFFLENBQUMsRUFBRyxDQUFDLEdBQUcsdUNBQWEsTUFBTSxFQUFHLEVBQUcsQ0FBQyxFQUFDO0FBQzlDLFlBQUksb0JBQUUsT0FBTyxDQUFFLHVDQUFhLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQzFDLGlCQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ2hCO09BQ0Y7O0FBRUQsYUFBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTNCLFVBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdEIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUM7QUFDdEMsaUJBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbkQ7T0FDRjtLQUNGLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0L2Z1bmN0aW9uYWwvY29tbWFuZHMvcGVyZm9ybWFuY2UtZTJlLXNwZWNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWkgZnJvbSAnY2hhaSc7XG5pbXBvcnQgY2hhaUFzUHJvbWlzZWQgZnJvbSAnY2hhaS1hcy1wcm9taXNlZCc7XG5pbXBvcnQgQW5kcm9pZERyaXZlciBmcm9tICcuLi8uLi8uLic7XG5pbXBvcnQgc2FtcGxlQXBwcyBmcm9tICdzYW1wbGUtYXBwcyc7XG5pbXBvcnQgeyBTVVBQT1JURURfUEVSRk9STUFOQ0VfREFUQV9UWVBFUywgQ1BVX0tFWVMsIE1FTU9SWV9LRVlTLCBCQVRURVJZX0tFWVMsIE5FVFdPUktfS0VZUyB9IGZyb20gJy4uLy4uLy4uL2xpYi9jb21tYW5kcy9wZXJmb3JtYW5jZS5qcyc7Ly9TVVBQT1JURURfUEVSRk9STUFOQ0VfREFUQV9UWVBFUyxDUFVfS0VZUyxcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmNoYWkuc2hvdWxkKCk7XG5jaGFpLnVzZShjaGFpQXNQcm9taXNlZCk7XG5cbmxldCBkcml2ZXI7XG5sZXQgY2FwcyA9IHtcbiAgYXBwOiBzYW1wbGVBcHBzKCdBcGlEZW1vcy1kZWJ1ZycpLFxuICBkZXZpY2VOYW1lOiAnQW5kcm9pZCcsXG4gIHBsYXRmb3JtTmFtZTogJ0FuZHJvaWQnLFxuICBhcHBQYWNrYWdlOiAnaW8uYXBwaXVtLmFuZHJvaWQuYXBpcycsXG4gIGFwcEFjdGl2aXR5OiAnLnZpZXcuVGV4dEZpZWxkcydcbn07XG5cbmRlc2NyaWJlKCdwZXJmb3JtYW5jZScsICgpID0+IHtcbiAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICBkcml2ZXIgPSBuZXcgQW5kcm9pZERyaXZlcigpO1xuICAgIGF3YWl0IGRyaXZlci5jcmVhdGVTZXNzaW9uKGNhcHMpO1xuICB9KTtcbiAgYWZ0ZXIoYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGRyaXZlci5kZWxldGVTZXNzaW9uKCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRQZXJmb3JtYW5jZURhdGEnLCBmdW5jdGlvbiAoKSB7XG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBkcml2ZXIuc3RhcnRBY3Rpdml0eShjYXBzLmFwcFBhY2thZ2UsIGNhcHMuYXBwQWN0aXZpdHkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBnZXQgdGhlIHBlcmZvcm1hbmNlZGF0YScsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCBjYXBhYmlsaXR5ID0gYXdhaXQgZHJpdmVyLmdldFBlcmZvcm1hbmNlRGF0YVR5cGVzKCk7XG4gICAgICBjYXBhYmlsaXR5LnNob3VsZC5lcWwoXy5rZXlzKFNVUFBPUlRFRF9QRVJGT1JNQU5DRV9EQVRBX1RZUEVTKSk7XG4gICAgfSk7XG4gICAgXG4gICAgaXQoJ3Nob3VsZCB0aHJvdyBhbiBFcnJvciBmb3IgdW5zdXBwb3J0ZWQgY2FwYWJpbGl0eSBkYXRhIHR5cGUgJywgKCkgPT4ge1xuICAgICAgKGRyaXZlci5nZXRQZXJmb3JtYW5jZURhdGEoJ2lvLmFwcGl1bS5hbmRyb2lkLmFwaXMnLCAnaW5mbycsIDEwMDApKS5zaG91bGQuYmUucmVqZWN0ZWQ7XG4gICAgfSk7XG4gICAgXG4gICAgaXQoJ3Nob3VsZCBnZXQgdGhlIGFtb3VudCBvZiBjcHUgYnkgdXNlciBhbmQga2VybmVsIHByb2Nlc3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgY3B1ID0gYXdhaXQgZHJpdmVyLmdldFBlcmZvcm1hbmNlRGF0YSgnaW8uYXBwaXVtLmFuZHJvaWQuYXBpcycsICdjcHVpbmZvJywgMTAwMCk7XG4gICAgICBjcHUubGVuZ3RoLnNob3VsZC5iZS5hYm92ZSgwKTtcbiAgICAgIGNwdVswXS5zaG91bGQuZXFsKENQVV9LRVlTKTtcbiAgICAgIGlmIChjcHUubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGNwdS5sZW5ndGg7ICsraSl7XG4gICAgICAgICAgY3B1WzBdLmxlbmd0aC5zaG91bGQuZXF1YWwoY3B1W2ldLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGdldCB0aGUgYW1vdW50IG9mIG1lbW9yeSB1c2VkIGJ5IHRoZSBwcm9jZXNzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IG1lbW9yeSA9IGF3YWl0IGRyaXZlci5nZXRQZXJmb3JtYW5jZURhdGEoJ2lvLmFwcGl1bS5hbmRyb2lkLmFwaXMnLCAnbWVtb3J5aW5mbycsIDEwMDApO1xuICAgICAgbWVtb3J5Lmxlbmd0aC5zaG91bGQuYmUuYWJvdmUoMCk7XG4gICAgICBtZW1vcnlbMF0uc2hvdWxkLmVxbChNRU1PUllfS0VZUyk7XG4gICAgICBpZiAobWVtb3J5Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBtZW1vcnkubGVuZ3RoOyArK2kpe1xuICAgICAgICAgIG1lbW9yeVswXS5sZW5ndGguc2hvdWxkLmVxdWFsKG1lbW9yeVtpXS5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBnZXQgdGhlIHJlbWFpbmluZyBiYXR0ZXJ5IHBvd2VyJywgKCkgPT4ge1xuICAgICAgbGV0IGJhdHRlcnkgPSBkcml2ZXIuZ2V0UGVyZm9ybWFuY2VEYXRhKCdpby5hcHBpdW0uYW5kcm9pZC5hcGlzJywgJ2JhdHRlcnlpbmZvJywgMTAwMCk7XG4gICAgICBiYXR0ZXJ5Lmxlbmd0aC5zaG91bGQuYmUuYWJvdmUoMCk7XG4gICAgICBiYXR0ZXJ5WzBdLnNob3VsZC5lcWwoQkFUVEVSWV9LRVlTKTtcbiAgICAgIGlmIChiYXR0ZXJ5Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBiYXR0ZXJ5Lmxlbmd0aDsgKytpKXtcbiAgICAgICAgICBiYXR0ZXJ5WzBdLmxlbmd0aC5zaG91bGQuZXF1YWwoYmF0dGVyeVtpXS5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICB9ICAgICAgXG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBnZXQgdGhlIG5ldHdvcmsgc3RhdGlzdGljcycsICgpID0+IHtcbiAgICAgIGxldCBuZXR3b3JrID0gZHJpdmVyLmdldFBlcmZvcm1hbmNlRGF0YSgnaW8uYXBwaXVtLmFuZHJvaWQuYXBpcycsICduZXR3b3JraW5mbycsIDEwMDApO1xuICAgICAgbmV0d29yay5sZW5ndGguc2hvdWxkLmJlLmFib3ZlKDApO1xuICAgICAgXG4gICAgICBsZXQgY29tcGFyZSA9IGZhbHNlO1xuXG4gICAgICBmb3IgKCBsZXQgaj0gMCA7IGogPCBORVRXT1JLX0tFWVMubGVuZ3RoIDsgKysgail7XG4gICAgICAgIGlmIChfLmlzRXF1YWwoIE5FVFdPUktfS0VZU1tqXSwgbmV0d29ya1swXSkpe1xuICAgICAgICAgIGNvbXBhcmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGNvbXBhcmUuc2hvdWxkLmVxdWFsKHRydWUpO1xuICAgICAgXG4gICAgICBpZiAobmV0d29yay5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbmV0d29yay5sZW5ndGg7ICsraSl7XG4gICAgICAgICAgbmV0d29ya1swXS5sZW5ndGguc2hvdWxkLmVxdWFsKG5ldHdvcmtbaV0ubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLiJ9
