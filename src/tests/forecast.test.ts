import fetch from "node-fetch";
import ForecastApiUtilities from "../features/forecastapi/forecast-api";
import TestHelpers from "./utilities/test-utils";
import { forecastMockNonProjectTime, emptyTimeRegistrationsArray, mockForecastTimeRegistrations, emptyNonProjecTimeArray } from "./__mocks__/forecastMocks";

const mockedFetch = {
  fetch: fetch
};

jest.mock("node-fetch");
const { Response } = jest.requireActual("node-fetch");

describe("forecast api tests", () => {
  describe("forecast getNonProjectTimes", () => {
    const mockNonProjectTime = forecastMockNonProjectTime;

    it("should return mocked data", async () => {
      TestHelpers.mockForecastResponse(200, [mockNonProjectTime], false);

      const results = await ForecastApiUtilities.getNonProjectTime();

      expect(results[0].id).toBe(123);
      expect(results[0].name).toBe("vacation");

      expect(results[1].id).toBe(456);
      expect(results[1].name).toBe("something");

      expect(results.length).toBe(2);
    });

    it("should throw error if no non project times", async () => {
      const mockEmptyNonProjectTimeArray = emptyNonProjecTimeArray;
      jest.spyOn(mockedFetch, "fetch").mockReturnValueOnce(new Response(JSON.stringify(mockEmptyNonProjectTimeArray)));

      const expectedError = new Error("Error while loading non project time, undefined");

      try{
        const result = await ForecastApiUtilities.getNonProjectTime();
      }catch(error){
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe("forecast api get time registrations", () => {
    it("should return mock data", async () => {
      const dayBeforeYesterday = "2020-04-19";

      jest.spyOn(mockedFetch, "fetch").mockReturnValueOnce(new Response(JSON.stringify(mockForecastTimeRegistrations)));

      const results = await ForecastApiUtilities.getTimeRegistrations(dayBeforeYesterday);
      expect(results[0].person).toBe(1);
      expect(results[0].non_project_time).toBe(228255);
      expect(results[0].time_registered).toBe(435);

      expect(results[1].time_registered).toBe(433);
      expect(results[1].non_project_time).toBe(280335);

      expect(results[2].person).toBe(4);
      expect(results[2].non_project_time).toBe(123);
      expect(results[2].time_registered).toBe(433);

      expect(results.length).toBe(5);
    });

    it("should throw error if no time registrations", async () => {
      const dayBeforeYesterday = "2020-04-30";

      jest.spyOn(mockedFetch, "fetch").mockReturnValueOnce(new Response(JSON.stringify(emptyTimeRegistrationsArray)));
      const expectedError = new Error("Error while loading time registrations");

      try {
        const result = await ForecastApiUtilities.getTimeRegistrations(dayBeforeYesterday);
      } catch(error) {
        expect(error).toEqual(expectedError);
      }
    });

    it("should throw error if missing date", async () => {
      const dayBeforeYesterday = null;

      jest.spyOn(mockedFetch, "fetch").mockReturnValueOnce(new Response(JSON.stringify(mockForecastTimeRegistrations)));

      expect( async () => {
        await ForecastApiUtilities.getTimeRegistrations(dayBeforeYesterday);
      }).rejects.toThrow(TypeError);
    });
  });
});