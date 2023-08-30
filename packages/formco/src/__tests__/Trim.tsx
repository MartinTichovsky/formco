import * as React from "react";
import { FormController } from "..";
import { Input, Submit } from "../components/fields";
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
                        $controller={controller}
                        data-testid="givenName"
                        $name="givenName"
                        placeholder="Input a given name"
                    />
                </div>
                <div>
                    <Input
                        $controller={controller}
                        data-testid="surname"
                        $name="surname"
                        placeholder="Input a surname"
                    />
                </div>
                <div>
                    <Submit $controller={controller} data-testid="submit">
                        Submit
                    </Submit>
                </div>
            </>
        )}
    </FormController>
);
