import { UsersListResponse } from "@slack/web-api/dist/response/UsersListResponse";

export const slackUserData: UsersListResponse =
  {
    ok: true,
    members: [
      { id: "123", real_name: "tester test" },
      { id: "4040", real_name: "Meta T" },
      { id: "124", real_name: "on vacation" }
    ]
  };

export const slackUserDataError = {
  ok: false,
  error: "invalid_cursor"
};

export const slackPostMessageMock = {
  ok: true
};

export const slackSpecialCharsMock: UsersListResponse ={
  ok: true,
  members: [
    { id: "123", real_name: "Ñöä!£ Çøæé" }
  ]
};

export const slackPostMessageError = {
  ok: false,
  error: "too_many_attachments"
};