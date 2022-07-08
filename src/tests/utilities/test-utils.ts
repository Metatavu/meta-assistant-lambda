import { IncomingMessage } from "http";
import { Socket } from "net";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import slackApiUtilities from "src/features/slackapi/slackapi-utils";
import { timebankGetUsersMock, dailyEntryMock1, dailyEntryMock2, dailyEntryMock3, timeTotalsMock1, timeTotalsMock2, timeTotalsMock3 } from "../__mocks__/timebankMocks";
import { slackUserData, slackPostMessageMock, slackPostMessageError } from "../__mocks__/slackMocks";
import fetch, { FetchError } from "node-fetch";
import { forecastMockNonProjectTime, mockForecastTimeRegistrations } from "../__mocks__/forecastMocks";
import { DailyMessageData, DailyMessageResult, WeeklyMessageData, WeeklyMessageResult } from "src/functions/schema";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import * as KeycloakMock from "keycloak-mock";

/**
 * Helper functions for testing suites.
 */
namespace TestHelpers {
  const personsClient = TimeBankApiProvider.personsClient;
  const dailyEntriesClient = TimeBankApiProvider.dailyEntriesClient;
  const slackUsersClient = slackApiUtilities.client;

  const { Response } = jest.requireActual("node-fetch");

  const mockedFetch = {
    fetch: fetch
  };

  const createIncomingMessage = (status: number, body: any): any => {
      let message = new IncomingMessage(new Socket);
      message.statusCode = status;

      return {
        response: message,
        body: body
      }
  }

  const createResponse = (status: number, body: any): any => {
    return new Response(JSON.stringify(body), { status: status })
  }

  const createError = (status: number, errorMessage: string): any => {
    let message = {
      status: status,
      message: errorMessage
    };

    return Promise.reject((message))
  }

  const mockKeycloak = async (): Promise<KeycloakMock.MockInstance> => {
    const keycloak = await KeycloakMock.createMockInstance({
        authServerURL: "http://localhost:8080",
        realm: "quarkus",
        clientID: "meta-assistant",
        clientSecret: "zoxruqJ6bBYptkJwewhu9bqmkgwxatzS"
    });
    const mock = KeycloakMock.activateMock(keycloak)
    const user = keycloak.database.createUser({
      firstName: "test",
      email: "test@test.test",
      credentials: [{
        value: "password"
      }]
    });
    KeycloakMock.deactivateMock(mock);

    return keycloak
  }

  export const mockAccessToken = async (): Promise<any> => {
    const keycloak = await mockKeycloak();
    const user = keycloak.database.allUsers();

    return new Response(JSON.stringify({access_token: keycloak.createBearerToken(user[0].profile.id)}))
  }

  /**
   * Configures mock listDailyEntries response
   * 
   * @param statusCode API response statusCode
   * @param body API response body
   */
  export const mockTimebankDailyEntries = (statusCode: number, body: any) => {
    const dailyEntriesSpy = jest.spyOn(dailyEntriesClient, "listDailyEntries");
      for (let i = 0; i < body.length; i++) {
        dailyEntriesSpy.mockReturnValueOnce(createIncomingMessage(statusCode, body[i]));
      }
  }

  /**
   * Configures mock listPersons response
   * 
   * @param statusCode API response statusCode
   * @param body API response body
   */
  export const mockTimebankPersons = (statusCode: number, body: any) => {
    jest.spyOn(personsClient, "listPersons")
      .mockReturnValueOnce(createIncomingMessage(statusCode, body))
  }

  /**
   * Configures mock listPersonTotalTime response
   * 
   * @param statusCode API response statusCode
   * @param body API response body
   */
  export const mockTimebankPersonTotalTimes = (statusCode: number, body: any) => {
    const personTotalTimesSpy = jest.spyOn(personsClient, "listPersonTotalTime");
    for (let i = 0; i < body.length; i++) {
      personTotalTimesSpy.mockReturnValueOnce(createIncomingMessage(statusCode, body[i]));
    }
  }

