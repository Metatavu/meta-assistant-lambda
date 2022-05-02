// import { IncomingMessage } from "http";
// import { DateTime } from "luxon";
// import { Socket } from "net";
// import TimeBankApiProvider from "../features/timebank/timebank-API-provider";
// import { PersonDto } from "../../src/generated/client/api";
// import TimeUtilities from "../features/generic/time-utils";
// import slackApiUtilities from "../features/slackapi/slackapi-utils";
// import { UsersListResponse } from "@slack/web-api";
// import fetch from "node-fetch";
// import ForecastApiUtilities from "../features/forecastapi/forecast-api";

// // Would be good to have mocks seperate and import them all so can reset here as required?
// // Need to reset the tests for each API mock

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// describe("first tests", () => {
//   it("should return object", () => {
//     const result = TimeUtilities.getPreviousTwoWorkdays();
//     expect(result.today).toBe(DateTime.now().toISODate());
//   });
// });

// describe("truth", () => {
//   it("true to be true", () => {
//     expect(true).toBeTruthy();
//   });
// });

// const array: PersonDto[] = [{
//   id: 13,
//   firstName:"tester",
//   lastName: "test",
//   email: "test",
//   userType: "test",
//   clientId: 123,
//   holidayCalendarId: 123,
//   monday: 123,
//   tuesday: 123,
//   wednesday: 123,
//   thursday: 123,
//   friday: 123,
//   saturday: 123,
//   sunday: 123,
//   active: true,
//   defaultRole: 123,
//   cost: 123,
//   language: "test",
//   createdBy: 123,
//   updatedBy: 123,
//   createdAt: new Date,
//   updatedAt: new Date,
//   startDate: "test"
// }];

// const message: IncomingMessage = new IncomingMessage(new Socket);
// let timebankClient = TimeBankApiProvider.client;

// describe("Timebank API testing", () => {
//   it("mock modules or custom functions", async () => {
//     // This works with the imported file
//     // Problem is the client secret needs to be hardcoded- nope its fine
//     jest.spyOn(timebankClient, "timebankControllerGetPersons").mockReturnValueOnce(Promise.resolve({ response: message, body: array }));
//     // const mockGetTBUsers = TimeBankApiProvider.getTimebankUsers as jest.MockedFunction<typeof TimeBankApiProvider.getTimebankUsers>;
//     const results = await TimeBankApiProvider.getTimebankUsers();
//     // const results = await mockGetTBUsers();
//     expect(results[0].id).toBe(13);

//     // Want to mock only the API within the function, works if function is in this file only
//     // jest.spyOn(timebankClient, "timebankControllerGetPersons").mockReturnValueOnce(Promise.resolve({ response: message, body: array }));
//     // // slackClient.timebankControllerGetPersons().mockResolvedValue(Promise.resolve({ response: message, body: array }));
//     // const results = await TimeBankApiProvider.getTimebankUsers();
//     // expect(results[0].id).toBe(13);

//     // This mocks the whole function, with the above mocked data
//     // jest.spyOn(TimeBankApiProvider, "getTimebankUsers").mockReturnValueOnce(Promise.resolve( array ));
//     // const results = await TimeBankApiProvider.getTimebankUsers();
//     // expect(results[0].id).toBe(13);
//   });
// });

// const slackUsersClient = slackApiUtilities.client.users;

// describe("slack API testing", () => {
//   let slackUserData: UsersListResponse =
//   {
//     ok: true,
//     members: [{ id: "123" }]
//   };
//   it("mock modules or custom functions", async () => {
//     jest.spyOn(slackUsersClient, "list").mockReturnValueOnce(Promise.resolve(slackUserData));
//     const results = await slackApiUtilities.getSlackUsers();

//     // expect(results[0].ok).toBeTruthy;- NOT RETURNED FROM THE FUNCTION
//     expect(results[0].id).toBe("123");
//     expect(results).not.toBeNull();
//     expect(results).not.toBeUndefined();
//     expect(results).toBeDefined();
//     expect(results).not.toBeFalsy();
//     expect(results).toBeTruthy();
//     expect(results).toEqual(slackUserData.members);
//   });
// });

