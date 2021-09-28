import { CheckboxField } from "formco/lib/examples/CheckboxField";
import { CheckboxFieldDefaultValues } from "formco/lib/examples/CheckboxFieldDefaultValues";
import { CheckboxFieldDisabled } from "formco/lib/examples/CheckboxFieldDisabled";
import { CheckboxFieldHidden } from "formco/lib/examples/CheckboxFieldHidden";
import { GeneralAsynchronousValidation } from "formco/lib/examples/GeneralAsynchronousValidation";
import { GeneralCondition } from "formco/lib/examples/GeneralCondition";
import { GeneralConditionDynamic } from "formco/lib/examples/GeneralConditionDynamic";
import { GeneralDisableAllOnSubmit } from "formco/lib/examples/GeneralDisableAllOnSubmit";
import { GeneralLabel } from "formco/lib/examples/GeneralLabel";
import { GeneralMessageForUseCase1 } from "formco/lib/examples/GeneralMessageForUseCase1";
import { GeneralMessageForUseCase2 } from "formco/lib/examples/GeneralMessageForUseCase2";
import { GeneralRequired } from "formco/lib/examples/GeneralRequired";
import { GeneralRequiredCommonMessage } from "formco/lib/examples/GeneralRequiredCommonMessage";
import { GeneralValidateOnChange } from "formco/lib/examples/GeneralValidateOnChange";
import { GeneralValidationUseCase1 } from "formco/lib/examples/GeneralValidationUseCase1";
import { GeneralValidationUseCase2 } from "formco/lib/examples/GeneralValidationUseCase2";
import { RadioField } from "formco/lib/examples/RadioField";
import { RadioFieldDefaultValuesUseCase1 } from "formco/lib/examples/RadioFieldDefaultValuesUseCase1";
import { RadioFieldDefaultValuesUseCase2 } from "formco/lib/examples/RadioFieldDefaultValuesUseCase2";
import { RadioFieldDisabledUseCase1 } from "formco/lib/examples/RadioFieldDisabledUseCase1";
import { RadioFieldDisabledUseCase2 } from "formco/lib/examples/RadioFieldDisabledUseCase2";
import { RadioFieldDisabledUseCase3 } from "formco/lib/examples/RadioFieldDisabledUseCase3";
import { RadioFieldHiddenUseCase1 } from "formco/lib/examples/RadioFieldHiddenUseCase1";
import { RadioFieldHiddenUseCase2 } from "formco/lib/examples/RadioFieldHiddenUseCase2";
import { RadioFieldHiddenUseCase3 } from "formco/lib/examples/RadioFieldHiddenUseCase3";
import { SelectField } from "formco/lib/examples/SelectField";
import { SelectFieldComponent } from "formco/lib/examples/SelectFieldComponent";
import { SelectFieldOptionDisabled } from "formco/lib/examples/SelectFieldOptionDisabled";
import { SelectFieldOptionHidden } from "formco/lib/examples/SelectFieldOptionHidden";
import { SubmitComponent } from "formco/lib/examples/SubmitComponent";
import { SubmitCustom } from "formco/lib/examples/SubmitCustom";
import { SubmitDefaultDisabled } from "formco/lib/examples/SubmitDefaultDisabled";
import { SubmitDisabledOnSubmit } from "formco/lib/examples/SubmitDisabledOnSubmit";
import { TextareaField } from "formco/lib/examples/TextareaField";
import { TextField } from "formco/lib/examples/TextField";
import { TextFieldComponent } from "formco/lib/examples/TextFieldComponent";
import { TextFieldDefaultValuesUseCase1 } from "formco/lib/examples/TextFieldDefaultValuesUseCase1";
import { TextFieldDefaultValuesUseCase2 } from "formco/lib/examples/TextFieldDefaultValuesUseCase2";
import { TextFieldDisabledUseCase1 } from "formco/lib/examples/TextFieldDisabledUseCase1";
import { TextFieldDisabledUseCase2 } from "formco/lib/examples/TextFieldDisabledUseCase2";
import { TextFieldHiddenUseCase1 } from "formco/lib/examples/TextFieldHiddenUseCase1";
import { TextFieldHiddenUseCase2 } from "formco/lib/examples/TextFieldHiddenUseCase2";
import { TextFieldMessageComponent } from "formco/lib/examples/TextFieldMessageComponent";
import { TextFieldValidationDependencies } from "formco/lib/examples/TextFieldValidationDependencies";
import { ContentWithColoredInputs } from "./App.styles";
import { Info } from "./Info";

interface MenuIitem {
  label: string;
  render: () => JSX.Element;
}

interface MenuIitemWithKey extends MenuIitem {
  key: string;
}

interface MenuItems {
  [key: string]: MenuIitem[];
}

interface MenuItemsWithKey {
  [key: string]: MenuIitemWithKey[];
}

