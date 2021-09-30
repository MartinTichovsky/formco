import React from "react";
import { FormController, Input, Submit } from "..";
import { FormControllerComponentProps } from "../components/FormController.types";

type MyForm = {
  givenName: string;
  surname: string;
};

export const Trim = (props: Partial<FormControllerComponentProps<MyForm>>) => (
  <FormController<MyForm> {...props}>
    {(controller) => (
      <>
        <div>
          <Input
            controller={controller}
            data-testid="input-1"
            name="givenName"
            placeholder="Input a given name"
          />
        </div>
        <div>
          <Input
            controller={controller}
            data-testid="input-2"
            name="surname"
            placeholder="Input a surname"
          />
        </div>
        <div>
          <Submit controller={controller} data-testid="submit">
            Submit
          </Submit>
        </div>
      </>
    )}
  </FormController>
);
