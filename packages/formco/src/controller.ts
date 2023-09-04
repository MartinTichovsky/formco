import { PrivateController } from "./private-controller";
import { FormFields, MapFields, Value } from "./private-controller.types";

export class Controller<T extends FormFields<T>> {
    constructor(private privateController: PrivateController<T>) {}

    get fields(): Partial<T> {
        return this.privateController.fields;
    }

    get isFormSubmitted() {
        return this.privateController.isSubmitted;
    }

    get isFormValid() {
        return this.privateController.isValid;
    }

    /**
     * Disabling/enabling all fields
     *
     * @param disable true = disable, false = enable
     */
    public disableFields(disable: boolean) {
        this.privateController.disableFields(disable);
    }

    public fillField(value: Value, key: keyof T) {
        //
    }

    /**
     * It returns a stored field value
     *
     * @param key Field key
     * @returns Field value
     */
    public getFieldValue(key: keyof T) {
        return this.privateController.getFieldValue(key);
    }

    /**
     * A helper function for map field values
     *
     * example:
     *
     * formFields = {
     *     age: "10"
     *     checked: undefined,
     *     name: undefined,
     *     undefined: undefined
     * }
     *
     * getMappedFields({
     *     age: Number(),
     *     checked: Boolean(),
     *     name: String(),
     *     undefined: undefined
     * })
     *
     * result => {
     *     age: 10,
     *     checked: false,
     *     name: "",
     *     undefined: undefined
     * }
     *
     * @param map An object of fields and its types defined by Type Constructor such as Number(), Boolean(), String(), etc.
     * @returns An object with fields as keys and mapped values
     */
    public getMappedFields<K extends MapFields<T>>(map: K): { [key in keyof K]: K[key] } {
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

    /**
     * Check if an error can be shown for the specific field. It checks if the
     * field is valid and if form is submitted OR field touched
     *
     * @param key Field key
     * @param formShouldBeSubmitted true = the form must be submitted
     * @param fieldShouldBeTouched true = the field must be touched
     * @returns true if an error can be shown
     */
    public isError(key: keyof T, formShouldBeSubmitted = false, fieldShouldBeTouched = false) {
        const field = this.privateController.getField(key);

        return (
            (!formShouldBeSubmitted ||
                (formShouldBeSubmitted && this.isFormSubmitted) ||
                !fieldShouldBeTouched ||
                (fieldShouldBeTouched && field?.isTouched === true)) &&
            field?.isValid === false &&
            field?.isDisabled === false &&
            field?.isVisible === true
        );
    }

    /**
     * Check if the field is disabled
     * with the field
     *
     * @param key Field key
     * @returns true if the field is disabled
     */
    public isFieldDisabled(key: keyof T) {
        return this.privateController.getField(key)?.isDisabled === true;
    }

    /**
     * Check if the field has been touched. That means if there were a user interaction
     * with the field
     *
     * @param key Field key
     * @returns true if the field has been touched
     */
    public isFieldTouched(key: keyof T) {
        return this.privateController.getField(key)?.isTouched === true;
    }

    /**
     * Check if the field is valid
     *
     * @param key Field key
     * @returns true if the field is valid
     */
    public isFieldValid(key: keyof T) {
        return this.privateController.getField(key)?.isValid === true;
    }

    /**
     * Check if the field is under validation process. It can be a promise
     * which take a while
     *
     * @param key Field key
     * @returns true if there is a validation in progress for the specific field
     */
    public isFieldValidationInProgress(key: keyof T) {
        return this.privateController.isFieldValidationInProgress(key);
    }

    /**
     * Reset all values
     *
     * @param silent itrue = do not re-render the `FormController` children
     */
    public resetForm(silent = false) {
        this.privateController.resetForm(silent);
    }

    /**
     * Submit the form
     */
    public async submit() {
        await this.privateController.submit();
    }

    /**
     * Validate all field values
     *
     * @param force true = validate all fields, already validated included
     */
    public validate(force = false) {
        this.privateController.validate(force);
    }
}
