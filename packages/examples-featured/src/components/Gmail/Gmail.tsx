import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Condition, Field, FormController, Submit } from "formco";
import React from "react";
import { wait } from "../../utils/utils";
import { GmailForm } from "./Gmail.types";

export const Gmail = () => {
  return (
    <FormController<GmailForm> validateOnChange>
      {(controller) => (
        <>
          <div className="field-row">
            <Field
              controller={controller}
              component={TextField}
              data-testid="givenName"
              label="Given name"
              name="givenName"
              onValidation={(isFieldValid, setProps) => {
                if (isFieldValid) {
                  setProps((prevProps) => ({ ...prevProps, error: undefined }));
                } else {
                  setProps((prevProps) => ({ ...prevProps, error: true }));
                }
              }}
              placeholder="Given name"
              size="small"
              validation={(value) => !value?.trim()}
              variant="outlined"
            />
          </div>
          <div className="field-row">
            <Field
              controller={controller}
              component={TextField}
              data-testid="surname"
              label="Surname"
              name="surname"
              onValidation={(isFieldValid, setProps, validationInProgress) => {
                if (validationInProgress) {
                  setProps((prevProps) => ({ ...prevProps, error: undefined }));
                  return;
                }

                if (isFieldValid) {
                  setProps((prevProps) => ({ ...prevProps, error: undefined }));
                } else {
                  setProps((prevProps) => ({ ...prevProps, error: true }));
                }
              }}
              placeholder="Surname"
              size="small"
              validation={(value) => ({
                promise: async () => {
                  await wait(1500);
                  return { isValid: !!value?.trim() };
                },
                wait: 1500
              })}
              variant="outlined"
            />
            <Condition
              controller={controller}
              showIf={() =>
                controller.isFieldValidationInProgress("surname") === true
              }
            >
              pending
            </Condition>
          </div>
          <div className="field-row">
            <Submit
              component={Button}
              controller={controller}
              onSubmit={() => console.log(controller.isValid)}
              variant="outlined"
            >
              Submit
            </Submit>
          </div>
        </>
      )}
    </FormController>
  );
};
