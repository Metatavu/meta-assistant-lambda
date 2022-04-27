// import { sendWeeklyMessage } from "../functions/sendWeeklyMessage/handler";
// import TestHelpers from "./utilities/test-utils";

// jest.mock("node-fetch");

// describe("mock the weekly handler", () => {
//   it("should return expected name", async () => {
//     let event;
//     let context;
//     let callback;

//     TestHelpers.mockTimebankUsers();
//     TestHelpers.mockSlackUsers();
//     TestHelpers.mockForecastData();
//     TestHelpers.mockTotalTimeEntries();

//     let messageData;

//     const res: any = await sendWeeklyMessage(event, context, callback);
//     messageData = JSON.parse(res.body);

//     expect(messageData.data[0].name).toEqual("tester test");
//     expect(messageData.data[1].name).toEqual("Meta T");
//   });
// });