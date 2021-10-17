import TextField from "@mui/material/TextField";
import { Field, FormController } from "formco";
import React from "react";
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
              onValidation={(isValid, setProps) => {
                if (isValid) {
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
        </>
      )}
    </FormController>
  );
};
