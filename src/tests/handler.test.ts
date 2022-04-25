import { sendDailyMessage } from "../functions/sendDailyMessage/handler";
import fetch from "node-fetch";
import { IncomingMessage } from "http";
import { Socket } from "net";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import slackApiUtilities from "../features/slackapi/slackapi-utils";
import { WebClient } from "@slack/web-api";
import { TimebankApi } from "src/generated/client/api";
import { timebankGetUsersMock, timeEntryMock1, timeEntryMock2 } from "./__mocks__/timebankMocks";
import { slackUserData } from "./__mocks__/slackMocks";
import { forecastMockNonProjectTime, forecastMockTimeRegistrations } from "./__mocks__/forecastMocks";

jest.mock("node-fetch");
const { Response } = jest.requireActual("node-fetch");

describe("mock the handler", () => {
  it("should expected name", async () => {
    let event;
    let context;
    let callback;

    const timebankClient = TimeBankApiProvider.client;
    const message: IncomingMessage = new IncomingMessage(new Socket);

    const slackUsersClient = slackApiUtilities.client;

    /**
     * Get timebank Users mock data
     */
    const mockTimebankUsers = (timebankClient: TimebankApi, message: IncomingMessage) => {
      jest.spyOn(timebankClient, "timebankControllerGetPersons").mockReturnValueOnce(Promise.resolve({ response: message, body: timebankGetUsersMock }));
    };
    mockTimebankUsers(timebankClient, message);

    /**
    * Get Slack users mock data
    */
    const MockSlackUsers = (slackUsersClient: WebClient) => {
      jest.spyOn(slackUsersClient.users, "list").mockReturnValueOnce(Promise.resolve(slackUserData));
    };
    MockSlackUsers(slackUsersClient);

    /**
     * Mock Forecast non project time & time registrations endpoints
     */
    const mockForecastData = () => {
      const mockedFetch = {
        fetch: fetch
      };

      jest.spyOn(mockedFetch, "fetch")
        .mockReturnValue(new Response(JSON.stringify(forecastMockTimeRegistrations)))
        .mockReturnValueOnce(new Response(JSON.stringify(forecastMockNonProjectTime)));
    };
    mockForecastData();

    /**
     * Timebank time entries mock
     */
    const mockTimebankTimeEntries = (timebankClient: TimebankApi, message: IncomingMessage) => {
      // Each user needs to be mocked one after the other in this way as each user is a seperate API call
      jest.spyOn(timebankClient, "timebankControllerGetEntries")
        .mockReturnValueOnce(Promise.resolve({ response: message, body: timeEntryMock1 }))
        .mockReturnValueOnce(Promise.resolve({ response: message, body: timeEntryMock2 }));
    };
    mockTimebankTimeEntries(timebankClient, message);

    let messageData;

    try{
      const res: any = await sendDailyMessage(event, context, callback);
      console.log("handler try", res);
      messageData = JSON.parse(res.body);

      // NOTE- duplicated expects as jest assertion failure moves into catch- need to correct...
      expect(messageData.data[0].name).toEqual("tester test");
      expect(messageData.data[1].name).toEqual("Meta T");
    } catch (e) {
      console.log("handler Catch", e);
      expect(messageData.data[0].name).toEqual("tester test");
      expect(messageData.data[1].name).toEqual("Meta T");
    }
  });
});