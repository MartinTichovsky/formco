import CheckIcon from "@mui/icons-material/Check";
import { ValidationPromiseResult } from "packages/formco/src/controller.types";
import React from "react";
import { validColor } from "./Register.styles";

const apiBaseUrl = "http://localhost:3000";
export const emailApiUrl = `${apiBaseUrl}/email`;
export const registerApiUrl = `${apiBaseUrl}/register`;
export const usernameApiUrl = `${apiBaseUrl}/username`;

const getFetchInit = (body: Record<string, string>, signal?: AbortSignal) => ({
  body: JSON.stringify(body),
  headers: {
    "content-type": "application/json"
  },
  method: "POST",
  signal
});

export const emailFetch = async (
  fetchController: React.MutableRefObject<AbortController | undefined>,
  email: string,
  resolve: (result: ValidationPromiseResult) => void
) => {
  fetchController.current = new AbortController();

  const response = await fetch(
    emailApiUrl,
    getFetchInit({ email }, fetchController.current.signal)
  );

  fetchController.current = undefined;

  const responseBody = await response.json();
  const isValid = responseBody.isValid;

  resolve({
    content: isValid ? (
      <CheckIcon sx={{ color: validColor, fontSize: 16 }} />
    ) : (
      "This email is taken"
    ),
    isValid
  });
};

export const registerFetch = async (email?: string, username?: string) => {
  const response = await fetch(
    registerApiUrl,
    getFetchInit({ email: email || "", username: username || "" })
  );

  return await response.json();
};

export const usernameFetch = async (
  fetchController: React.MutableRefObject<AbortController | undefined>,
  username: string,
  resolve: (result: ValidationPromiseResult) => void
) => {
  fetchController.current = new AbortController();

  const response = await fetch(
    usernameApiUrl,
    getFetchInit({ username }, fetchController.current.signal)
  );

  fetchController.current = undefined;

  const responseBody = await response.json();
  const isValid = responseBody.isValid;

  resolve({
    content: isValid ? (
      <CheckIcon
        data-testid="username-valid"
        sx={{ color: validColor, fontSize: 16 }}
      />
    ) : (
      <span data-testid="username-invalid">This username is taken</span>
    ),
    isValid
  });
};
