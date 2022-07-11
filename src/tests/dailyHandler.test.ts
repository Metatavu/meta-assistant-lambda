import { sendDailyMessageHandler } from "../functions/sendDailyMessage/handler";
import TestHelpers from "./utilities/test-utils";
import { dailyEntryMock1, dailyEntryMock2, dailyEntryMock3, timebankGetUsersMock, timebankSpecialCharsMock } from "./__mocks__/timebankMocks";
import { slackUserData, slackSpecialCharsMock, slackPostMessageMock } from "./__mocks__/slackMocks";
import { DailyHandlerResponse } from "../libs/api-gateway";
import { forecastMockNonProjectTime, mockForecastTimeRegistrations } from "./__mocks__/forecastMocks";

jest.mock("node-fetch");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("mock the daily handler", () => {
  describe("handler is mocked and run to send a message", () => {
    it("should return all expected message data", async () => {
      TestHelpers.mockTimebankPersons(200, timebankGetUsersMock);
      TestHelpers.mockTimebankDailyEntries(200, [dailyEntryMock1, dailyEntryMock2, dailyEntryMock3]);
      TestHelpers.mockForecastResponse(200, [mockForecastTimeRegistrations, forecastMockNonProjectTime], true);
      TestHelpers.mockSlackUsers(slackUserData);
      TestHelpers.mockSlackPostMessage(slackPostMessageMock);

      const messageBody: DailyHandlerResponse = await sendDailyMessageHandler();
      const messageData = messageBody.data;

      const spy = jest.spyOn(TestHelpers, "validateDailyMessage");

      messageData.forEach(messageData => {
        TestHelpers.validateDailyMessage(messageData, slackUserData.members);
      });
    });
  });

  describe("Daily vacation time test", () => {
    it("Should not return user who is on vacation", async () => {
      TestHelpers.mockTimebankPersons(200, timebankGetUsersMock);
      TestHelpers.mockTimebankDailyEntries(200, [dailyEntryMock1, dailyEntryMock2, dailyEntryMock3]);
      TestHelpers.mockForecastResponse(200, [mockForecastTimeRegistrations, forecastMockNonProjectTime], true);
      TestHelpers.mockSlackUsers(slackUserData);
      TestHelpers.mockSlackPostMessage(slackPostMessageMock);

      const messageData: DailyHandlerResponse = await sendDailyMessageHandler();
      
      expect(messageData.data.length).toBe(1);
    });
  });

  describe("special character test", () => {
    it("should return expected data",async () => {
      TestHelpers.mockTimebankPersons(200, timebankSpecialCharsMock);
      TestHelpers.mockTimebankDailyEntries(200, [dailyEntryMock1, dailyEntryMock2, dailyEntryMock3]);
      TestHelpers.mockForecastResponse(200, [mockForecastTimeRegistrations, forecastMockNonProjectTime], true);
      TestHelpers.mockSlackUsers(slackSpecialCharsMock);
      TestHelpers.mockSlackPostMessage(slackPostMessageMock);

      const messageData: DailyHandlerResponse = await sendDailyMessageHandler();

      expect(messageData).toBeDefined();
      expect(messageData.data[0].message.name).toBe("Ñöä!£ Çøæé");
    });
  });
});