import * as React from "react";
import { Controller } from "../controller";
import { PrivateController } from "../private-controller";
import { FormFields } from "../private-controller.types";
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
    const [privateController, setController] = React.useState<PrivateController<T>>();

    React.useEffect(
        () => {
            const controller = new PrivateController<T>({
                disableIf,
                hideIf,
                initialValues,
                options,
                onSubmit,
                requiredInvalidMessage,
                requiredValidMessage,
                setController,
                validateOnBlur,
                validateOnChange,
                validation
            });
            setController(controller);
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [setController, validateOnChange]
    );

    React.useEffect(() => {
        if (privateController) {
            privateController.initialRenderDone();
            privateController.onChange();
        }
    }, [privateController]);

    if (privateController === undefined) {
        return null;
    }

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
