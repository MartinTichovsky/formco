import { ValidationPromiseResult } from "formco";

export interface Api {
    body: Record<string, string>;
    errorMessage: string;
    fetchController: React.MutableRefObject<AbortController | undefined>;
    id: string;
    resolve: (result: ValidationPromiseResult) => void;
    url: string;
}

export interface RegisterForm {
    email: string;
    username: string;
}
