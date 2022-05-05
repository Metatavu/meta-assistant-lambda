import { sendDailyMessageHandler } from "../functions/sendDailyMessage/handler";
import TestHelpers from "./utilities/test-utils";
import { timebankSpecialCharsMock, timeEntrySpecialCharsMock } from "./__mocks__/timebankMocks";
import { slackUserDataError, slackUserData, slackPostMessageError, slackSpecialCharsMock } from "./__mocks__/slackMocks";
import { DailyHandlerResponse } from "../libs/api-gateway";

jest.mock("node-fetch");

let event;
let context;
let callback;

describe("mock the daily handler", () => {
  describe("handler is mocked and run to send a message", () => {
    it("should return all expected message data", async () => {
      TestHelpers.mockTimebankUsers();
      TestHelpers.mockSlackUsers();
      TestHelpers.mockForecastData();
      TestHelpers.mockTimebankTimeEntries();
      TestHelpers.mockSlackPostMessage();

      const messageBody: DailyHandlerResponse = await sendDailyMessageHandler();
      const messageData = messageBody.data;

      const spy = jest.spyOn(TestHelpers, "validateDailyMessage");

      messageData.forEach(messageData => {
        TestHelpers.validateDailyMessage(messageData, slackUserData.members);
      });

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe("Daily vacation time test", () => {
    it("Should not return user who is on vacation", async () => {
      TestHelpers.mockTimebankUsers();
      TestHelpers.mockSlackUsers();
      TestHelpers.mockForecastData();
      TestHelpers.mockTimebankTimeEntries();
      TestHelpers.mockSlackPostMessage();

      const messageData: DailyHandlerResponse = await sendDailyMessageHandler();
      console.log("RESPONSE FROM HANDLER", messageData);

      expect(messageData.data.length).toBe(2);
    });
  });

  describe("handler is mocked for error handling", () => {
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

      const messageData: DailyHandlerResponse = await sendDailyMessageHandler();

      expect(messageData).toBeDefined();
      expect(messageData.message).toMatch("Error while sending slack message:");
      expect(messageData.message).toMatch(slackPostMessageError.error);
    });
  });

  describe("special character test", () => {
    it("should return expected data",async () => {
      TestHelpers.mockTimebankUsersCustom(timebankSpecialCharsMock);
      TestHelpers.mockSlackUsersCustom(slackSpecialCharsMock);
      TestHelpers.mockForecastData();
      TestHelpers.mockTimebankTimeEntriesCustom(timeEntrySpecialCharsMock);
      TestHelpers.mockSlackPostMessage();

      const messageData: DailyHandlerResponse = await sendDailyMessageHandler();

      expect(messageData).toBeDefined();
      expect(messageData.data[0].name).toBe("Ñöä!£ Çøæé");
    });
  });
});