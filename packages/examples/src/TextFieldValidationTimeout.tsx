import { FormController, Input, Submit } from "formco";
import React from "react";
import { LogStore } from "./utils/store";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  middleName: string;
  surname: string;
};

export const TextFieldValidationTimeout = ({
  ...props
}: Partial<React.ComponentProps<typeof FormController>>) => {
  const store = new LogStore();

  return (
    <Template store={store}>
      <FormController<MyForm>
        options={{ validationTimeout: 2000 }}
        {...props}
        onSubmit={(fields) => console.log(fields)}
        validateOnChange
      >
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="givenName"
                name="givenName"
                placeholder="Input a given name"
                validation={(value) =>
                  !value?.trim() && "Provide a valid given name"
                }
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="middleName"
                name="middleName"
                placeholder="Input a middle name"
                validation={(value) =>
                  !value?.trim() && "Provide a valid surname"
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
            <div className="info">*</div>
          </>
        )}
      </FormController>
    </Template>
  );
};
