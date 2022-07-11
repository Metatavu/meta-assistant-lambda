import { sendWeeklyMessageHandler } from "../functions/sendWeeklyMessage/handler";
import TestHelpers from "./utilities/test-utils";
import { slackPostMessageMock, slackUserData } from "./__mocks__/slackMocks";
import { WeeklyHandlerResponse } from "../libs/api-gateway";
import { timebankGetUsersMock, timeTotalsMock1, timeTotalsMock2, timeTotalsMock3 } from "./__mocks__/timebankMocks";
import { forecastMockNonProjectTime, mockForecastTimeRegistrations } from "./__mocks__/forecastMocks";

jest.mock("node-fetch");

describe("mock the weekly handler", () => {
  it("should return all expected message data", async () => {
    TestHelpers.mockTimebankPersons(200, timebankGetUsersMock);
    TestHelpers.mockTimebankPersonTotalTimes(200, [timeTotalsMock1, timeTotalsMock2, timeTotalsMock3]);
    TestHelpers.mockForecastResponse(200, [mockForecastTimeRegistrations, forecastMockNonProjectTime], true);
    TestHelpers.mockSlackUsers(slackUserData);
    TestHelpers.mockSlackPostMessage(slackPostMessageMock);

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
    TestHelpers.mockTimebankPersons(200, timebankGetUsersMock);
    TestHelpers.mockTimebankPersonTotalTimes(200, [timeTotalsMock1, timeTotalsMock2, timeTotalsMock3]);
    TestHelpers.mockForecastResponse(200, [mockForecastTimeRegistrations, forecastMockNonProjectTime], true);
    TestHelpers.mockSlackUsers(slackUserData);
    TestHelpers.mockSlackPostMessage(slackPostMessageMock);

    const messageData: WeeklyHandlerResponse = await sendWeeklyMessageHandler();

    expect(messageData.data.length).toBe(2);
  });
});