  /**
   * Configures mock fetch to Forecast API to return given data.
   * Has to always return KeycloakMock access token first during handler tests.
   * 
   * @param statusCode API response statusCode
   * @param body API response body
   */
  export const mockForecastResponse = (statusCode: number, body: any, keycloakMock: boolean) => {
    const fetchSpy = jest.spyOn(mockedFetch, "fetch");
    if (keycloakMock) {
      fetchSpy.mockReturnValueOnce(mockAccessToken());
    }
    if (statusCode !== 200) {
      fetchSpy.mockReturnValueOnce(createError(statusCode, body.message));
    }
    for (let i = 0; i < body.length; i++) {
      fetchSpy.mockReturnValueOnce(createResponse(statusCode, body[i]));
    }
  }

////////////////////
  /**
   * Get timebank Users mock data
   */
  export const mockTimebankUsers = () => {
    jest.spyOn(personsClient, "listPersons")
      .mockReturnValueOnce(createIncomingMessage(200, timebankGetUsersMock));
  };

  /**
   * Get timebank Users mock custom data
   * 
   * @param mockData custom timebank Users data
   */
  export const mockTimebankUsersCustom = (statusCode: number, mockData: any) => {
    jest.spyOn(personsClient, "listPersons")
      .mockReturnValueOnce(createIncomingMessage(statusCode, mockData));
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
    jest.spyOn(mockedFetch, "fetch")
      .mockReturnValueOnce(mockAccessToken())
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
    jest.spyOn(mockedFetch, "fetch")
      .mockReturnValueOnce(mockAccessToken())
      .mockReturnValueOnce(new Response(JSON.stringify(firstEndPointMock), firstResponseStatus))
      .mockResolvedValueOnce(new Response(JSON.stringify(secondEndPointMock), secondResponseStatus));
  };

  /**
   * Timebank time entries mock
   */
  export const mockTimebankTimeEntries = () => {
    // Each user needs to be mocked one after the other in this way as each user is a seperate API call
    jest.spyOn(dailyEntriesClient, "listDailyEntries")
      .mockReturnValueOnce(createIncomingMessage(200, dailyEntryMock1))
      .mockReturnValueOnce(createIncomingMessage(200, dailyEntryMock2))
      .mockReturnValueOnce(createIncomingMessage(200, dailyEntryMock3));
  };


  /**
   * Timebank custom time entries mock
   * 
   * @param mockData custom time entry data
   */
  export const mockTimebankTimeEntriesCustom = (mockData: any[]) => {  
    jest.spyOn(dailyEntriesClient, "listDailyEntries")
      .mockReturnValueOnce(createIncomingMessage(404, mockData[0]));
  };

  /**
   * Timebank total time entries mock
   */
  export const mockTotalTimeEntries = () => {
    jest.spyOn(personsClient, "listPersonTotalTime")
      .mockReturnValueOnce(createIncomingMessage(200, timeTotalsMock1))
      .mockReturnValueOnce(createIncomingMessage(200, timeTotalsMock2))
      .mockReturnValueOnce(createIncomingMessage(200, timeTotalsMock3));
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
    jest.spyOn(slackUsersClient.chat, "postMessage")
      .mockImplementation(() => Promise.resolve(slackPostMessageError));
  };

  /**
   * Timebank total custom time entries mock
   * 
   * @param mockData custom total time entries data
   */
  export const mockTotalTimeEntriesCustom = (mockData: any) => {
    jest.spyOn(personsClient, "listPersonTotalTime")
      .mockReturnValueOnce(createIncomingMessage(404, mockData[0]));
  };

  /**
   * 
   * @param data user's data 
   * @param slackUsers slack users 
   */
  export const validateDailyMessage = (data: DailyMessageResult, slackUsers: Member[]) => {
    const {
      message,
      name,
      displayDate,
      billableHoursPercentage,
      displayExpected,
      displayInternal,
      displayLogged,
      displayProject
    } = data.message;

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
  export const validateWeeklyMessage = (data: WeeklyMessageResult, slackUsers: Member[]) => {
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
    } = data.message;

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