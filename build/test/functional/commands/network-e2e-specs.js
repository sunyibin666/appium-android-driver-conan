"use strict";

// This currently does not work reliably in CI
// Further, our CI does not respect skip or @skip-ci
// investigate and reinstate

// import chai from 'chai';
// import chaiAsPromised from 'chai-as-promised';
// import { AndroidDriver } from '../../../..';
// import sampleApps from 'sample-apps';

// chai.should();
// chai.use(chaiAsPromised);

// let driver;
// let caps = {
//   app: sampleApps('ApiDemos-debug'),
//   deviceName: 'Android',
//   platformName: 'Android',
//   appActivity: '.view.TextFields'
// };

// describe('network connection', function () {
//   this.timeout(120000);
//   before(async () => {
//     driver = new AndroidDriver();
//     await driver.createSession(caps);
//   });
//   after(async () => {
//     await driver.deleteSession();
//   });
//   describe('setNetworkConnection @skip-ci', () => {
//     function test (value) {
//       it(`should be able to set to ${value}`, async () => {
//         await driver.setNetworkConnection(value);
//         await driver.getNetworkConnection().should.eventually.equal(value);
//       });
//     }
//     for (let value of [1, 2, 4, 6]) {
//       test(value);
//     }
//   });
// });
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ0ZXN0L2Z1bmN0aW9uYWwvY29tbWFuZHMvbmV0d29yay1lMmUtc3BlY3MuanMiLCJzb3VyY2VzQ29udGVudCI6W10sInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLiJ9
