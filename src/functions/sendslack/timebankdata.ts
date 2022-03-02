const fetch = require('node-fetch');
import { PersonDto, TimeEntryTotalDto } from "./schema";

/**
 * 
 * @returns Working hours and Persons information
 */

const timebankData = async () => {

  /**
   * gets data from TimeBank API
   * 
   * @returns filtered persons data what we need.
   */

  const getData = async (): Promise<PersonDto[]> => {
    const Data = (await
      (await fetch('https://time-bank-api.metatavu.io/timebank/persons')
      ).json());
      // console.log(Data);
    return Data.filter(person => {
      if (person.default_role === null) {
        return;
      } else {
        return person;
      }
    })
  };


  /**
   * gets persons working hours from TimeBank API
   * 
   * @param id 
   * @returns yesterdays working hours
   */

  const getId = async (id: number): Promise<TimeEntryTotalDto[]> => {
    const timeStamp = new Date().getTime();
    const yesterdayTime = timeStamp - 24 * 60 * 60 * 1000;
    const yesterdayDate = new Date(yesterdayTime).toISOString().slice(0, 10);
    const response = (await
      (await fetch(`https://time-bank-api.metatavu.io/timebank/entries/${id}?after=${yesterdayDate}`)
      ).json());
    return response;
  };

  const personInfo = await getData();

  // console.log(personInfo);

  let timeData = getData()
    .then(res => {
      return res.map(person => {
        return getId(person.id);
      }
      )
    })

  /**
   * 
   * @param timeData 
   * @returns every persons working hours in wanted form
   */

  const getTimeData = async (timeData): Promise<TimeEntryTotalDto[]> => {

    const time = await timeData;

    let timeInfo = await Promise.all(time.map(person => {
      return person;
    }))

    return timeInfo;
  }

  const timeInfo = await getTimeData(timeData);

  return { timeData: timeInfo, personData: personInfo };

}

export default timebankData;