import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    givenName: string;
    surname: string;
}

const FunctionalMessageComponent = ({ children }: React.PropsWithChildren<{}>) => {
    return (
        <span data-testid={DataTestId.FunctionalComponent} style={{ marginLeft: 10 }}>
            Functional component error: <span style={{ color: "blue" }}>{children}</span>
        </span>
    );
};

class ClassMessageComponent extends React.Component {
    render() {
        return (
            <span data-testid={DataTestId.ClassComponent} style={{ marginLeft: 10 }}>
                Class component error: <span style={{ color: "red" }}>{this.props.children}</span>
            </span>
        );
    }
}

export const TextFieldMessageComponent = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> validateOnChange {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $messageComponent={FunctionalMessageComponent}
                                $name="givenName"
                                $validation={(value) => !value?.trim() && "Provide a valid given name"}
                                data-testid={DataTestId.GivenName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $messageComponent={ClassMessageComponent}
                                $name="surname"
                                $validation={(value) => !value?.trim() && "Provide a valid surname"}
                                data-testid={DataTestId.Surname}
                                placeholder="Input a surname"
                            />
                        </FieldRow>

                        <FieldRowButtons>
                            <FC.Submit
                                $controller={controller}
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                                data-testid={DataTestId.Submit}
                            >
                                Submit
                            </FC.Submit>
                            <ResetButton controller={controller} store={store} />
                        </FieldRowButtons>
                        <Info>
                            * The first text field is created with a functional error component (blue color on error).
                            The second text field is created with a class error component (red color on error). Type an
                            empty text to show an error.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
