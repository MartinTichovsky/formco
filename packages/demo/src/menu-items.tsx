import {
  CheckboxField,
  CheckboxFieldDefaultValues,
  CheckboxFieldDisabled,
  CheckboxFieldHidden,
  GeneralAsynchronousValidation,
  GeneralCondition,
  GeneralConditionDynamic,
  GeneralDisableAllOnSubmit,
  GeneralLabel,
  GeneralMessageForUseCase1,
  GeneralMessageForUseCase2,
  GeneralRequired,
  GeneralRequiredCommonMessage,
  GeneralScrollToError,
  GeneralValidateOnBlur,
  GeneralValidateOnChange,
  GeneralValidationUseCase1,
  GeneralValidationUseCase2,
  RadioField,
  RadioFieldDefaultValuesUseCase1,
  RadioFieldDefaultValuesUseCase2,
  RadioFieldDisabledUseCase1,
  RadioFieldDisabledUseCase2,
  RadioFieldDisabledUseCase3,
  RadioFieldHiddenUseCase1,
  RadioFieldHiddenUseCase2,
  RadioFieldHiddenUseCase3,
  SelectField,
  SelectFieldComponent,
  SelectFieldOptionDisabled,
  SelectFieldOptionHidden,
  SubmitComponent,
  SubmitCustom,
  SubmitDefaultDisabled,
  SubmitDisabledOnSubmit,
  TextareaField,
  TextField,
  TextFieldComponent,
  TextFieldDefaultValuesUseCase1,
  TextFieldDefaultValuesUseCase2,
  TextFieldDisabledUseCase1,
  TextFieldDisabledUseCase2,
  TextFieldHiddenUseCase1,
  TextFieldHiddenUseCase2,
  TextFieldMessageComponent,
  TextFieldValidationDependencies,
  TextFieldValidationTimeout
} from "examples";
import { Register } from "examples-featured";
import React from "react";
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
  "Featured Examples": [
    {
      label: "Register",
      render: () => <Register />
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
    },
    {
      label: "Validation Timeout",
      render: () => <TextFieldValidationTimeout />
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
      label: "Label",
      render: () => <GeneralLabel />
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
      label: "Scroll to error",
      render: () => <GeneralScrollToError />
    },
    {
      label: "Validate on Blur",
      render: () => <GeneralValidateOnBlur />
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
  text.toLowerCase().replace(/ /g, "-").replace(/(\-)+/, "-");

export const menuItemsWithKey: MenuItemsWithKey = {};

for (let key in menuItems) {
  const title = transformText(key);
  menuItemsWithKey[key] = menuItems[key].map((item) => ({
    ...item,
    key: `${title}-${transformText(item.label)}`
  }));
}
