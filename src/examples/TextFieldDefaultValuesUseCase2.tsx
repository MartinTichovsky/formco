import React from "react";
import { FormController, Input, Submit } from "..";
import { FormControllerComponentProps } from "../components/FormController/types";
import { LogStore } from "./utils/store";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

const initialValues: Partial<MyForm> = {
  givenName: "James"
};

export const TextFieldDefaultValuesUseCase2 = (
  props: Partial<FormControllerComponentProps<MyForm>>
) => {
  const store = new LogStore();

  return (
    <Template store={store}>
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
                disableIf={(fields) => !fields.surname?.trim()}
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
              * Give name is enabled after a valid value is typed in surname.
              When delete surname, the given name should have initial value.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
