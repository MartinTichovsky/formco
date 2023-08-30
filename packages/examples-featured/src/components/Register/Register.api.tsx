import CheckIcon from "@mui/icons-material/Check";
import * as React from "react";
import { validColor } from "./Register.styles";
import { Api } from "./Register.types";

const apiBaseUrl = "http://localhost:3000";
export const emailApiUrl = `${apiBaseUrl}/email`;
const registerApiUrl = `${apiBaseUrl}/register`;
export const usernameApiUrl = `${apiBaseUrl}/username`;

const getFetchInit = (body: Record<string, string>, signal?: AbortSignal) => ({
    body: JSON.stringify(body),
    headers: {
        "content-type": "application/json"
    },
    method: "POST",
    signal
});

export const api = async ({ body, errorMessage, fetchController, id, resolve, url }: Api) => {
    fetchController.current = new AbortController();

    const response = await fetch(url, getFetchInit(body, fetchController.current?.signal));

    fetchController.current = undefined;

    const responseBody = await response.json();
    const isValid = responseBody.isValid;

    resolve({
        content: isValid ? (
            <CheckIcon data-testid={`${id}-valid`} sx={{ color: validColor, fontSize: 16 }} />
        ) : (
            <span data-testid={`${id}-invalid`}>{errorMessage}</span>
        ),
        isValid
    });
};

export const registerFetch = async (email: string, username: string) => {
    const response = await fetch(registerApiUrl, getFetchInit({ email, username }));

    return await response.json();
};
