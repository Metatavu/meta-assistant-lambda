import { sendWeeklyMessage } from "../functions/sendWeeklyMessage/handler";
import { sendDailyMessage } from "../functions/sendDailyMessage/handler";
import TestHelpers from "./utilities/test-utils";
import { forecastErrorMock, forecastMockNonProjectTime, mockForecastTimeRegistrations } from "./__mocks__/forecastMocks";
import { timebankGetUsersEmptyDataMock, timeEntryEmptyDataMock,timeTotalsEmptyDataMock } from "./__mocks__/timebankMocks";
import { slackUserDataError } from "./__mocks__/slackMocks";

jest.mock("node-fetch");

beforeAll(() => {
  jest.clearAllMocks();
});

describe("timebank api get time entries error response", () => {
  it("should respond with corresponding error response", async () => {
    let event;
    let context;
    let callback;
    
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockTimebankTimeEntriesCustom(timeEntryEmptyDataMock);
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
        
    let messageData;
        
    const res: any = await sendDailyMessage(event, context, callback);
    messageData = JSON.parse(res.body);
    expect(res).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading time entries from Timebank");
  });
});

describe("forecast api time registrations error response", () => {
  it("should respond with corresponding error response", async () => {
    let event;
    let context;
    let callback;
    
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockTimebankTimeEntries();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastDataCustom(forecastMockNonProjectTime, forecastErrorMock);
        
    let messageData;
        
    const res: any = await sendDailyMessage(event, context, callback);
    messageData = JSON.parse(res.body);
    expect(res).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading non project time, undefined");
  });
});

describe("forecast api non project time error response", () => {
  it("should respond with corresponding error response", async () => {
    let event;
    let context;
    let callback;
    
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockTimebankTimeEntries();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastDataCustom(forecastErrorMock, mockForecastTimeRegistrations);
        
    let messageData;
        
    const res: any = await sendDailyMessage(event, context, callback);
    messageData = JSON.parse(res.body);
    expect(res).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading time registrations");
  });
});

describe("timebank api get total time entries error response", () => {
  it("should respond with corresponding error response", async () => {
    let event;
    let context;
    let callback;
  
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntriesCustom(timeTotalsEmptyDataMock);
    
    let messageData;
    
    const res: any = await sendWeeklyMessage(event, context, callback);
    messageData = JSON.parse(res.body);
    expect(res).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading total time entries");
  });
});

describe("timebank api get users error response", () => {
  it("should respond with corresponding error response", async () => {
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