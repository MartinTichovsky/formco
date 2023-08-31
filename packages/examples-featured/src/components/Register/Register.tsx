import CircularProgress from "@mui/material/CircularProgress";
import { FC, FormController, ValidationPromiseResult } from "formco";
import { debounce } from "lodash";
import * as React from "react";
import { LogStore, MessageStore } from "../../store";
import { FetchController } from "../../utils/FetchController";
import { emailRegex } from "../../utils/utils";
import { Message } from "../Template/Message";
import { FieldRow, FieldRowButtons, Info, List, Template } from "../Template/Template";
import { api, emailApiUrl, usernameApiUrl } from "./Register.api";
import { RegisterDataTestId } from "./Register.enums";
import { Colored } from "./Register.styles";
import { SubmitComponent } from "./Register.submit";
import { RegisterForm } from "./Register.types";

export const validationTimeout = 2000;

export const Register = () => {
    const logStore = React.useMemo(() => new LogStore(), []);
    const messageStore = React.useMemo(() => new MessageStore(), []);

    const debouncedEmailFetch = React.useCallback(debounce(api, 500), []);
    const debouncedUsernameFetch = React.useCallback(debounce(api, 500), []);
    const fetchController = React.useMemo(() => new FetchController<RegisterForm>(), []);

    return (
        <Template store={logStore}>
            <FormController<RegisterForm> className="styled-form" validateOnChange>
                {(controller) => (
                    <Colored>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="username"
                                $required
                                $requiredInvalidMessage="Input username"
                                $validation={(value) => {
                                    const username = (value || "").trim();

                                    return username.length < 4
                                        ? {
                                              promise: async () => ({
                                                  content: "Username must have at least 4 letters",
                                                  isValid: false
                                              }),
                                              wait: validationTimeout
                                          }
                                        : {
                                              content: (
                                                  <CircularProgress
                                                      data-testid={RegisterDataTestId.UsernameLoading}
                                                      size={16}
                                                  />
                                              ),
                                              promise: () =>
                                                  new Promise<ValidationPromiseResult>((resolve) => {
                                                      fetchController.abortLastFetch("username");

                                                      debouncedUsernameFetch({
                                                          body: { username },
                                                          errorMessage: "This username is taken",
                                                          fetchController,
                                                          id: "username",
                                                          invalidTestId: RegisterDataTestId.UsernameInvalid,
                                                          resolve,
                                                          url: usernameApiUrl,
                                                          validTestId: RegisterDataTestId.UsernameValid
                                                      });
                                                  })
                                          };
                                }}
                                data-testid={RegisterDataTestId.Username}
                                placeholder="Username"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="email"
                                $required
                                $requiredInvalidMessage="Input email"
                                $validation={(value) => {
                                    const email = (value || "").trim();

                                    return !email.match(emailRegex)
                                        ? {
                                              promise: async () => ({
                                                  content: "Email is not valid",
                                                  isValid: false
                                              }),
                                              wait: validationTimeout
                                          }
                                        : {
                                              content: (
                                                  <CircularProgress
                                                      data-testid={RegisterDataTestId.EmailLoading}
                                                      size={16}
                                                  />
                                              ),
                                              promise: () =>
                                                  new Promise<ValidationPromiseResult>((resolve) => {
                                                      fetchController.abortLastFetch("email");

                                                      debouncedEmailFetch({
                                                          body: { email },
                                                          errorMessage: "This email is taken",
                                                          fetchController,
                                                          id: "email",
                                                          invalidTestId: RegisterDataTestId.EmailInvalid,
                                                          resolve,
                                                          url: emailApiUrl,
                                                          validTestId: RegisterDataTestId.EmailValid
                                                      });
                                                  })
                                          };
                                }}
                                data-testid={RegisterDataTestId.Email}
                                placeholder="Email"
                            />
                        </FieldRow>

                        <FieldRowButtons>
                            <FC.Submit
                                $component={SubmitComponent}
                                $controller={controller}
                                $disabledByDefault
                                $disableIfNotValid
                                $onSubmit={(fields, controller) => logStore.onSubmit(fields, controller)}
                                data-testid={RegisterDataTestId.Submit}
                                logStore={logStore}
                                messageStore={messageStore}
                            >
                                Register
                            </FC.Submit>
                            <Message
                                data-testid={RegisterDataTestId.Message}
                                store={messageStore}
                                style={{ color: "#00bd43", marginLeft: 15 }}
                            />
                        </FieldRowButtons>
                        <Info>
                            * Register button is enabled after you fill all fields and they pass throught server
                            validation. After register, the fields are stored in session on the server. You can not use
                            them in the next register. You can try open a new tab, input here valid values and in the
                            new tab fill the same values. Then click on Register here and after that in the new tab. You
                            should get an error. It simulates that two people are registering the same username and
                            email at the same time.
                            <List
                                list={{
                                    Username: [
                                        "it must contain at least 4 letters",
                                        "if letters count is less then 4 the message popup after 2s",
                                        "when provide a valid name immediate request follows"
                                    ],
                                    Email: [
                                        "validation is triggered 2s after stop typing",
                                        "it must be provided a valid email address"
                                    ]
                                }}
                            />
                        </Info>
                    </Colored>
                )}
            </FormController>
        </Template>
    );
};
