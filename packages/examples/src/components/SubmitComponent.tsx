import { Controller, FormController, Input, Submit } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

const FunctionalSubmitComponent = ({
  children,
  disabled,
  onClick,
  ...rest
}: React.PropsWithChildren<{
  disabled: boolean; // required
  onClick: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => Promise<Controller<MyForm>>; // required
}>) => {
  const [pending, setPending] = React.useState(false);
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const controller = await onClick(event);

    if (controller.isValid) {
      console.log(controller.fields);

      setPending(true);

      // simulate HTTML request / delay
      setTimeout(() => {
        // this condition avoids react errors when navigate in the menu
        if (isMounted.current) {
          setPending(false);
        }
      }, 2000);
    }
  };

  return (
    <button {...rest} disabled={disabled} onClick={handleClick}>
      {pending ? "pending..." : children}
    </button>
  );
};

interface ClassSubmitComponentProps {
  disabled: boolean; // required
  onClick: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => Promise<Controller<MyForm>>; // required
}

class ClassSubmitComponent extends React.Component<ClassSubmitComponentProps> {
  state: { pending: false } = { pending: false };
  private componentIsMounted;

  constructor(props: ClassSubmitComponentProps) {
    super(props);
    this.componentIsMounted = true;
  }

  componentWillUnmount() {
    this.componentIsMounted = false;
  }

  handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const controller = await this.props.onClick(event);

    if (controller.isValid) {
      console.log(controller.fields);

      this.setState({ pending: true });

      // simulate HTTML request / delay
      setTimeout(() => {
        // this condition avoids react errors when navigate in the menu
        if (this.componentIsMounted) {
          this.setState({ pending: false });
        }
      }, 2000);
    }
  };

  render() {
    const { disabled, children, ...rest } = this.props;

    return (
      <button {...rest} disabled={disabled} onClick={this.handleClick}>
        {this.state.pending ? "pending..." : children}
      </button>
    );
  }
}

export const SubmitComponent = (
  props: Partial<React.ComponentProps<typeof FormController>>
) => {
  const store = new LogStore();

  return (
    <Template store={store}>
      <FormController<MyForm> {...props} onSubmit={() => {}} validateOnChange>
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="givenName"
                name="givenName"
                placeholder="Input a given name"
                validation={(value) =>
                  !value?.trim() && "Provide a valid given name"
                }
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="surname"
                name="surname"
                placeholder="Input a surname"
                validation={(value) =>
                  !value?.trim() && "Provide a valid surname"
                }
              />
            </div>
            <div className="field-row full-width">
              <Submit
                ButtonComponent={FunctionalSubmitComponent}
                controller={controller}
                data-testid="functional-submit"
                onSubmit={(fields, controller) =>
                  store.onSubmit(fields, controller)
                }
              >
                Functional Component Submit
              </Submit>
            </div>
            <div className="field-row full-width">
              <Submit
                ButtonComponent={ClassSubmitComponent}
                controller={controller}
                data-testid="class-submit"
                onSubmit={(fields, controller) =>
                  store.onSubmit(fields, controller)
                }
              >
                Class Component Submit
              </Submit>
            </div>
            <div className="field-row full-width">
              <button
                data-testid="reset"
                onClick={() => {
                  controller.resetForm();
                  store.reset();
                }}
                type="button"
              >
                Reset
              </button>
            </div>
            <div className="info">
              * Fill all inputs and click on a submit button. Text should change
              and simulate HTTP request / delay.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
