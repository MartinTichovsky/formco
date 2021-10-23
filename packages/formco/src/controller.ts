import { PrivateController } from "./private-controller";
import { FormFields, MapFields } from "./private-controller.types";

export class Controller<T extends FormFields<T>> {
  constructor(private privateController: PrivateController<T>) {}

  get fields(): Partial<T> {
    return this.privateController.fields;
  }

  get isSubmitted() {
    return this.privateController.isSubmitted;
  }

  get isValid() {
    return this.privateController.isValid;
  }

  disableFields(disable: boolean) {
    this.privateController.disableFields(disable);
  }

  getFieldValue(key: keyof T) {
    return this.privateController.getFieldValue(key);
  }

  public getMappedFields<K extends MapFields<T>>(
    map: K
  ): { [key in keyof K]: K[key] } {
    const mapped: { [key in keyof K]?: unknown } = {};
    const fields = this.fields;

    for (let key of Object.keys(map)) {
      if (typeof map[key] === "number") {
        mapped[key] = parseInt(fields[key]?.toString() || "");
      } else if (typeof map[key] === "string") {
        mapped[key] = fields[key]?.toString() || "";
      } else if (typeof map[key] === "boolean") {
        mapped[key] = fields[key] === true;
      } else {
        mapped[key] = fields[key];
      }
    }

    return mapped as { [key in keyof K]: K[key] };
  }

  public isFieldValidationInProgress(key: keyof T) {
    return this.privateController.isFieldValidationInProgress(key);
  }

  resetForm() {
    this.privateController.resetForm();
  }

  async submit() {
    await this.privateController.submit();
  }

  validate(silent: boolean) {
    this.privateController.validate(silent);
  }
}
