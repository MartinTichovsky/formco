import React from "react";
import { FormController, Input, Submit } from "..";
import { FormControllerComponentProps } from "../components/FormController/types";
import { LogStore } from "./utils/store";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const GeneralValidationUseCase2 = (
  props: Partial<FormControllerComponentProps<MyForm>>
) => {
  const store = new LogStore();

  return (
    <Template store={store}>
      <FormController<MyForm>
        validateOnChange
        validation={{
          givenName: (value) =>
            (value === undefined ||
              (typeof value === "string" && !value.trim())) &&
            "Provide a valid given name",
          surname: (value) =>
            (value === undefined ||
              (typeof value === "string" && !value.trim())) &&
            "Provide a valid surname"
        }}
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
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                name="surname"
                placeholder="Input a surname"
              />
            </div>

            <div className="field-row buttons">
              <Submit
                data-testid="submit"
                controller={controller}
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
              * Providing the validation from the form controller
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
