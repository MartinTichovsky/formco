import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { FC, FormController } from "formco";
import * as React from "react";
import { LogStore } from "../../store";
import { FieldRow, Template } from "../Template/Template";
import { MaterialUIForm } from "./MaterialUI.types";

export const MaterialUI = () => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MaterialUIForm> validateOnChange initialValues={{ gender: "female" }}>
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.CustomField
                                $controller={controller}
                                $component={TextField}
                                $name="name"
                                $validation={(value) => !value?.trim()}
                                label="Name"
                                placeholder="Name"
                                size="small"
                                variant="outlined"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FormControl sx={{ margin: 0, minWidth: 120 }}>
                                <InputLabel id="age">Age</InputLabel>
                                <FC.CustomField
                                    $component={Select}
                                    $controller={controller}
                                    $id="age"
                                    $name="age"
                                    $provideValue
                                    $validation={(value) => value === 30}
                                    label="Age"
                                    value=""
                                >
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </FC.CustomField>
                            </FormControl>
                        </FieldRow>
                        <FieldRow>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Gender</FormLabel>
                                <FC.CustomField $component={RadioGroup} $controller={controller} $name="gender">
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                                </FC.CustomField>
                            </FormControl>
                        </FieldRow>
                        <FieldRow>
                            <FormControlLabel
                                control={
                                    <FC.CustomField $component={Checkbox} $controller={controller} $name="consent" />
                                }
                                label="Consent"
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
                    </>
                )}
            </FormController>
        </Template>
    );
};
