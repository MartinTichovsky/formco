import {
  FormController,
  Input,
  Select,
  Submit,
  Textarea,
  Validation
} from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  checkbox: boolean;
  givenName: string;
  select: string;
  surname: string;
  note: string;
  radio: string;
};

export const GeneralScrollToError = (
  props: Partial<React.ComponentProps<typeof FormController>>
) => {
  const store = new LogStore();

  return (
    <Template store={store}>
      <FormController<MyForm>
        data-testid="form-controller"
        options={{ scrollToError: true }}
        {...props}
        onSubmit={(fields) => {
          console.log(fields);
        }}
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
            <div className="field-row" style={{ marginTop: 100 }}>
              <Input
                controller={controller}
                data-testid="surname"
                name="surname"
                placeholder="Input a surname"
                validation={(value) =>
                  !value?.trim() && "Provide a valid surname"
                }
              />
            </div>
            <div className="field-row textarea" style={{ marginTop: 100 }}>
              <Textarea
                controller={controller}
                data-testid="note"
                name="note"
                placeholder="Input a note"
                validation={(value) => !value?.trim() && "Provide a note"}
              />
            </div>
            <div className="field-row" style={{ marginTop: 100 }}>
              <Select
                controller={controller}
                data-testid="select"
                name="select"
                validation={(value) => !value && "Select an option"}
              >
                <option></option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </Select>
            </div>
            <Validation
              validation={(value) => value === undefined && "Choose an option"}
            >
              <div className="field-row" style={{ marginTop: 100 }}>
                <Input
                  controller={controller}
                  data-testid="radio-1"
                  hideIf={(fields) => fields.surname === "Bond"}
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
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-3"
                  label="Option 3"
                  name="radio"
                  type="radio"
                  value="Option 3"
                />
              </div>
            </Validation>
            <div className="field-row" style={{ marginTop: 100 }}>
              <Input
                controller={controller}
                data-testid="checkbox"
                label="Checkbox"
                name="checkbox"
                type="checkbox"
                validation={(value) =>
                  value !== true && "This checkbox must be checked"
                }
              />
            </div>
            <div className="field-row buttons" style={{ marginTop: 400 }}>
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
