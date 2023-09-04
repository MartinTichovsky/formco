import { Controller } from "../controller";
import { DisableIf, FormFields, HideIf } from "../private-controller.types";

export type ConditionProps<T extends FormFields<T>> = React.PropsWithChildren<
    {
        controller: Controller<T>;
        disableIf?: DisableIf<T>;
        hideIf?: HideIf<T>;
        ifFormValid?: boolean;
        showIf?: () => boolean;
    } & (
        | {
              dynamicContent?: (controller: Controller<T>) => JSX.Element;
              dynamicRender?: undefined;
          }
        | { dynamicContent?: undefined; dynamicRender?: boolean }
    )
>;

export interface ConditionComponentState {
    isVisible: boolean;
}
