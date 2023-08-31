import * as React from "react";
import { Controller } from "../../controller";
import { FormFields, PrivateProps } from "../../private-controller.types";
import { SubmitComponentType, SubmitPrivateProps } from "./Submit.types";

export const SubmitComponent = <
    T extends FormFields<T>,
    BComponent extends React.ComponentType<React.ComponentProps<BComponent> & SubmitPrivateProps<T>>
>({
    component: Component,
    disabledByDefault = false,
    disableIfNotValid = false,
    onClick,
    onSubmit,
    children,
    privateController,
    rest
}: React.PropsWithChildren<SubmitComponentType<T, BComponent>> & PrivateProps<T>) => {
    const [isDisabled, setDisabled] = React.useState(disabledByDefault === true);

    const ButtonElement = React.useCallback(
        (props: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) =>
            Component ? (
                React.createElement(Component, {
                    ...rest,
                    ...props
                } as React.ComponentProps<React.ElementType>)
            ) : (
                <button {...props} type="button">
                    {props.children}
                </button>
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [Component]
    );

    const handleClick = React.useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(event);

            await privateController.submit();

            onSubmit?.(privateController.fields, new Controller(privateController));

            return new Controller(privateController);
        },
        [privateController]
    );

    React.useEffect(() => {
        if (disableIfNotValid) {
            const onChangeAction = (isValid: boolean) => {
                setDisabled((privateController.isSubmitted || disabledByDefault) && !isValid);
            };

            privateController.subscribeOnChange(onChangeAction);

            return () => {
                privateController.unsubscribeOnChange(onChangeAction);
            };
        }
    }, [privateController, disableIfNotValid, setDisabled]);

    React.useEffect(() => {
        const onDisableAction = (disable: boolean) => {
            setDisabled(disable);
        };

        privateController.subscribeOnDisableButton(onDisableAction);

        return () => {
            privateController.unsubscribeOnDisableButton(onDisableAction);
        };
    }, [privateController, setDisabled]);

    return (
        <ButtonElement {...rest} disabled={isDisabled} onClick={handleClick}>
            {children}
        </ButtonElement>
    );
};
