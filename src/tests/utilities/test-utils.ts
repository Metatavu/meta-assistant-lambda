import { IncomingMessage } from "http";
import { Socket } from "net";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import slackApiUtilities from "src/features/slackapi/slackapi-utils";
import { timebankGetUsersMock, timeEntryMock1, timeEntryMock2, timeEntryMock3, timeTotalsMock1, timeTotalsMock2, timeTotalsMock3 } from "../__mocks__/timebankMocks";
import { slackUserData, slackPostMessageMock, slackPostMessageError } from "../__mocks__/slackMocks";
import fetch from "node-fetch";
import { forecastMockNonProjectTime, mockForecastTimeRegistrations } from "../__mocks__/forecastMocks";

/**
 * Helper functions for testing suites.
 */
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
   * Get timebank Users mock custom data
   * 
   * @param mockData custom timebank Users data
   */
  export const mockTimebankUsersCustom = (mockData: any) => {
    jest.spyOn(timebankClient, "timebankControllerGetPersons").mockReturnValueOnce(Promise.resolve({ response: message, body: mockData }));
  };

  /**
    * Get Slack users mock data
    */
  export const mockSlackUsers = () => {
    jest.spyOn(slackUsersClient.users, "list").mockReturnValueOnce(Promise.resolve(slackUserData));
  };

  /**
   * Get Slack users mock data
   * 
   * @param mockData custom data
   */
  export const mockSlackUsersCustom = (mockData: any) => {
    jest.spyOn(slackUsersClient.users, "list").mockReturnValueOnce(Promise.resolve(mockData));
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
   * Mock Forecast error response
   * 
   * @param firstMock custom forecast data for the first endpoint
   * @param secondMock custom forecast data for the second endpoint
   */
  export const mockForecastDataCustom = (firstEndPointMock, secondEndPointMock) => {
    const mockedFetch = {
      fetch: fetch
    };

    jest.spyOn(mockedFetch, "fetch")
      .mockReturnValueOnce(new Response(JSON.stringify(firstEndPointMock)))
      .mockReturnValueOnce(new Response(JSON.stringify(secondEndPointMock)));
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
   * Timebank custom time entries mock
   * 
   * @param mockData custom time entry data
   */
  export const mockTimebankTimeEntriesCustom = (mockData: any[] ) => {
    jest.spyOn(timebankClient, "timebankControllerGetEntries")
      .mockReturnValueOnce(Promise.resolve({ response: message, body: mockData[0] }));
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

  /**
  * Slack post message mock data
  */
  export const mockSlackPostMessage = () => {
    jest.spyOn(slackUsersClient.chat, "postMessage").mockImplementation(() => Promise.resolve(slackPostMessageMock));
  };

  /**
  * Slack post message mock error
  */
  export const mockSlackPostMessageError = () => {
    jest.spyOn(slackUsersClient.chat, "postMessage").mockImplementation(() => Promise.resolve(slackPostMessageError));
  };

  /**
   * Timebank total custom time entries mock
   * 
   * @param mockData custom total time entries data
   */
  export const mockTotalTimeEntriesCustom = (mockData: any[]) => {
    jest.spyOn(timebankClient, "timebankControllerGetTotal")
      .mockReturnValueOnce(Promise.resolve({ response: message, body: mockData }));
  };
}

export default TestHelpers;