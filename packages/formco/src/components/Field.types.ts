import { Controller } from "../controller";
import { FormFields } from "../controller.types";

export interface FieldType<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<React.ComponentProps<IComponent>>
> {
  ({
    children,
    component,
    controller,
    name,
    onValidation,
    validation,
    ...rest
  }: React.PropsWithChildren<
    {
      component: IComponent;
      controller: Controller<T>;
      id?: string;
      name: K;
      onValidation?: (
        isValid: boolean,
        setProps: React.Dispatch<React.SetStateAction<typeof rest>>
      ) => void;
      validation?: (
        value: T[K] | undefined,
        fields: Partial<T>,
        props: typeof rest
      ) => boolean;
    } & React.ComponentPropsWithoutRef<IComponent>
  >): JSX.Element | null;
}
