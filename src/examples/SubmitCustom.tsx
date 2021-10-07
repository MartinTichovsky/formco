import React from "react";
import { Controller, FormController, Input } from "../";
import { FormControllerComponentProps } from "../components/FormController.types";
import { LogStore } from "./utils/store";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

const CustomSubmitComponent = ({
  controller,
  store
}: {
  controller: Controller<MyForm>;
  store: LogStore;
}) => {
  const [pending, setPending] = React.useState(false);
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClick = () => {
    controller.submit();
    store.onSubmit(controller.fields, controller);

    if (controller.isValid) {
      console.log(controller.fields);

      setPending(true);

      // simulate HTTML request / delay
      setTimeout(() => {
        if (isMounted.current) {
          setPending(false);
        }
      }, 2000);
    }
  };

  return (
    <button data-testid="submit" onClick={handleClick}>
      {pending ? "pending..." : "Submit"}
    </button>
  );
};

export const SubmitCustom = (
  props: Partial<FormControllerComponentProps<MyForm>>
) => {
  const store = new LogStore();

  return (
    <Template store={store}>
      <FormController<MyForm> validateOnChange {...props}>
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
                data-testid="surname"
                name="surname"
                placeholder="Input a surname"
                validation={(value) =>
                  !value?.trim() && "Provide a valid surname"
                }
              />
            </div>
            <div className="field-row buttons">
              <CustomSubmitComponent controller={controller} store={store} />
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
              * This example shows how to provide your own submit button,
              without using the formco Submit.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
