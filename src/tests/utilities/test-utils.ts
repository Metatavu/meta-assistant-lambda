import { IncomingMessage } from "http";
import { Socket } from "net";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import slackApiUtilities from "src/features/slackapi/slackapi-utils";
import { timebankGetUsersMock, timeEntryMock1, timeEntryMock2, timeEntryMock3, timeTotalsMock1, timeTotalsMock2, timeTotalsMock3 } from "../__mocks__/timebankMocks";
import { slackUserData, slackPostMessageMock, slackPostMessageError } from "../__mocks__/slackMocks";
import fetch from "node-fetch";
import { forecastMockNonProjectTime, mockForecastTimeRegistrations } from "../__mocks__/forecastMocks";
import { DailyMessageData, WeeklyMessageData } from "src/functions/schema";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";

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
      .mockReturnValueOnce(new Response(JSON.stringify(mockForecastTimeRegistrations)))
      .mockReturnValueOnce(new Response(JSON.stringify(forecastMockNonProjectTime)));
  };

  /**
   * Mock Forecast error response
   *
   * @param firstMock custom forecast data for the first endpoint
   * @param secondMock custom forecast data for the second endpoint
   * @param firstResponseStatus custom fetch response for status code check
   * @param secondResponseStatus custom fetch response for status code check
   */
  export const mockForecastDataCustom = (firstEndPointMock, secondEndPointMock, firstResponseStatus, secondResponseStatus) => {
    const mockedFetch = {
      fetch: fetch
    };

    jest.spyOn(mockedFetch, "fetch")
      .mockReturnValueOnce(new Response(JSON.stringify(firstEndPointMock), firstResponseStatus))
      .mockReturnValueOnce(new Response(JSON.stringify(secondEndPointMock), secondResponseStatus));
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

  /**
   * 
   * @param data user's data 
   * @param slackUsers slack users 
   */
  export const validateDailyMessage = (data: DailyMessageData, slackUsers: Member[]) => {
    const {
      message,
      name,
      displayDate,
      billableHoursPercentage,
      displayExpected,
      displayInternal,
      displayLogged,
      displayProject
    } = data;

    const slackNameMatches = slackUsers.find(user => user.real_name === name);

    expect(message).toBeDefined();
    expect(typeof message).toEqual(typeof "string");
    expect(name).toBeDefined();
    expect(displayDate).toBeDefined();
    expect(billableHoursPercentage).toBeDefined();
    expect(displayExpected).toBeDefined();
    expect(displayInternal).toBeDefined();
    expect(displayLogged).toBeDefined();
    expect(displayProject).toBeDefined();
    expect(slackNameMatches).toBeDefined();
  };

  /**
   * 
   * @param data user's data 
   * @param slackUsers slack users 
   */
  export const validateWeeklyMessage = (data: WeeklyMessageData, slackUsers: Member[]) => {
    const {
      message,
      name,
      endDate,
      startDate,
      week,
      billableHoursPercentage,
      displayExpected,
      displayInternal,
      displayLogged,
      displayProject
    } = data;

    const slackNameMatches = slackUsers.find(user => user.real_name === name);

    expect(message).toBeDefined();
    expect(typeof message).toEqual(typeof "string");
    expect(name).toBeDefined();
    expect(endDate).toBeDefined();
    expect(startDate).toBeDefined();
    expect(week).toBeDefined();
    expect(billableHoursPercentage).toBeDefined();
    expect(displayExpected).toBeDefined();
    expect(displayInternal).toBeDefined();
    expect(displayLogged).toBeDefined();
    expect(displayProject).toBeDefined();
    expect(slackNameMatches).toBeDefined();
  };
}

export default TestHelpers;