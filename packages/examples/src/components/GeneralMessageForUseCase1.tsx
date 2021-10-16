import { FormController, Input, MessageFor, Submit } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const givenNameErrorText = "Provide a valid given name";
export const surnameErrorText = "Provide a valid surname";

export const GeneralMessageForUseCase1 = (
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
              <Input
                controller={controller}
                data-testid="givenName"
                hideMessage
                name="givenName"
                placeholder="Input a given name"
                validation={(value) => !value?.trim()}
              />
            </div>
            <div className="field-row">
              <MessageFor controller={controller} name="givenName">
                {givenNameErrorText}
              </MessageFor>
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="surname"
                hideMessage
                name="surname"
                placeholder="Input a surname"
                validation={(value) => ({
                  content: surnameErrorText,
                  isValid: !!value?.trim()
                })}
              />
            </div>
            <div className="field-row">
              <MessageFor controller={controller} name="surname" />
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
              * When a text field is not valid, error message outside the Input
              will be shown after submit. The both inputs have different using.
              The first text is taken from context of MessageFor component, the
              second text is taken from validation.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
