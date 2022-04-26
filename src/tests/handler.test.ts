import { sendDailyMessage } from "../functions/sendDailyMessage/handler";
import TestHelpers from "./utilities/test-utils";

jest.mock("node-fetch");

describe("mock the handler", () => {
  it("should expected name", async () => {
    let event;
    let context;
    let callback;

    TestHelpers.mockTimebankUsers();
    TestHelpers.MockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTimebankTimeEntries();

    let messageData;

    try{
      const res: any = await sendDailyMessage(event, context, callback);
      console.log("handler try", res);
      messageData = JSON.parse(res.body);

      // NOTE- duplicated expects as jest assertion failure moves into catch- need to correct...
      expect(messageData.data[0].name).toEqual("tester test");
      expect(messageData.data[1].name).toEqual("Meta T");
    } catch (e) {
      console.log("handler Catch", e);
      expect(messageData.data[0].name).toEqual("tester test");
      expect(messageData.data[1].name).toEqual("Meta T");
    }
  });
});