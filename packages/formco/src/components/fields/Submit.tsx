import * as React from "react";
import { FormFields } from "../../private-controller.types";
import { usePrivateController } from "../../providers";
import { SubmitPrivateProps, SubmitType } from "./Submit.types";
import { SubmitComponent } from "./SubmitComponent";

export const Submit = <
    T extends FormFields<T>,
    BComponent extends React.ComponentType<React.ComponentProps<BComponent> & SubmitPrivateProps<T>>
>({
    $component,
    $controller,
    $disableIfNotValid,
    $disabledByDefault,
    $onClick,
    $onSubmit,
    children,
    ...rest
}: React.PropsWithChildren<SubmitType<T, BComponent>>) => {
    const privateController = usePrivateController<T>();

    if ($onSubmit !== undefined && typeof $onSubmit !== "function") {
        throw new Error("OnSubmit is not a function");
    }

    return (
        <SubmitComponent
            children={children}
            component={$component}
            controller={$controller}
            data-testid={rest["data-testid"]}
            disableIfNotValid={$disableIfNotValid}
            disabledByDefault={$disabledByDefault}
            onClick={$onClick}
            onSubmit={$onSubmit}
            privateController={privateController}
            rest={rest}
        />
    );
};
