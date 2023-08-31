import { ValidationPromiseResult } from "formco";
import { FetchController } from "../../utils/FetchController";

export interface Api {
    body: Record<string, string>;
    errorMessage: string;
    fetchController: FetchController<RegisterForm>;
    id: keyof RegisterForm;
    invalidTestId: string;
    resolve: (result: ValidationPromiseResult) => void;
    url: string;
    validTestId: string;
}

export interface RegisterForm {
    email: string;
    username: string;
}