// // // For Errors to be passed back I needed to change the tested function to return the promise.reject
// describe("slack API testing", () => {
//   describe("Various syntax for testing error from API", () => {
//     it("as .catch syntax", async () => {
//       // Note mockImplementationsOnce needed for passing error
//       jest.spyOn(slackUsersClient, "list").mockImplementationOnce(() => {
//         throw new Error("test");
//       });
//       return await slackApiUtilities.getSlackUsers().catch(e => {
//         console.log(".catch 1");
//         expect(e).toEqual(new Error("test"));
//       });
//     });

//     it("as try catch block", async () => {
//       jest.spyOn(slackUsersClient, "list").mockImplementationOnce(() => {
//         throw new Error("test2");
//       });
//       try {
//         await slackApiUtilities.getSlackUsers();
//         // This should not (and does not) print
//         console.log("try 2");
//       } catch (e) {
//         expect(e).toEqual(new Error("test2"));
//         console.log("catch 2");
//       }
//     });

//     it("as jest.fn not spyOn", async () => {
//       slackUsersClient.list = jest.fn().mockImplementation(() => {
//         throw new Error("test3");
//       });
//       try {
//         await slackApiUtilities.getSlackUsers();
//         // This should not (and does not) print
//         console.log("try 3");
//       } catch (e) {
//         expect(e).toEqual(new Error("test3"));
//         console.log("catch 3");
//       }
//     });

//     // For this to run I had to set up a throw in the function in order to handle the event of the API not returning what we want
//     it("passing API error not new Error", async () => {
//       // This is an example error from the slack API docs
//       let slackUserData = {
//         ok: false,
//         error: "invalid_cursor"
//       };
//       // Note for passing mock data (not Error) back to mockReturnValue/Once mothod
//       const spyFn = jest.spyOn(slackUsersClient, "list").mockReturnValue(Promise.resolve(slackUserData));
//       // Assertions are how many expects are SUCCESSFULLY run.
//       expect.assertions(9);
//       expect.hasAssertions();
//       try {
//         const res = await slackApiUtilities.getSlackUsers();
//         // This should not (and does not) print
//         console.log("try 4", res);
//       } catch (e) {
//         expect(spyFn).toHaveBeenCalled();
//         // Reset by before each jest.clearAllMocks()
//         expect(spyFn).toHaveBeenCalledTimes(1);
//         // Function does not throw... Throws within but still returns?
//         // expect(async () => {
//         //   await slackApiUtilities.getSlackUsers();
//         // }).toThrow();
//         expect(async () => {
//           // NOTE: would need to remock if original spyFn mock was mockReturnValueONCE
//           // jest.spyOn(slackUsersClient, "list").mockReturnValue(Promise.resolve(slackUserData));
//           await slackApiUtilities.getSlackUsers();
//         }).rejects.toThrow();
//         expect(spyFn).toHaveBeenCalledTimes(2);
//         expect(async () => {
//           await slackApiUtilities.getSlackUsers();
//         }).rejects.toThrow("Error while loading slack users list, invalid_cursor");
//         expect(async () => {
//           await slackApiUtilities.getSlackUsers();
//         }).rejects.toEqual(new Error(`Error while loading slack users list, ${slackUserData.error}`));
//         expect(spyFn).toHaveBeenCalledTimes(4);
//         expect(spyFn).toBeTruthy();
//         expect(e).toEqual(new Error(`Error while loading slack users list, ${slackUserData.error}`));
//         console.log("catch 4");
//       }
//     });
//   });

// // Do i need to throw from the try blcok in function- yes if invalid data
// // How to get direct .toThrow passing ?
// //   // Try another error from slack docs
// //   // Try no member data
// //   // invalid member data
// // Watch video on how to test in functional  programming, where and what to test- ideally with jest
// // Look up metatavu git- are there any testing examples?
// });

