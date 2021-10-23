import { Controller } from "../controller";
import { FormFields } from "../private-controller.types";

export type ConditionProps<T extends FormFields<T>> = React.PropsWithChildren<
  {
    controller: Controller<T>;
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
