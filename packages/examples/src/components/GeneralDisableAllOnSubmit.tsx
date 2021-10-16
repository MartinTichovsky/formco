import { FormController, Input, Submit } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  givenName: string;
  surname: string;
  radio: string;
};

export const GeneralDisableAllOnSubmit = (
  props: Partial<React.ComponentProps<typeof FormController>>
) => {
  const store = new LogStore();

  return (
    <Template store={store}>
      <FormController<MyForm> {...props} onSubmit={() => {}}>
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="givenName"
                name="givenName"
                placeholder="Input a given name"
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="surname"
                name="surname"
                placeholder="Input a surname"
              />
            </div>

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
            <div className="field-row buttons">
              <Submit
                controller={controller}
                data-testid="submit"
                disableIfNotValid
                onSubmit={(fields, controller) => {
                  console.log(fields);
                  controller.disableFields(true);
                  store.onSubmit(fields, controller);
                }}
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
              * When the form is submitted, all inputs will be disabled. Reset
              the form to enable them again. No validation is provided.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
