import { sendWeeklyMessageHandler } from "../functions/sendWeeklyMessage/handler";
import TestHelpers from "./utilities/test-utils";
import { slackUserDataError, slackUserData, slackPostMessageError } from "./__mocks__/slackMocks";
import { WeeklyHandlerResponse } from "../libs/api-gateway";

jest.mock("node-fetch");

describe("mock the weekly handler", () => {
  it("should return all expected message data", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();
    TestHelpers.mockSlackPostMessage();

    const messageBody: WeeklyHandlerResponse = await sendWeeklyMessageHandler();
    const messageData = messageBody.data;

    const spy = jest.spyOn(TestHelpers, "validateWeeklyMessage");

    messageData.forEach(messageData => {
      TestHelpers.validateWeeklyMessage(messageData, slackUserData.members);
    });

    expect(spy).toHaveBeenCalledTimes(2);
  });
});

describe("Weekly vacation time test", () => {
  it("Should not return user who is on vacation", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();
    TestHelpers.mockSlackPostMessage();

    const messageData: WeeklyHandlerResponse = await sendWeeklyMessageHandler();

    expect(messageData.data.length).toBe(2);
  });
});

// @todo find out why when tests below are moved don't work
describe("handler is mocked for error handling", () => {
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
    TestHelpers.mockTimebankTimeEntries();
    TestHelpers.mockSlackPostMessageError();

    const res: WeeklyHandlerResponse = await sendWeeklyMessageHandler();

    expect(res).toBeDefined();
    expect(res.message).toMatch("Error while sending slack message:");
    expect(res.message).toMatch(slackPostMessageError.error);
  });
});