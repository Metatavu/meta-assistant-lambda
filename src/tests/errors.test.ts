import { sendWeeklyMessageHandler } from "../functions/sendWeeklyMessage/handler";
import { sendDailyMessageHandler } from "../functions/sendDailyMessage/handler";
import TestHelpers from "./utilities/test-utils";
import { forecastErrorMock, forecastMockNonProjectTime, mockForecastTimeRegistrations } from "./__mocks__/forecastMocks";
import { timebankGetUsersEmptyDataMock, timeEntryEmptyDataMock,timeTotalsEmptyDataMock } from "./__mocks__/timebankMocks";
import { DailyHandlerResponse, WeeklyHandlerResponse } from "../libs/api-gateway";
import { slackPostMessageError, slackUserDataError } from "./__mocks__/slackMocks";

jest.mock("node-fetch");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("timebank api get time entries error response", () => {
  it("should respond with corresponding error response", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockTimebankTimeEntriesCustom(timeEntryEmptyDataMock);
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();

    const messageData: DailyHandlerResponse = await sendDailyMessageHandler();

    expect(messageData).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading time entries from Timebank");
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
    expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading time registrations");
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
    expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading non project time");
  });
});

describe("timebank api get total time entries error response", () => {
  it("should respond with corresponding error response", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntriesCustom(timeTotalsEmptyDataMock);

    const messageData: WeeklyHandlerResponse = await sendWeeklyMessageHandler();

    expect(messageData).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading total time entries");
  });
});

describe("timebank api get users error response", () => {
  it("should respond with corresponding error response", async () => {
    TestHelpers.mockTimebankUsersCustom(timebankGetUsersEmptyDataMock);
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();

    const messageData: DailyHandlerResponse = await sendDailyMessageHandler();

    expect(messageData).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message: Error: Error while loading persons from Timebank");
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
  });

  it("should return expected error handling for slack API postmessage endpoint", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTimebankTimeEntries();
    TestHelpers.mockSlackPostMessageError();

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const messageData: DailyHandlerResponse = await sendDailyMessageHandler();

    expect(messageData).toBeDefined();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });
});

describe("Slack API error handling in weekly message handler", () => {
  it("should return expected error handling for slack API get user endpoint", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsersCustom(slackUserDataError);
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();
    TestHelpers.mockSlackPostMessage();

    const res: WeeklyHandlerResponse = await sendWeeklyMessageHandler();

    expect(res).toBeDefined();
    expect(res.message).toMatch("Error while sending slack message:");
    expect(res.message).toMatch(slackUserDataError.error);
  });

  it("should return expected error handling for slack API postmessage endpoint", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();
    TestHelpers.mockSlackPostMessageError();

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const res: WeeklyHandlerResponse = await sendWeeklyMessageHandler();

    expect(res).toBeDefined();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });
});