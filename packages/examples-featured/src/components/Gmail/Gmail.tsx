import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { Field, FormController, Submit } from "formco";
import React from "react";
import { wait } from "../../utils/utils";
import { GmailForm } from "./Gmail.types";

export const Gmail = () => {
  return (
    <FormController<GmailForm>>
      {(controller) => (
        <>
          <div className="field-row">
            <Field
              controller={controller}
              component={TextField}
              data-testid="firstName"
              label="First name"
              name="firstName"
              size="small"
              validation={(value) => !value?.trim()}
              variant="outlined"
              validateOnBlur
            />
            <Field
              controller={controller}
              component={TextField}
              data-testid="lastName"
              label="Last name"
              name="lastName"
              size="small"
              style={{ marginLeft: 10 }}
              validation={(value) => !value?.trim()}
              variant="outlined"
              validateOnChange
            />
            {/* <Condition
              controller={controller}
              showIf={() =>
                controller.isFieldValidationInProgress("lastName") === true
              }
            >
              pending
            </Condition> */}
          </div>
          <div className="field-row">
            <Field
              controller={controller}
              component={TextField}
              data-testid="username"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">@gmail.com</InputAdornment>
                )
              }}
              label="Username"
              name="username"
              size="small"
              style={{ marginLeft: 10 }}
              validation={(value) => ({
                promise: async () => {
                  await wait(1500);
                  return { isValid: !!value?.trim() };
                },
                wait: 1500
              })}
              variant="outlined"
            />
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
