import { FormController, Select, Submit } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  select: string;
};

export const SelectField = (
  props: Partial<React.ComponentProps<typeof FormController>>
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
              <Select
                controller={controller}
                data-testid="select"
                name="select"
                validation={(value) => !value && "Select an option"}
              >
                <option></option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option value="option-3">Option 3</option>
              </Select>
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
              * Basic text field functionality, text fields must be not empty
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
