import { sendDailyMessage } from "../functions/sendDailyMessage/handler";
import TestHelpers from "./utilities/test-utils";
import { timebankSpecialCharsMock, timeEntrySpecialCharsMock } from "./__mocks__/timebankMocks";
import { slackUserDataError, slackUserData, slackPostMessageError, slackSpecialCharsMock } from "./__mocks__/slackMocks";

jest.mock("node-fetch");

describe("mock the daily handler", () => {
  describe("handler is mocked and run to send a message", () => {
    it("should return all expected message data", async () => {
      let event;
      let context;
      let callback;

      TestHelpers.mockTimebankUsers();
      TestHelpers.mockSlackUsers();
      TestHelpers.mockForecastData();
      TestHelpers.mockTimebankTimeEntries();
      TestHelpers.mockSlackPostMessage();

      const res: any = await sendDailyMessage(event, context, callback);
      const statusCode = JSON.parse(res.statusCode);
      const messageData = JSON.parse(res.body);

      expect(res).toBeDefined();
      expect(messageData).toBeDefined();
      expect(messageData.data[0].message).toBeDefined();
      expect(typeof messageData.data[0].message).toEqual(typeof "string");
      expect(messageData.data[0].name).toBeDefined();
      expect(messageData.data[0].displayDate).toBeDefined();
      expect(messageData.data[0].displayLogged).toBeDefined();
      expect(messageData.data[0].displayExpected).toBeDefined();
      expect(messageData.data[0].displayProject).toBeDefined();
      expect(messageData.data[0].displayInternal).toBeDefined();
      expect(messageData.data[0].billableHoursPercentage).toBeDefined();
      expect(messageData.data[0].name).toEqual(slackUserData.members[0].real_name);
      expect(messageData.data[1].message).toBeDefined();
      expect(typeof messageData.data[1].message).toEqual(typeof "string");
      expect(messageData.data[1].name).toBeDefined();
      expect(messageData.data[1].displayDate).toBeDefined();
      expect(messageData.data[1].displayLogged).toBeDefined();
      expect(messageData.data[1].displayExpected).toBeDefined();
      expect(messageData.data[1].displayProject).toBeDefined();
      expect(messageData.data[1].displayInternal).toBeDefined();
      expect(messageData.data[1].billableHoursPercentage).toBeDefined();
      expect(messageData.data[1].name).toEqual(slackUserData.members[1].real_name);
      expect(messageData.data[2]).toBeUndefined();
      expect(statusCode).toEqual(200);
    });
  });

  describe("Daily vacation time test", () => {
    it("Should not return user who is on vacation", async () => {
      let event;
      let context;
      let callback;

      TestHelpers.mockTimebankUsers();
      TestHelpers.mockSlackUsers();
      TestHelpers.mockForecastData();
      TestHelpers.mockTimebankTimeEntries();
      TestHelpers.mockSlackPostMessage();

      const res: any = await sendDailyMessage(event, context, callback);
      const messageData = JSON.parse(res.body);

      expect(messageData.data.length).toBe(2);
    });
  });

  describe("handler is mocked for error handling", () => {
    it("should return expected error handling for slack API get user endpoint", async () => {
      let event;
      let context;
      let callback;

      TestHelpers.mockTimebankUsers();
      TestHelpers.mockSlackUsersCustom(slackUserDataError);
      TestHelpers.mockForecastData();
      TestHelpers.mockTimebankTimeEntries();
      TestHelpers.mockSlackPostMessage();

      const res: any = await sendDailyMessage(event, context, callback);
      const messageData = JSON.parse(res.body);

      expect(res).toBeDefined();
      expect(messageData.message).toMatch("Error while sending slack message:");
      expect(messageData.message).toMatch(slackUserDataError.error);
    });

    it("should return expected error handling for slack API postmessage endpoint", async () => {
      let event;
      let context;
      let callback;

      TestHelpers.mockTimebankUsers();
      TestHelpers.mockSlackUsers();
      TestHelpers.mockForecastData();
      TestHelpers.mockTimebankTimeEntries();
      TestHelpers.mockSlackPostMessageError();

      const res: any = await sendDailyMessage(event, context, callback);
      const messageData = JSON.parse(res.body);

      expect(res).toBeDefined();
      expect(messageData.message).toMatch("Error while sending slack message:");
      expect(messageData.message).toMatch(slackPostMessageError.error);
    });
  });

  describe("special character test", () => {
    it("should return expected data",async () => {
      let event;
      let context;
      let callback;

      TestHelpers.mockTimebankUsersCustom(timebankSpecialCharsMock);
      TestHelpers.mockSlackUsersCustom(slackSpecialCharsMock);
      TestHelpers.mockForecastData();
      TestHelpers.mockTimebankTimeEntriesCustom(timeEntrySpecialCharsMock);
      TestHelpers.mockSlackPostMessage();

      const res: any = await sendDailyMessage(event, context, callback);
      const messageData = JSON.parse(res.body);

      expect(res).toBeDefined();
      expect(messageData.data[0].name).toBe("Ñöä!£ Çøæé");
    });
  });
});