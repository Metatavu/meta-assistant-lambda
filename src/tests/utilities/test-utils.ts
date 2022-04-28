import { IncomingMessage } from "http";
import { Socket } from "net";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import slackApiUtilities from "src/features/slackapi/slackapi-utils";
import { timebankGetUsersMock, timeEntryMock1, timeEntryMock2, timeEntryMock3, timeTotalsMock1, timeTotalsMock2, timeTotalsMock3 } from "../__mocks__/timebankMocks";
import { slackUserData } from "../__mocks__/slackMocks";
import fetch from "node-fetch";
import { forecastMockNonProjectTime, mockForecastTimeRegistrations } from "../__mocks__/forecastMocks";

namespace TestHelpers {
  const timebankClient = TimeBankApiProvider.client;
  const message: IncomingMessage = new IncomingMessage(new Socket);

  const slackUsersClient = slackApiUtilities.client;

  const { Response } = jest.requireActual("node-fetch");

  /**
   * Get timebank Users mock data
   */
  export const mockTimebankUsers = () => {
    jest.spyOn(timebankClient, "timebankControllerGetPersons").mockReturnValueOnce(Promise.resolve({ response: message, body: timebankGetUsersMock }));
  };

  /**
    * Get Slack users mock data
    */
  export const mockSlackUsers = () => {
    jest.spyOn(slackUsersClient.users, "list").mockReturnValueOnce(Promise.resolve(slackUserData));
  };

  /**
   * Mock Forecast non project time & time registrations endpoints
   */
  export const mockForecastData = () => {
    const mockedFetch = {
      fetch: fetch
    };

    jest.spyOn(mockedFetch, "fetch")
      .mockReturnValue(new Response(JSON.stringify(forecastMockNonProjectTime)))
      .mockReturnValueOnce(new Response(JSON.stringify(mockForecastTimeRegistrations)));
  };

  /**
   * Timebank time entries mock
   */
  export const mockTimebankTimeEntries = () => {
    // Each user needs to be mocked one after the other in this way as each user is a seperate API call
    jest.spyOn(timebankClient, "timebankControllerGetEntries")
      .mockReturnValueOnce(Promise.resolve({ response: message, body: timeEntryMock1 }))
      .mockReturnValueOnce(Promise.resolve({ response: message, body: timeEntryMock2 }))
      .mockReturnValueOnce(Promise.resolve({ response: message, body: timeEntryMock3 }));
  };

  /**
   * Timebank total time entries mock
   */
  export const mockTotalTimeEntries = () => {
    jest.spyOn(timebankClient, "timebankControllerGetTotal")
      .mockReturnValueOnce(Promise.resolve({ response: message, body: timeTotalsMock1 }))
      .mockReturnValueOnce(Promise.resolve({ response: message, body: timeTotalsMock2 }))
      .mockReturnValueOnce(Promise.resolve({ response: message, body: timeTotalsMock3 }));
  };
}

export default TestHelpers;