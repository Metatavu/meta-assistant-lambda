import { sendDailyMessage } from "../functions/sendDailyMessage/handler";
import TestHelpers from "./utilities/test-utils";
import { timebankGetUsersErrorDataMock } from "./__mocks__/timebankMocks";
beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("node-fetch");

describe("timebank api error testing with null values", () => {
  it("should show corresponding error message", async () => {
    let event;
    let context;
    let callback;

    TestHelpers.mockTimebankUsersCustom(timebankGetUsersErrorDataMock);
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();
    
    let messageData;
    
    const res: any = await sendDailyMessage(event, context, callback);
    console.log(res);
    messageData = JSON.parse(res.body);

    expect(res).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message: TypeError: Cannot read property 'toString' of null");
  });
});