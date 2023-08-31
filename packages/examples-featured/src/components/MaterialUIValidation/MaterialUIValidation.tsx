import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FC, FormController, OnValidationCustom } from "formco";
import * as React from "react";
import { LogStore } from "../../store";
import { FieldRow, Info, Template } from "../Template/Template";
import { MaterialUIValidationForm } from "./MaterialUIValidation.types";

// type safe function
const onValidationAddress: OnValidationCustom<React.ComponentProps<typeof TextField>> = (isFieldValid, setProps) => {
    setProps(isFieldValid ? { color: "success", error: false } : { color: "error", error: true });
};

export const MaterialUIValidation = () => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MaterialUIValidationForm>
                onValidation={{
                    address: onValidationAddress,
                    // this is not type safe
                    givenName: (isFieldValid, setProps) => {
                        setProps(isFieldValid ? { color: "success", error: false } : { color: "error", error: true });
                    }
                }}
                validateOnChange
            >
                {(controller) => (
                    <>
                        <FieldRow>
                            {/**
                             * this field will use a default validation action, which set `error`: true/false property
                             * after validation
                             */}
                            <FC.CustomField
                                $controller={controller}
                                $component={TextField}
                                $name="salutation"
                                $validation={(value) => !value?.trim()}
                                label="Salutation"
                                placeholder="Salutation"
                                size="small"
                                variant="outlined"
                            />
                        </FieldRow>
                        <FieldRow>
                            {/**
                             * this field will use a global validation defined in FormController, one caveat here,
                             * `color` property is not type safe, you can pass everything and never get an error
                             * out of the browser
                             */}
                            <FC.CustomField
                                $controller={controller}
                                $component={TextField}
                                $name="givenName"
                                $validation={(value) => !value?.trim()}
                                label="Given name"
                                placeholder="Given name"
                                size="small"
                                variant="outlined"
                            />
                        </FieldRow>
                        <FieldRow>
                            {/**
                             * this field will use a local validation, `color` is type safe
                             */}
                            <FC.CustomField
                                $controller={controller}
                                $component={TextField}
                                $name="surname"
                                $onValidation={(isFieldValid, setProps) => {
                                    setProps(
                                        isFieldValid
                                            ? { color: "success", error: false }
                                            : { color: "error", error: true }
                                    );
                                }}
                                $validation={(value) => !value?.trim()}
                                label="Surname"
                                placeholder="Surname"
                                size="small"
                                variant="outlined"
                            />
                        </FieldRow>
                        <FieldRow>
                            {/**
                             * this field will use a global validation defined in FormController, `color` is type safe*
                             */}
                            <FC.CustomField
                                $controller={controller}
                                $component={TextField}
                                $name="address"
                                $validation={(value) => !value?.trim()}
                                label="Address"
                                placeholder="Address"
                                size="small"
                                variant="outlined"
                            />
                        </FieldRow>

                        <FieldRow>
                            <FC.Submit
                                $component={Button}
                                $controller={controller}
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                                variant="contained"
                            >
                                Submit
                            </FC.Submit>
                        </FieldRow>
                        <Info>* Each field contains a different validation in the code</Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
