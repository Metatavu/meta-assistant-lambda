import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
require("dotenv").config({ path: __dirname + "/../../../../../.env" });
import { WebClient, LogLevel } from "@slack/web-api";
import moment from "moment";

import { PersonDto, TimeEntryTotalDto, UseTimebankData } from "./schema";
import timebankData from "./timebankdata";
import schema from "./schema";

/**
 * handler function for all Api calls/ message posts when AWS scheduled
 * 
 * @param event 
 * @returns JSON response
 */
const sendSlack: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const {
    personData,
    timeData,
  }: { personData: PersonDto[]; timeData: TimeEntryTotalDto[] } = await timebankData();

  const formatPersonData = personData.map((person) => {
    return { id: person.id, name: person.first_name + " " + person.last_name };
  });

  // Formatting of the timebankData
  const useTimebankData: UseTimebankData[] = timeData.map((person, i) => {
    return {
      ...formatPersonData[i],
      expected: person[0].expected,
      logged: person[0].logged,
      Pid: person[0].person,
      date: person[0].date.slice(0, 10),
    };
  });

  const client = new WebClient(process.env.metatavu_bot_token, {
    logLevel: LogLevel.DEBUG,
  });

  let usersStore = {};

  /**
   * Put Slack Users from getUsersList into usersStore
   * 
   * @param usersArray 
   */
  const saveUsers = (usersArray) => {
    let userId = "";
    usersArray.forEach(function (user) {
      userId = user["id"];
      usersStore[userId] = user;
    });
  }

  /**
   * Request list of Slack Users
   */
  const getUsersList = async() => {
    try {
      const result = await client.users.list();
      saveUsers(result.members);
    } catch (error) {
      console.error(error);
    }
  };
  await getUsersList();

  // Provides an array of the users and their ids
  const userData = Object.keys(usersStore).map((key) => {
    return {
      key: key,
      name: usersStore[key].real_name,
      id: usersStore[key].id,
    };
  });

  /**
   * Create message based on specific users timebank data
   * 
   * @param id 
   * @returns string message if id match
   */
  const customMessage = (id: number) => {
    let message: string = "";
    for (let each of useTimebankData) {
      if (each.id === id) {
        const durationLogged = moment.duration(each.logged, "minutes");
        const durationExpected = moment.duration(each.expected, "minutes");
        message = `Hi ${each.name}, yesterday (${moment(each.date).format("DD.MM.YYYY")}) you worked ${durationLogged.hours()}h ${durationLogged.minutes()} minutes
          with an expected time of ${durationExpected.hours()}h ${durationExpected.minutes()} minutes. Have a great rest of the day!\n`;
        return message;
      }
    }
    return "Something went wrong with your data today, please contact support";
  };

  /**
   * Post custom timebank data to matching slack user channel
   */
  const postMessage = async() => {
    await userData.forEach((slackUser) => {
      useTimebankData.forEach((timebankUser) => {
          if (slackUser.name === timebankUser.name) {
            try {
              client.chat.postMessage({
                channel: slackUser.id,
                text: customMessage(timebankUser.id)
              });
            }
            catch (error) {
              console.error(error);
            }
          }
      });
    });
  }
  postMessage();

  return formatJSONResponse({
    message: `Hello ${event.body.name} your message was sent, welcome to the exciting Serverless world!`,
    event,
  });
};

export const main = middyfy(sendSlack);