import React from "react";
import { FormController, Input, Submit } from "../";
import { FormControllerComponentProps } from "../components/FormController/types";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

const initialValues: MyForm = {
  givenName: "James",
  surname: "Bond"
};

export const TextFieldDefaultValuesUseCase1 = (
  props: Partial<FormControllerComponentProps<MyForm>>
) => {
  return (
    <Template>
      <FormController<MyForm>
        initialValues={initialValues}
        {...props}
        onSubmit={(fields) => console.log(fields)}
      >
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
                name="givenName"
                placeholder="Input a given name"
                validation={(value) =>
                  (value === undefined || !value.trim()) &&
                  "Provide a valid given name"
                }
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                name="surname"
                placeholder="Input a surname"
                validation={(value) =>
                  (value === undefined || !value.trim()) &&
                  "Provide a valid surname"
                }
              />
            </div>
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
            <div className="info">* Each text field has a default value</div>
          </>
        )}
      </FormController>
    </Template>
  );
};
