import { sendDailyMessageHandler } from "../functions/sendDailyMessage/handler";
import TestHelpers from "./utilities/test-utils";
import { timebankSpecialCharsMock } from "./__mocks__/timebankMocks";
import { slackUserData, slackSpecialCharsMock } from "./__mocks__/slackMocks";
import { DailyHandlerResponse } from "../libs/api-gateway";

jest.mock("node-fetch");

beforeEach(() => {
  jest.resetAllMocks();
});

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
    });
  });

  // @todo find out why tests below won't work when reorganized
  describe("Daily vacation time test", () => {
    it("Should not return user who is on vacation", async () => {
      TestHelpers.mockTimebankUsers();
      TestHelpers.mockSlackUsers();
      TestHelpers.mockForecastData();
      TestHelpers.mockTimebankTimeEntries();
      TestHelpers.mockSlackPostMessage();

      const messageData: DailyHandlerResponse = await sendDailyMessageHandler();
      
      expect(messageData.data.length).toBe(1);
    });
  });

  // Unexpected behaviour with special characters passed to timebank time entries, causes Typeerror Found non-callable @@iterator- requires further investigation.
  describe("special character test", () => {
    it("should return expected data",async () => {
      TestHelpers.mockTimebankUsersCustom(timebankSpecialCharsMock);
      TestHelpers.mockSlackUsersCustom(slackSpecialCharsMock);
      TestHelpers.mockForecastData();
      TestHelpers.mockTimebankTimeEntries();
      TestHelpers.mockSlackPostMessage();

      const messageData: DailyHandlerResponse = await sendDailyMessageHandler();

      expect(messageData).toBeDefined();
      expect(messageData.data[0].message.name).toBe("Ñöä!£ Çøæé");
    });
  });
});