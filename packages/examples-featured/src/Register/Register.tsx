import CircularProgress from "@mui/material/CircularProgress";
import { FormController, Input, Submit } from "formco";
import debounce from "lodash.debounce";
import { ValidationPromiseResult } from "packages/formco/src/controller.types";
import React from "react";
import { emailRegex } from "../utils/utils";
import { emailFetch, usernameFetch } from "./Register.api";
import { Colored } from "./Register.styles";
import { SubmitComponent } from "./Register.submit";
import { RegisterForm } from "./Register.types";

export const Register = () => {
  const debouncedEmailFetch = React.useCallback(debounce(emailFetch, 500), []);
  const debouncedUsernameFetch = React.useCallback(
    debounce(usernameFetch, 500),
    []
  );
  const emailFetchController = React.useRef<AbortController | undefined>(
    undefined
  );
  const usernameFetchController = React.useRef<AbortController | undefined>(
    undefined
  );

  return (
    <FormController<RegisterForm> validateOnChange>
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

                          debouncedUsernameFetch(
                            usernameFetchController,
                            value!,
                            resolve
                          );
                        })
                    };
              }}
            />
          </div>

          <div className="field-row">
            <Input
              controller={controller}
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

                          debouncedEmailFetch(
                            emailFetchController,
                            value!,
                            resolve
                          );
                        })
                    };
              }}
            />
          </div>

          <div className="field-row buttons">
            <Submit
              ButtonComponent={SubmitComponent}
              controller={controller}
              disabledByDefault
              disableIfNotValid
            >
              Register
            </Submit>
          </div>
        </Colored>
      )}
    </FormController>
  );
};
