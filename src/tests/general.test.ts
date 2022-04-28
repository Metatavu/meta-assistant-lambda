import { sendWeeklyMessage } from "../functions/sendWeeklyMessage/handler";
import { sendDailyMessage } from "../functions/sendDailyMessage/handler";
import TestHelpers from "./utilities/test-utils";
import { forecastMockTimeRegistrationsFirstEndpointError, forecastMockTimeRegistrationsSecondEndpointError } from "./__mocks__/forecastMocks";
import { timebankGetUsersEmptyDataMock, timeEntryEmptyDataMock,timeTotalsEmptyDataMock } from "./__mocks__/timebankMocks";

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("node-fetch");

// describe("timebank api get total time entries error response", () => {
//   it("should respond with corresponding error response", async () => {
//     let event;
//     let context;
//     let callback;
  
//     TestHelpers.mockTimebankUsers();
//     TestHelpers.mockSlackUsers();
//     TestHelpers.mockForecastData();
//     TestHelpers.mockTotalTimeEntriesCustom(timeTotalsEmptyDataMock);
    
//     let messageData;
    
//     const res: any = await sendWeeklyMessage(event, context, callback);

//     messageData = JSON.parse(res.body);

//     expect(res).toBeDefined();
//     expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading total time entries");
//   });
// });

// describe("timebank api get users error response", () => {
//   it("should respond with corresponding error response", async () => {
//     let event;
//     let context;
//     let callback;

//     TestHelpers.mockTimebankUsersCustom(timebankGetUsersEmptyDataMock);
//     TestHelpers.mockSlackUsers();
//     TestHelpers.mockForecastData();
//     TestHelpers.mockTotalTimeEntries();
    
//     let messageData;
    
//     const res: any = await sendDailyMessage(event, context, callback);

//     messageData = JSON.parse(res.body);

//     expect(res).toBeDefined();
//     expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading persons from Timebank");
//   });
// });

// describe("timebank api get time entries error response", () => {
//   it("should respond with corresponding error response", async () => {
//     let event;
//     let context;
//     let callback;
    
//     TestHelpers.mockTimebankUsers();
//     TestHelpers.mockTimebankTimeEntriesCustom(timeEntryEmptyDataMock);
//     TestHelpers.mockSlackUsers();
//     TestHelpers.mockForecastData();
//     TestHelpers.mockTotalTimeEntries();
        
//     let messageData;
        
//     const res: any = await sendDailyMessage(event, context, callback);
    
//     messageData = JSON.parse(res.body);
    
//     expect(res).toBeDefined();
//     expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading time entries from Timebank");
//   });
// });

describe("forecast api first endpoint error response", () => {
  it("should respond with corresponding error response", async () => {
    let event;
    let context;
    let callback;
    
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockTimebankTimeEntries();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastDataCustom(forecastMockTimeRegistrationsFirstEndpointError);
        
    let messageData;
        
    const res: any = await sendDailyMessage(event, context, callback);
    console.log(res);
    messageData = JSON.parse(res.body);
    
    expect(res).toBeDefined();
    console.log(messageData.message);
  });
});

// describe("forecast api second endpoint error response", () => {
//   it("should respond with corresponding error response", async () => {
//     let event;
//     let context;
//     let callback;
    
//     TestHelpers.mockTimebankUsers();
//     TestHelpers.mockTimebankTimeEntries();
//     TestHelpers.mockSlackUsers();
//     TestHelpers.mockForecastData();
        
//     let messageData;
        
//     const res: any = await sendDailyMessage(event, context, callback);
//     console.log(res);
//     messageData = JSON.parse(res.body);
    
//     expect(res).toBeDefined();
//     console.log(messageData.message);
//   });
// });