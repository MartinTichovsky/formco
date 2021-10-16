import { FormController, Input, Submit } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  givenName: string;
  salutation: string;
  surname: string;
};

export const TextFieldHiddenUseCase2 = (
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
              />
            </div>
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
              * The form is valid because `Given Name` field doesn't have a
              validation. You can submit an empty form. The surname is hidden
              until the given name is filled. After typing your given name, you
              must fill your surname, otherwise is form invalid. Salutation is
              optional and it is hidden until given name and surname are not
              filled.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
