import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { FC, FormController } from "formco";
import * as React from "react";
import { wait } from "../../utils/utils";
import { FieldRow } from "../Template/Template";
import { GmailForm } from "./Gmail.types";

export const Gmail = () => {
    return (
        <FormController<GmailForm>>
            {(controller) => (
                <>
                    <FieldRow>
                        <FC.CustomField
                            $component={TextField}
                            $controller={controller}
                            $name="firstName"
                            $validation={(value) => !value?.trim()}
                            $validateOnBlur
                            data-testid="firstName"
                            label="First name"
                            size="small"
                            variant="outlined"
                        />
                        <FC.CustomField
                            $controller={controller}
                            $component={TextField}
                            $name="lastName"
                            $validateOnChange
                            $validation={(value) => !value?.trim()}
                            data-testid="lastName"
                            label="Last name"
                            size="small"
                            style={{ marginLeft: 10 }}
                            variant="outlined"
                        />
                        <TextField />
                        {/* <Condition
              controller={controller}
              showIf={() =>
                controller.isFieldValidationInProgress("lastName") === true
              }
            >
              pending
            </Condition> */}
                    </FieldRow>
                    <FieldRow>
                        <FC.CustomField
                            $controller={controller}
                            $component={TextField}
                            $name="username"
                            $validation={(value) => ({
                                promise: async () => {
                                    await wait(1500);
                                    return { isValid: !!value?.trim() };
                                },
                                wait: 1500
                            })}
                            data-testid="username"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">@gmail.com</InputAdornment>
                            }}
                            label="Username"
                            size="small"
                            style={{ marginLeft: 10 }}
                            variant="outlined"
                        />
                    </FieldRow>
                    <FieldRow>
                        <FC.Submit
                            $component={Button}
                            $controller={controller}
                            $onSubmit={() => console.log(controller.isValid)}
                            variant="outlined"
                        >
                            Submit
                        </FC.Submit>
                    </FieldRow>
                </>
            )}
        </FormController>
    );
};
