import { sendDailyMessage } from "../functions/sendDailyMessage/handler";
import TestHelpers from "./utilities/test-utils";

jest.mock("node-fetch");

describe("mock the daily handler", () => {
  it("should return expected name", async () => {
    let event;
    let context;
    let callback;

    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTimebankTimeEntries();

    let messageData;

    const res: any = await sendDailyMessage(event, context, callback);
    messageData = JSON.parse(res.body);

    expect(messageData.data[0]).toEqual("tester test");
    expect(messageData.data[1]).toEqual("Meta T");
    expect(messageData.data.length).toBe(2);
  });
});