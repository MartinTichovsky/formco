import * as React from "react";
import { Controller } from "../controller";
import { PrivateController } from "../private-controller";
import { FormFields, PrivateControllerSetKey } from "../private-controller.types";
import { getControllerProviderContext } from "../providers";
import { FormControllerComponentProps } from "./FormController.types";

export const FormControllerComponent = <T extends FormFields<T>>({
    children,
    className,
    disableIf,
    hideIf,
    initialValues,
    options,
    onSubmit,
    requiredInvalidMessage,
    requiredValidMessage,
    validateOnBlur = false,
    validateOnChange = false,
    validation,
    ...rest
}: FormControllerComponentProps<T>) => {
    const [state, setFormControllerState] = React.useState<PrivateControllerSetKey>({ key: 0, silent: false });

    const privateController = React.useMemo(
        () =>
            new PrivateController<T>({
                disableIf,
                hideIf,
                initialValues,
                options,
                onSubmit,
                requiredInvalidMessage,
                requiredValidMessage,
                setFormControllerState,
                silent: state.silent,
                validateOnBlur,
                validateOnChange,
                validation
            }),
        [state.key, state.silent, setFormControllerState, validateOnChange]
    );

    React.useEffect(() => {
        if (privateController) {
            privateController.initialRenderDone();
            privateController.onChange();
        }
    }, [privateController]);

    const privateControllerContext = getControllerProviderContext<T>();

    return (
        <privateControllerContext.Provider value={privateController}>
            <form
                {...rest}
                aria-label="form"
                className={"form-controller" + (className ? ` ${className}` : "")}
                key={privateController.key}
                onSubmit={(event) => event.preventDefault()}
            >
                {children(new Controller(privateController))}
            </form>
        </privateControllerContext.Provider>
    );
};
