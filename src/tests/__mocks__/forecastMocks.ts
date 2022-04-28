// Forecast non project time endpoint mock
export const forecastMockNonProjectTime = [
  {
    id : 123,
    is_internal_time : false
  },
  {
    id : 4040,
    is_internal_time : false
  }
];

// Forecast time registrations endpoint mock
export const forecastMockTimeRegistrations = [
  {
    id: 123,
    person: 123,
    non_project_time: 345,
    time_registered:456,
    date: "22,22,22",
    approval_status: "sure"
  },
  {
    id: 4040,
    person: 1244,
    non_project_time: 600,
    time_registered:600,
    date: "22,22,22",
    approval_status: "sure"
  }
];

//Forecast error mock
export const forecastErrorMock = [
  {
    status: 401,
    message: "Server failed to authenticate the request."
  },
  {
    status: 401,
    message: "Server failed to authenticate the request."
  }
];