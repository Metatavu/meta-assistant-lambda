import { sendSprintEmailHandler } from "src/functions/send-sprint-email/handler";
import TestHelpers from "./utilities/test-utils";
import { forecastMockNonProjectTimes, forecastMockTimeRegistrations } from "./__mocks__/forecastMocks";
import { personsMock1, personTotalTimeMock5, personTotalTimeMock6, personTotalTimeErrorMock } from "./__mocks__/timebankMocks";

jest.mock("node-fetch");

beforeEach(() => {
    jest.resetAllMocks();
});

describe("testing", () => {
    it("testing testing", async () => {
        TestHelpers.mockTimebankPersons(200, personsMock1);
        TestHelpers.mockTimebankPersonTotalTimes(200, [personTotalTimeMock6, personTotalTimeMock5]);
        TestHelpers.mockTimebankPersonTotalTimes(personTotalTimeErrorMock.status, personTotalTimeErrorMock.message);
        TestHelpers.mockTimebankPersonTotalTimes(personTotalTimeErrorMock.status, personTotalTimeErrorMock.message);
        TestHelpers.mockTimebankPersonTotalTimes(personTotalTimeErrorMock.status, personTotalTimeErrorMock.message);
        TestHelpers.mockForecastResponse(200, [forecastMockTimeRegistrations, forecastMockNonProjectTimes], true);
        const emails = await sendSprintEmailHandler();

        expect(emails.data[0]).toContain("Successfully sent emails to: ");
        expect(emails.data[0]).toContain("@metatavu.fi");
    });
});