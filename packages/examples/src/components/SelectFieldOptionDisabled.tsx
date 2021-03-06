import { FormController, Select, SelectOption, Submit } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  select1: string;
  select2: string;
};

export const SelectFieldOptionDisabled = (
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
          <div className="g-label-80">
            <div className="field-row">
              <Select
                controller={controller}
                data-testid="select-1"
                label="Select 1"
                name="select1"
                validation={(value) => {
                  return !value && "Select an option";
                }}
              >
                <option></option>
                <SelectOption
                  controller={controller}
                  disableIf={(fields) => fields.select2 !== "Option 2-1"}
                >
                  Option 1-1
                </SelectOption>
                <SelectOption
                  controller={controller}
                  disableIf={(fields) => fields.select2 !== "Option 2-2"}
                >
                  Option 1-2
                </SelectOption>
                <SelectOption
                  controller={controller}
                  disableIf={(fields) => fields.select2 !== "option-2-3"}
                  value="option-1-3"
                >
                  Option 1-3
                </SelectOption>
              </Select>
            </div>
            <div className="field-row">
              <Select
                controller={controller}
                data-testid="select-2"
                label="Select 2"
                name="select2"
                validation={(value) => !value && "Select an option"}
              >
                <option></option>
                <option>Option 2-1</option>
                <option>Option 2-2</option>
                <option value="option-2-3">Option 2-3</option>
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
              * Options in select 1 are enabled based on selection in select 2.
              When all options are disabled, no validation is fired.
            </div>
          </div>
        )}
      </FormController>
    </Template>
  );
};
