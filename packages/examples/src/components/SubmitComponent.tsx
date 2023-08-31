import { Controller, FC, FormController } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowFullWidth, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    givenName: string;
    surname: string;
}

const FunctionalSubmitComponent = ({
    children,
    disabled,
    onClick,
    ...rest
}: React.PropsWithChildren<{
    disabled: boolean; // required
    onClick: (event: React.MouseEvent) => Controller<MyForm>; // required
}>) => {
    const [pending, setPending] = React.useState(false);
    const isMounted = React.useRef(true);

    React.useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, [isMounted]);

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const controller = await onClick(event);

        if (controller.isValid) {
            console.log(controller.fields);

            setPending(true);

            // simulate HTTML request / delay
            setTimeout(() => {
                // this condition avoids react errors when navigate in the menu
                if (isMounted.current) {
                    setPending(false);
                }
            }, 2000);
        }
    };

    return (
        <button {...rest} disabled={disabled} onClick={handleClick}>
            {pending ? TestingContent.Pending : children}
        </button>
    );
};

interface ClassSubmitComponentProps {
    disabled: boolean; // required
    onClick: (event: React.MouseEvent) => Promise<Controller<MyForm>>; // required
}

class ClassSubmitComponent extends React.Component<ClassSubmitComponentProps> {
    state: { pending: false } = { pending: false };
    private componentIsMounted;

    constructor(props: ClassSubmitComponentProps) {
        super(props);
        this.componentIsMounted = true;
    }

    componentWillUnmount() {
        this.componentIsMounted = false;
    }

    handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const controller = await this.props.onClick(event);

        if (controller.isValid) {
            console.log(controller.fields);

            this.setState({ pending: true });

            // simulate HTTML request / delay
            setTimeout(() => {
                // this condition avoids react errors when navigate in the menu
                if (this.componentIsMounted) {
                    this.setState({ pending: false });
                }
            }, 2000);
        }
    };

    render() {
        const { disabled, children, ...rest } = this.props;

        return (
            <button {...rest} disabled={disabled} onClick={this.handleClick}>
                {this.state.pending ? TestingContent.Pending : children}
            </button>
        );
    }
}

export const SubmitComponent = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={() => {}} validateOnChange>
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="givenName"
                                $validation={(value) => !value?.trim() && "Provide a valid given name"}
                                data-testid={DataTestId.GivenName}
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

                        <FieldRowFullWidth>
                            <FC.Submit
                                $component={FunctionalSubmitComponent}
                                $controller={controller}
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                                data-testid={DataTestId.FunctionalSubmit}
                            >
                                Functional Component Submit
                            </FC.Submit>
                        </FieldRowFullWidth>
                        <FieldRowFullWidth>
                            <FC.Submit
                                $component={ClassSubmitComponent}
                                $controller={controller}
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                                data-testid={DataTestId.ClassSubmit}
                            >
                                Class Component Submit
                            </FC.Submit>
                        </FieldRowFullWidth>
                        <FieldRowFullWidth>
                            <ResetButton controller={controller} store={store} />
                        </FieldRowFullWidth>
                        <Info>
                            * Fill all inputs and click on a submit button. Text should change and simulate HTTP request
                            / delay.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
