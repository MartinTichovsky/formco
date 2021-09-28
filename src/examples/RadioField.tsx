import React from "react";
import { FormController, Input, Submit, Validation } from "..";
import { FormControllerComponentProps } from "../components/FormController/types";
import { Template } from "./utils/Template";

type MyForm = {
  radio: string;
};

export const RadioField = (
  props: Partial<FormControllerComponentProps<MyForm>>
) => {
  return (
    <Template>
      <FormController<MyForm>
        {...props}
        onSubmit={(fields) => console.log(fields)}
      >
        {(controller) => (
          <>
            <Validation
              validation={(value) =>
                value === undefined && (
                  <span style={{ color: "red" }}>Choose an option</span>
                )
              }
            >
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-1"
                  label="Option 1"
                  name="radio"
                  type="radio"
                  value="Option 1"
                />
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-2"
                  label="Option 2"
                  name="radio"
                  type="radio"
                  value="Option 2"
                />
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-3"
                  label="Option 3"
                  name="radio"
                  type="radio"
                  value="Option 3"
                />
              </div>
            </Validation>
            <div className="field-row">
              <Submit controller={controller} data-testid="submit">
                Submit
              </Submit>{" "}
              <button
                data-testid="reset"
                onClick={() => controller.resetForm()}
                type="button"
              >
                Reset
              </button>
            </div>
            <div className="info">
              * Basic radio field functionality, one option must be selected
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
