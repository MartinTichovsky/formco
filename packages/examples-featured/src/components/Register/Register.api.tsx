import CheckIcon from "@mui/icons-material/Check";
import * as React from "react";
import { validColor } from "./Register.styles";
import { Api } from "./Register.types";

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

export const api = async ({
    body,
    errorMessage,
    fetchController,
    id,
    invalidTestId,
    resolve,
    url,
    validTestId
}: Api) => {
    fetchController.registerAbortController(id);

    const responseBody = await fetch(url, getFetchInit(body, fetchController.getSignal(id)))
        .then((response) => response.json())
        .catch(() => {
            //
        });

    if (!responseBody) {
        return;
    }

    const isValid = responseBody.isValid;

    resolve({
        content: isValid ? (
            <CheckIcon data-testid={validTestId} sx={{ color: validColor, fontSize: 16 }} />
        ) : (
            <span data-testid={invalidTestId}>{errorMessage}</span>
        ),
        isValid
    });
};

export const registerFetch = async (email: string, username: string) => {
    const response = await fetch(registerApiUrl, getFetchInit({ email, username }));

    return await response.json();
};
