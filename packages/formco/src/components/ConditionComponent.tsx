import * as React from "react";
import { Controller } from "../controller";
import { FormFields, PrivateProps } from "../private-controller.types";
import { ConditionComponentState, ConditionProps } from "./Condition.types";

export const ConditionComponent = <T extends FormFields<T>>({
    children,
    dynamicContent,
    dynamicRender,
    ifFormValid,
    privateController,
    showIf
}: ConditionProps<T> & PrivateProps<T>) => {
    const [state, setState] = React.useState<ConditionComponentState>({
        isVisible: false
    });
    const stateRef = React.useRef<ConditionComponentState>();
    stateRef.current = state;

    const key = React.useRef(0);

    if (dynamicRender) {
        key.current++;
    }

    React.useEffect(() => {
        const action = (isValid: boolean) => {
            const setStateOnNotVisible = dynamicRender || dynamicContent || !stateRef.current!.isVisible;
            const setStateOnVisible = dynamicRender || dynamicContent || stateRef.current!.isVisible;

            if (ifFormValid === undefined && showIf === undefined && setStateOnNotVisible) {
                setState({ isVisible: true });
            } else if (ifFormValid !== undefined && showIf === undefined) {
                isValid
                    ? setStateOnNotVisible && setState({ isVisible: true })
                    : setStateOnVisible && setState({ isVisible: false });
            } else if (ifFormValid === undefined && showIf !== undefined) {
                showIf()
                    ? setStateOnNotVisible && setState({ isVisible: true })
                    : setStateOnVisible && setState({ isVisible: false });
            } else if (ifFormValid !== undefined && showIf !== undefined) {
                isValid && showIf()
                    ? setStateOnNotVisible && setState({ isVisible: true })
                    : setStateOnVisible && setState({ isVisible: false });
            }
        };

        privateController.subscribeOnChange(action);

        return () => {
            privateController.unsubscribeOnChange(action);
        };
    }, [privateController, ifFormValid, stateRef, showIf]);

    return (
        <>
            {state.isVisible &&
                (dynamicContent ? (
                    <React.Fragment>{dynamicContent(new Controller(privateController))}</React.Fragment>
                ) : (
                    <React.Fragment key={key.current}>{children}</React.Fragment>
                ))}
        </>
    );
};
