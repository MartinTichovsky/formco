import * as React from "react";
import { CommonFormFieldProps } from "./components/fields/FormField.types";
import { PrivateController } from "./private-controller";
import { DisableIf, FormFields, HideIf } from "./private-controller.types";
import { SelectProviderProps, ValidationAction, ValidationProviderProps } from "./providers.types";

export const commonPropsContext = React.createContext<CommonFormFieldProps>({});

export const disableIfContext = React.createContext<DisableIf<{}> | undefined>(undefined);

export const hideIfContext = React.createContext<HideIf<{}> | undefined>(undefined);

export const privateControllerContext = React.createContext<PrivateController<{}> | undefined>(undefined);

export const selectContext = React.createContext<SelectProviderProps | undefined>(undefined);

export const validationContext = React.createContext<ValidationAction | undefined>(undefined);

export const getControllerProviderContext = <T extends FormFields<T>>() =>
    privateControllerContext as React.Context<PrivateController<T> | undefined>;

export const usePrivateController = <T extends FormFields<T>>(): PrivateController<T> => {
    const controller = React.useContext<PrivateController<T> | undefined>(getControllerProviderContext<T>());

    if (!controller) {
        throw Error("Controller is not provided. Every component from formco must be inside FormController.");
    }

    return controller;
};

export const SelectProvider = ({ children, ...rest }: React.PropsWithChildren<SelectProviderProps>) => {
    return <selectContext.Provider value={rest}>{children}</selectContext.Provider>;
};

export const ValidationProvider = <T extends FormFields<T>>({
    children,
    disableIf,
    hideIf,
    validation,
    ...commonProps
}: React.PropsWithChildren<ValidationProviderProps<T>>) => {
    let result = <>{children}</>;

    if (Object.keys(commonProps).length > 0) {
        const commonPropsMemo = React.useMemo(
            () => ({
                $hideMessage: commonProps.hideMessage,
                $hideRequiredStar: commonProps.hideRequiredStar,
                $required: commonProps.required,
                $requiredComponent: commonProps.requiredComponent,
                $requiredInvalidMessage: commonProps.requiredInvalidMessage,
                $requiredValidMessage: commonProps.requiredValidMessage
            }),
            [
                commonProps.hideMessage,
                commonProps.hideRequiredStar,
                commonProps.required,
                commonProps.requiredComponent,
                commonProps.requiredInvalidMessage,
                commonProps.requiredValidMessage
            ]
        );

        result = <commonPropsContext.Provider value={commonPropsMemo}>{result}</commonPropsContext.Provider>;
    }

    if (disableIf) {
        result = <disableIfContext.Provider value={disableIf}>{result}</disableIfContext.Provider>;
    }

    if (hideIf) {
        result = <hideIfContext.Provider value={hideIf}>{result}</hideIfContext.Provider>;
    }

    if (validation) {
        result = <validationContext.Provider value={validation}>{result}</validationContext.Provider>;
    }

    return result;
};
