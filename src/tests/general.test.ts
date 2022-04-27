import { sendDailyMessage } from "../functions/sendDailyMessage/handler";
import TestHelpers from "./utilities/test-utils";
import { timebankGetUsersEmptyDataMock, timeEntryErrorDataMock } from "./__mocks__/timebankMocks";
beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("node-fetch");

describe("timebank api get users error response", () => {
  it("should show corresponding error message", async () => {
    let event;
    let context;
    let callback;

    TestHelpers.mockTimebankUsersCustom(timebankGetUsersEmptyDataMock);
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();
    
    let messageData;
    
    const res: any = await sendDailyMessage(event, context, callback);

    messageData = JSON.parse(res.body);

    expect(res).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading persons from Timebank");
  });
});

describe("timebank api get time entries error response", () => {
  it("should show corresponding error message", async () => {
    let event;
    let context;
    let callback;
    
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockTimebankTimeEntriesCustom(timeEntryErrorDataMock);
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();
        
    let messageData;
        
    const res: any = await sendDailyMessage(event, context, callback);
    
    messageData = JSON.parse(res.body);
    
    expect(res).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading time entries from Timebank");
  });
});