// const mockedFetch = {
//   fetch: fetch
// };

// // // I don't understand the require actual, why can't it use the Response directly from the import if requireActual returns the original?
// jest.mock("node-fetch");
// const { Response } = jest.requireActual("node-fetch");

// describe("forecast API testing", () => {
//   describe("valid data", () => {
//     const forecastMockData = [
//       {
//         id : 123,
//         is_internal_time : false
//       },
//       {
//         id : 456,
//         is_internal_time : false
//       }
//     ];

//     it("should return mocked data", async () => {
//       // Is this double mocking the fetch? Is it better to use the option below in comment?
//       // jest.spyOn(mockedFetch, "fetch").mockResolvedValue(new Response(JSON.stringify(forecastMockData)));

//       // Also Works
//       (fetch as jest.MockedFunction<typeof fetch>).mockReturnValueOnce(new Response(JSON.stringify(forecastMockData)));

//       const results = await ForecastApiUtilities.getNonProjectTime();

//       expect(results[0].id).toBe(123);
//       expect(results[1].id).toBe(456);
//     });
//   });

//   describe("forecast getTimeReg", () => {
//     it("should work", async () => {
//       /**
//      * Forecast time registrations mock
//      */
//       const forecastMockTimeRegistrations = [
//         {
//           id: 123,
//           person: 123,
//           non_project_time: 345,
//           time_registered:456,
//           date: "22,22,22",
//           approval_status: "sure"
//         }
//       ];

//       jest.spyOn(mockedFetch, "fetch").mockReturnValueOnce(new Response(JSON.stringify(forecastMockTimeRegistrations)));
//       const results = await ForecastApiUtilities.getTimeRegistrations("2022-04-21");
//       console.log("here now", results);
//     });
//   });

//   describe("invalid data & error handling", () => {
//     const forecastMockData = {
//       "status": 401,
//       "message": "Server failed to authenticate the request."
//     };
//     it("should return mocked data", async () => {
//       const spyFn = jest.spyOn(mockedFetch, "fetch").mockReturnValue(new Response(JSON.stringify(forecastMockData)));
//       expect.assertions(6);
//       try {
//         await ForecastApiUtilities.getNonProjectTime();
//         console.log("try forecast 1");
//       } catch (e) {
//         expect(spyFn).toHaveBeenCalled();
//         expect(spyFn).toHaveBeenCalledTimes(1);
//         expect(async () => {
//         // This is providing a new Response otherwise the fetch has an error that the body (response) has already been used...
//           const spyFn = jest.spyOn(mockedFetch, "fetch").mockReturnValueOnce(new Response(JSON.stringify(forecastMockData)));
//           await ForecastApiUtilities.getNonProjectTime();
//         }).rejects.toThrow();
//         // expect(spyFn).toHaveBeenCalledTimes(2);
//         expect(async () => {
//         // This is providing a new Response otherwise the fetch has an error that the body (response) has already been used...
//           const spyFn = jest.spyOn(mockedFetch, "fetch").mockReturnValueOnce(new Response(JSON.stringify(forecastMockData)));
//           await ForecastApiUtilities.getNonProjectTime();
//         }).rejects.toThrow(new Error(`Error while loading non project time, ${forecastMockData.message}`));
//         expect(spyFn).toHaveBeenCalledTimes(3);
//         expect(e).toEqual(new Error(`Error while loading non project time, ${forecastMockData.message}`));
//         console.log("catch forecast 1");
//       }
//     });
//     it("throws an error from API", async () => {
//       const spyFn = jest.spyOn(mockedFetch, "fetch").mockImplementationOnce(() => {
//         throw new Error("fetch test 1");
//       });
//       try{
//         await ForecastApiUtilities.getNonProjectTime();
//       } catch (e) {
//         expect(e).toEqual(new Error("fetch test 1"));
//       }
//     });
//   });
// });