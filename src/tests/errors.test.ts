import { sendWeeklyMessageHandler } from "../functions/sendWeeklyMessage/handler";
import { sendDailyMessageHandler } from "../functions/sendDailyMessage/handler";
import TestHelpers from "./utilities/test-utils";
import { forecastErrorMock, forecastMockNonProjectTime, mockForecastTimeRegistrations } from "./__mocks__/forecastMocks";
import { timebankGetUsersEmptyDataMock, dailyEntryEmptyDataMock,timeTotalsEmptyDataMock, timebankUser1 } from "./__mocks__/timebankMocks";
import { DailyHandlerResponse, WeeklyHandlerResponse } from "../libs/api-gateway";
import { slackPostMessageError, slackUserDataError } from "./__mocks__/slackMocks";
import fetch from "node-fetch";

jest.mock("node-fetch");

const consoleSpy = jest.spyOn(console, "error");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("timebank api get time entries error response", () => {
  it("should respond with corresponding error response", async () => {
    TestHelpers.mockTimebankUsersCustom(200, [timebankUser1]);
    TestHelpers.mockTimebankTimeEntriesCustom(dailyEntryEmptyDataMock);
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();

    const messageData: DailyHandlerResponse = await sendDailyMessageHandler();

    expect(messageData).toBeDefined();
    expect(consoleSpy).toHaveBeenCalledWith("Error: Error while loading DailyEntries for person 1 from Timebank");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});

describe("forecast api time registrations error response", () => {
  it("should respond with corresponding error response", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockTimebankTimeEntries();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastDataCustom(forecastErrorMock, forecastMockNonProjectTime, { status: 401 }, { status: 200 });

    const messageData: DailyHandlerResponse = await sendDailyMessageHandler();

    expect(messageData).toBeDefined();
    expect(consoleSpy).toHaveBeenLastCalledWith("Error: Error while loading time registrations");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});

describe("forecast api non project time error response", () => {
  it("should respond with corresponding error response", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockTimebankTimeEntries();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastDataCustom(mockForecastTimeRegistrations, forecastErrorMock, { status: 200 }, { status: 401 });
    TestHelpers.mockSlackPostMessage();

    const messageData: DailyHandlerResponse = await sendDailyMessageHandler();

    expect(messageData).toBeDefined();
    expect(consoleSpy).toHaveBeenCalledWith("Error: Error while loading non project time");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});

describe("timebank api get total time entries error response", () => {
  it("should respond with corresponding error response", async () => {
    TestHelpers.mockTimebankUsersCustom(200, [timebankUser1]);
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntriesCustom(timeTotalsEmptyDataMock);

    const messageData: WeeklyHandlerResponse = await sendWeeklyMessageHandler();

    expect(messageData).toBeDefined();
    expect(consoleSpy).toHaveBeenCalledWith("Error: Error while loading PersonTotalTimes for person 1 from Timebank");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
}); 

describe("timebank api get users error response", () => {
  it("should respond with corresponding error response", async () => {
    TestHelpers.mockTimebankUsersCustom(404, timebankGetUsersEmptyDataMock);
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();

    const messageData: DailyHandlerResponse = await sendDailyMessageHandler();

    expect(messageData).toBeDefined();
    expect(consoleSpy).toHaveBeenCalledWith("Error: Error while loading Persons from Timebank");
  });
});

describe("Slack API error handling in daily message handler", () => {
  it("should return expected error handling for slack API get user endpoint", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsersCustom(slackUserDataError);
    TestHelpers.mockForecastData();
    TestHelpers.mockTimebankTimeEntries();
    TestHelpers.mockSlackPostMessage();

    const messageData: DailyHandlerResponse = await sendDailyMessageHandler();

    expect(messageData).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message:");
    expect(messageData.message).toMatch(slackUserDataError.error);
    expect(consoleSpy).toHaveBeenCalledWith("Error: Error while loading slack users list, invalid_cursor");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it("should return expected error handling for slack API postmessage endpoint", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTimebankTimeEntries();
    TestHelpers.mockSlackPostMessageError();

    const messageData: DailyHandlerResponse = await sendDailyMessageHandler();

    expect(messageData).toBeDefined();
    expect(messageData.message).toMatch("Everything went well sending the daily, see data for message breakdown...")
    expect(consoleSpy).toHaveBeenCalledWith("Error while posting slack messages, too_many_attachments\n");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});

describe("Slack API error handling in weekly message handler", () => {
  it("should return expected error handling for slack API get user endpoint", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsersCustom(slackUserDataError);
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();
    TestHelpers.mockSlackPostMessage();

    const messageData: WeeklyHandlerResponse = await sendWeeklyMessageHandler();

    expect(messageData).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message:");
    expect(messageData.message).toMatch(slackUserDataError.error);
    expect(consoleSpy).toHaveBeenCalledWith("Error: Error while loading slack users list, invalid_cursor");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it("should return expected error handling for slack API postmessage endpoint", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();
    TestHelpers.mockSlackPostMessageError();

    const messageData: WeeklyHandlerResponse = await sendWeeklyMessageHandler();

    expect(messageData).toBeDefined();
    expect(messageData.message).toMatch("Everything went well sending the weekly, see data for message breakdown...");
    expect(consoleSpy).toHaveBeenCalledWith("Error while posting slack messages, too_many_attachments\ntoo_many_attachments\n");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});