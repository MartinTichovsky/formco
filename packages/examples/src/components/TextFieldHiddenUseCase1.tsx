import { FormController, Input, Submit } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  givenName: string;
  salutation: string;
  surname: string;
};

export const TextFieldHiddenUseCase1 = (
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
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="salutation"
                hideIf={(fields) => !fields.surname?.trim()}
                name="salutation"
                placeholder="Input salutation"
                validation={(value) =>
                  !value?.trim() && "Provide a valid salutation"
                }
              />
            </div>
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
                data-testid="surname"
                hideIf={(fields) => !fields.givenName?.trim()}
                name="surname"
                placeholder="Input a surname"
                validation={(value) =>
                  !value?.trim() && "Provide a valid surname"
                }
              />
            </div>
            <div className="field-row buttons">
              <Submit
                controller={controller}
                data-testid="submit"
                disableIfNotValid
                disabledByDefault
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
              * Salutation is hidden until the surname is not valid, the surname
              is hidden until the first name is not valid and the submit button
              is disabled until all text fields are filled
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
