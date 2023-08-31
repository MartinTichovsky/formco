import { Controller, FC, FormController } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    firstName: string;
    surname: string;
}

const CustomSubmitComponent = ({ controller, store }: { controller: Controller<MyForm>; store: LogStore }) => {
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

        if (controller.isFormValid) {
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
            {pending ? TestingContent.Pending : "Submit"}
        </button>
    );
};

export const SubmitCustom = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> validateOnChange {...props} onSubmit={() => {}}>
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="firstName"
                                $validation={(value) => !value?.trim() && "Provide a valid given name"}
                                data-testid={DataTestId.FirstName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="surname"
                                $validation={(value) => !value?.trim() && "Provide a valid surname"}
                                data-testid={DataTestId.Surname}
                                placeholder="Input a surname"
                            />
                        </FieldRow>

                        <FieldRowButtons>
                            <CustomSubmitComponent controller={controller} store={store} />
                            <ResetButton controller={controller} store={store} />
                        </FieldRowButtons>
                        <Info>
                            * This example shows how to provide your own submit button, without using the formco Submit.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
