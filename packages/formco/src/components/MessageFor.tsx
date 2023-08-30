import * as React from "react";
import { FormFields, ValidationContentResult } from "../private-controller.types";
import { usePrivateController } from "../providers";
import { MessageForProps, MessageForState } from "./MessageFor.types";

export const MessageFor = <T extends FormFields<T>, K extends keyof T>({
    children,
    isValid,
    name
}: MessageForProps<T, K>) => {
    const privateController = usePrivateController<T>();
    const [state, setState] = React.useState<MessageForState>({
        message: undefined,
        isVisible: false
    });
    const stateRef = React.useRef<MessageForState>();
    stateRef.current = state;

    React.useEffect(() => {
        const onValidation = {
            action: (show: boolean, fieldIsValid: boolean, validationResult: ValidationContentResult) => {
                if (
                    show &&
                    ((isValid && fieldIsValid) || (!isValid && !fieldIsValid)) &&
                    (!stateRef.current!.isVisible || (!children && stateRef.current!.message !== validationResult))
                ) {
                    setState({ isVisible: true, message: validationResult });
                } else if (
                    (!show || (isValid && !fieldIsValid) || (!isValid && fieldIsValid)) &&
                    stateRef.current!.isVisible
                ) {
                    setState({ isVisible: false, message: undefined });
                }
            },
            key: name
        };

        privateController.subscribeOnValidation(onValidation);

        return () => {
            privateController.unsubscribeOnValidation(onValidation);
        };
    }, [privateController, stateRef, setState]);

    return <>{state.isVisible && (children ? children : state.message)}</>;
};
