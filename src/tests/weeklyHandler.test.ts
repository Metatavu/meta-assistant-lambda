import { sendWeeklyMessage } from "../functions/sendWeeklyMessage/handler";
import TestHelpers from "./utilities/test-utils";
import { slackUserDataError, slackUserData, slackPostMessageError } from "./__mocks__/slackMocks";

jest.mock("node-fetch");

let event;
let context;
let callback;

describe("mock the weekly handler", () => {
  it("should return all expected message data", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();
    TestHelpers.mockSlackPostMessage();

    const res: any = await sendWeeklyMessage(event, context, callback);
    const messageData = JSON.parse(res.body);
    const statusCode = JSON.parse(res.statusCode);

    expect(res).toBeDefined();
    expect(messageData).toBeDefined();
    expect(messageData.data[0].message).toBeDefined();
    expect(typeof messageData.data[0].message).toEqual(typeof "string");
    expect(messageData.data[0].name).toBeDefined();
    expect(messageData.data[0].week).toBeDefined();
    expect(messageData.data[0].startDate).toBeDefined();
    expect(messageData.data[0].endDate).toBeDefined();
    expect(messageData.data[0].displayLogged).toBeDefined();
    expect(messageData.data[0].displayExpected).toBeDefined();
    expect(messageData.data[0].displayProject).toBeDefined();
    expect(messageData.data[0].displayInternal).toBeDefined();
    expect(messageData.data[0].billableHoursPercentage).toBeDefined();
    expect(messageData.data[0].name).toEqual(slackUserData.members[0].real_name);
    expect(messageData.data[1].message).toBeDefined();
    expect(typeof messageData.data[1].message).toEqual(typeof "string");
    expect(messageData.data[1].name).toBeDefined();
    expect(messageData.data[1].week).toBeDefined();
    expect(messageData.data[1].startDate).toBeDefined();
    expect(messageData.data[1].endDate).toBeDefined();
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

describe("Weekly vacation time test", () => {
  it("Should not return user who is on vacation", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();
    TestHelpers.mockSlackPostMessage();

    const res: any = await sendWeeklyMessage(event, context, callback);
    const messageData = JSON.parse(res.body);

    expect(messageData.data.length).toBe(2);
  });
});

describe("handler is mocked for error handling", () => {
  it("should return expected error handling for slack API get user endpoint", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsersCustom(slackUserDataError);
    TestHelpers.mockForecastData();
    TestHelpers.mockTotalTimeEntries();
    TestHelpers.mockSlackPostMessage();

    const res: any = await sendWeeklyMessage(event, context, callback);
    const messageData = JSON.parse(res.body);

    expect(res).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message:");
    expect(messageData.message).toMatch(slackUserDataError.error);
  });

  it("should return expected error handling for slack API postmessage endpoint", async () => {
    TestHelpers.mockTimebankUsers();
    TestHelpers.mockSlackUsers();
    TestHelpers.mockForecastData();
    TestHelpers.mockTimebankTimeEntries();
    TestHelpers.mockSlackPostMessageError();

    const res: any = await sendWeeklyMessage(event, context, callback);
    const messageData = JSON.parse(res.body);

    expect(res).toBeDefined();
    expect(messageData.message).toMatch("Error while sending slack message:");
    expect(messageData.message).toMatch(slackPostMessageError.error);
  });
});