const menuItems: MenuItems = {
  "About Examples": [
    {
      label: "Info",
      render: () => <Info />
    }
  ],
  "Checkbox Fields": [
    {
      label: "Basic Checkbox Field",
      render: () => <CheckboxField />
    },
    {
      label: "Disabled",
      render: () => <CheckboxFieldDisabled />
    },
    {
      label: "Default Values",
      render: () => <CheckboxFieldDefaultValues />
    },
    {
      label: "Hidden",
      render: () => <CheckboxFieldHidden />
    }
  ],
  "Radio Fields": [
    {
      label: "Basic Radio Fields",
      render: () => <RadioField />
    },
    {
      label: "Default Values - UseCase 1",
      render: () => <RadioFieldDefaultValuesUseCase1 />
    },
    {
      label: "Default Values - UseCase 2",
      render: () => <RadioFieldDefaultValuesUseCase2 />
    },
    {
      label: "Disabled - UseCase 1",
      render: () => <RadioFieldDisabledUseCase1 />
    },
    {
      label: "Disabled - UseCase 2",
      render: () => <RadioFieldDisabledUseCase2 />
    },
    {
      label: "Disabled - UseCase 3",
      render: () => <RadioFieldDisabledUseCase3 />
    },
    {
      label: "Hidden - UseCase 1",
      render: () => <RadioFieldHiddenUseCase1 />
    },
    {
      label: "Hidden - UseCase 2",
      render: () => <RadioFieldHiddenUseCase2 />
    },
    {
      label: "Hidden - UseCase 3",
      render: () => <RadioFieldHiddenUseCase3 />
    }
  ],
  "Select Fields": [
    {
      label: "Basic Select Field",
      render: () => <SelectField />
    },
    {
      label: "Select Component",
      render: () => <SelectFieldComponent />
    }
  ],
  "Select Field Options": [
    {
      label: "Disabled",
      render: () => <SelectFieldOptionDisabled />
    },
    {
      label: "Hidden",
      render: () => <SelectFieldOptionHidden />
    }
  ],
  Submit: [
    {
      label: "Disabled Submit by Default",
      render: () => <SubmitDefaultDisabled />
    },
    {
      label: "Disabled Submit After Click",
      render: () => <SubmitDisabledOnSubmit />
    },
    {
      label: "Submit Component",
      render: () => <SubmitComponent />
    },
    {
      label: "Submit Custom",
      render: () => <SubmitCustom />
    }
  ],
  "Text Fields": [
    {
      label: "Basic Text Fields",
      render: () => <TextField />
    },
    {
      label: "Disabled - UseCase 1",
      render: () => <TextFieldDisabledUseCase1 />
    },
    {
      label: "Disabled - UseCase 2",
      render: () => <TextFieldDisabledUseCase2 />
    },
    {
      label: "Default Values - UseCase 1",
      render: () => <TextFieldDefaultValuesUseCase1 />
    },
    {
      label: "Default Values - UseCase 2",
      render: () => <TextFieldDefaultValuesUseCase2 />
    },
    {
      label: "Message Component",
      render: () => <TextFieldMessageComponent />
    },
    {
      label: "Hidden - UseCase 1",
      render: () => <TextFieldHiddenUseCase1 />
    },
    {
      label: "Hidden - UseCase 2",
      render: () => <TextFieldHiddenUseCase2 />
    },
    {
      label: "Input Component",
      render: () => <TextFieldComponent />
    },
    {
      label: "Validation Dependencies",
      render: () => <TextFieldValidationDependencies />
    }
  ],
  "Textarea Fields": [
    {
      label: "Basic Textarea Fields",
      render: () => <TextareaField />
    }
  ],
  General: [
    {
      label: "Asynchronous Validation",
      render: () => <GeneralAsynchronousValidation />
    },
    {
      label: "Condition",
      render: () => <GeneralCondition />
    },
    {
      label: "Condition - Dynamic",
      render: () => <GeneralConditionDynamic />
    },
    {
      label: "Disable All on Submit",
      render: () => <GeneralDisableAllOnSubmit />
    },
    {
      label: "Required",
      render: () => (
        <ContentWithColoredInputs>
          <GeneralRequired />
        </ContentWithColoredInputs>
      )
    },
    {
      label: "Required - With Common message",
      render: () => (
        <ContentWithColoredInputs>
          <GeneralRequiredCommonMessage />
        </ContentWithColoredInputs>
      )
    },
    {
      label: "MessageFor - UseCase 1",
      render: () => <GeneralMessageForUseCase1 />
    },
    {
      label: "MessageFor - UseCase 2",
      render: () => <GeneralMessageForUseCase2 />
    },
    {
      label: "Label",
      render: () => <GeneralLabel />
    },
    {
      label: "Validate on Change",
      render: () => <GeneralValidateOnChange />
    },
    {
      label: "Validation - UseCase 1",
      render: () => <GeneralValidationUseCase1 />
    },
    {
      label: "Validation - UseCase 2",
      render: () => <GeneralValidationUseCase2 />
    }
  ]
};

const transformText = (text: string) =>
  // eslint-disable-next-line
  text.toLowerCase().replaceAll(" ", "-").replace(/(\-)+/, "-");

export const menuItemsWithKey: MenuItemsWithKey = {};

for (let key in menuItems) {
  const title = transformText(key);
  menuItemsWithKey[key] = menuItems[key].map((item) => ({
    ...item,
    key: `${title}-${transformText(item.label)}`
  }));
}
