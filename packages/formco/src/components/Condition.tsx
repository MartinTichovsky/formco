import * as React from "react";
import { FormFields } from "../private-controller.types";
import { usePrivateController } from "../providers";
import { ConditionProps } from "./Condition.types";
import { ConditionComponent } from "./ConditionComponent";

export const Condition = <T extends FormFields<T>>(props: ConditionProps<T>) => {
    const privateController = usePrivateController<T>();

    if (props.showIf !== undefined && typeof props.showIf !== "function") {
        throw new Error("CustomCondition is not a function");
    }

    if (props.dynamicContent !== undefined && typeof props.dynamicContent !== "function") {
        throw new Error("DynamicContent is not a function");
    }

    return <ConditionComponent {...props} privateController={privateController} />;
};
