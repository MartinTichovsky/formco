import React from "react";
import { FormController, Input, Submit } from "..";
import { FormControllerComponentProps } from "../components/FormController/types";
import { LogStore } from "./utils/store";
import { Template } from "./utils/Template";

type MyForm = {
  checkbox1: boolean;
  checkbox2: boolean;
  checkbox3: boolean;
};

export const CheckboxField = (
  props: Partial<FormControllerComponentProps<MyForm>>
) => {
  const store = new LogStore();

  return (
    <Template store={store}>
      <FormController<MyForm>
        {...props}
        onSubmit={(fields) => console.log(fields)}
      >
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="checkbox-1"
                label="Checkbox 1"
                name="checkbox1"
                type="checkbox"
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="checkbox-2"
                label="Checkbox 2"
                name="checkbox2"
                type="checkbox"
                validation={(value) =>
                  value !== true && "This checkbox must be checked"
                }
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="checkbox-3"
                label="Checkbox 3"
                name="checkbox3"
                type="checkbox"
              />
            </div>

            <div className="field-row buttons">
              <Submit
                controller={controller}
                data-testid="submit"
                onSubmit={(fields, controller) =>
                  store.onSubmit(fields, controller)
                }
              >
                Submit
              </Submit>
              <button
                data-testid="reset"
                onClick={() => {
                  controller.resetForm();
                  store.reset();
                }}
                type="button"
              >
                Reset
              </button>
            </div>
            <div className="info">
              * Basic checkbox field functionality, the second checkbox must be
              checked to make the form valid
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
