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
import { Field, FormController, Submit } from "formco";
import React from "react";
import { MaterialUIForm } from "./MaterialUI.types";

export const MaterialUI = () => {
  return (
    <FormController<MaterialUIForm> validateOnChange>
      {(controller) => (
        <>
          <div className="field-row">
            <Field
              controller={controller}
              component={TextField}
              label="Name"
              name="name"
              placeholder="Name"
              size="small"
              validation={(value) => !value?.trim()}
              variant="outlined"
            />
          </div>
          <div className="field-row">
            <FormControl sx={{ margin: 0, minWidth: 120 }}>
              <InputLabel id="age">Age</InputLabel>
              <Field
                component={Select}
                controller={controller}
                id="age"
                label="Age"
                name="age"
                provideValue={true}
                validation={(value) => value === 30}
                value={""}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Field>
            </FormControl>
          </div>
          <div className="field-row">
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <Field
                component={RadioGroup}
                controller={controller}
                defaultValue="female"
                name="gender"
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </Field>
            </FormControl>
          </div>
          <div className="field-row">
            <FormControlLabel
              control={
                <Field
                  component={Checkbox}
                  controller={controller}
                  name="consent"
                />
              }
              label="Consent"
            />
          </div>
          <div className="field-row">
            <Submit
              component={Button}
              controller={controller}
              onSubmit={() =>
                console.log(controller.isValid, controller.fields)
              }
              variant="contained"
            >
              Submit
            </Submit>
          </div>
        </>
      )}
    </FormController>
  );
};
