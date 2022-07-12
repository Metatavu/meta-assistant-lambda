import { sendSprintEmailHandler } from "src/functions/sendSprintEmail/handler";
import TestHelpers from "./utilities/test-utils";
import { forecastMockNonProjectTimes, forecastMockTimeRegistrations } from "./__mocks__/forecastMocks";
import { personMock1, personTotalTimeMock5, personTotalTimeMock6 } from "./__mocks__/timebankMocks";

jest.mock("node-fetch");

const consoleSpy = jest.spyOn(console, "error");

beforeEach(() => {
    jest.resetAllMocks();
});

describe("testing", () => {
    it("testing testing", async () => {
        TestHelpers.mockTimebankPersons(200, [personMock1]);
        TestHelpers.mockTimebankPersonTotalTimes(200, [personTotalTimeMock5, personTotalTimeMock6])
        TestHelpers.mockForecastResponse(200, [forecastMockTimeRegistrations, forecastMockNonProjectTimes], true);
        
        const emails = await sendSprintEmailHandler();

        expect(emails.data).toContain("Successfully sent emails to: ");
        expect(emails.data).toContain("@metatavu.fi");
    });
});