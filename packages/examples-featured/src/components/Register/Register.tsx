import CircularProgress from "@mui/material/CircularProgress";
import { FormController, Input, Submit, ValidationPromiseResult } from "formco";
import debounce from "lodash.debounce";
import React from "react";
import { MessageStore } from "../../store";
import { emailRegex } from "../../utils/utils";
import { Message } from "../Template/Message";
import { api, emailApiUrl, usernameApiUrl } from "./Register.api";
import { Colored } from "./Register.styles";
import { SubmitComponent } from "./Register.submit";
import { RegisterForm } from "./Register.types";

export const Register = () => {
  const store = React.useMemo(() => new MessageStore(), []);

  const debouncedEmailFetch = React.useCallback(debounce(api, 500), []);
  const debouncedUsernameFetch = React.useCallback(debounce(api, 500), []);
  const emailFetchController = React.useRef<AbortController | undefined>(
    undefined
  );
  const usernameFetchController = React.useRef<AbortController | undefined>(
    undefined
  );

  return (
    <FormController<RegisterForm> className="styled-form" validateOnChange>
      {(controller) => (
        <Colored>
          <div className="field-row">
            <Input
              controller={controller}
              data-testid="username"
              name="username"
              placeholder="Username"
              required
              requiredInvalidMessage="Input username"
              validation={(value) => {
                value = (value || "").trim();

                return value.length < 4
                  ? {
                      content: "",
                      promise: async () => ({
                        content: "Username must have at least 4 letters",
                        isValid: false
                      }),
                      wait: 1500
                    }
                  : {
                      content: (
                        <CircularProgress
                          data-testid="username-loading"
                          size={16}
                        />
                      ),
                      promise: () =>
                        new Promise<ValidationPromiseResult>((resolve) => {
                          if (usernameFetchController.current) {
                            usernameFetchController.current.abort();
                          }

                          debouncedUsernameFetch({
                            body: { username: value! },
                            errorMessage: "This username is taken",
                            fetchController: usernameFetchController,
                            id: "username",
                            resolve,
                            url: usernameApiUrl
                          });
                        })
                    };
              }}
            />
          </div>

          <div className="field-row">
            <Input
              controller={controller}
              data-testid="email"
              name="email"
              placeholder="Email"
              required
              requiredInvalidMessage="Input email"
              validation={(value) => {
                value = (value || "").trim();

                return !value.match(emailRegex)
                  ? {
                      content: "",
                      promise: async () => ({
                        content: "Email is not valid",
                        isValid: false
                      }),
                      wait: 1000
                    }
                  : {
                      content: <CircularProgress size={16} />,
                      promise: () =>
                        new Promise<ValidationPromiseResult>((resolve) => {
                          if (emailFetchController.current) {
                            emailFetchController.current.abort();
                          }

                          debouncedEmailFetch({
                            body: { email: value! },
                            errorMessage: "This email is taken",
                            fetchController: emailFetchController,
                            id: "email",
                            resolve,
                            url: emailApiUrl
                          });
                        })
                    };
              }}
            />
          </div>

          <div className="field-row buttons">
            <Submit
              component={SubmitComponent}
              controller={controller}
              data-testid="submit"
              disabledByDefault
              disableIfNotValid
              store={store}
            >
              Register
            </Submit>
            <Message
              data-testid="message"
              store={store}
              style={{ color: "#00bd43", marginLeft: 15 }}
            />
          </div>
        </Colored>
      )}
    </FormController>
  );
};
