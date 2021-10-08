import { FormController, Input, Submit, Validation } from "formco";
import React from "react";
import { LogStore } from "./utils/store";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const GeneralValidationUseCase1 = (
  props: Partial<React.ComponentProps<typeof FormController>>
) => {
  const store = new LogStore();

  return (
    <Template store={store}>
      <FormController<MyForm>
        validateOnChange
        {...props}
        onSubmit={(fields) => console.log(fields)}
      >
        {(controller) => (
          <>
            <Validation
              validation={(value) =>
                (value === undefined ||
                  (typeof value === "string" && !value.trim())) &&
                "Provide a valid text"
              }
            >
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
            </Validation>
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
              * Providing the validation as a parental element, it should show
              the same error for each text input
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
