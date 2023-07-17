import {
    redirect,
} from "react-router-dom";

export function redirectAction() {
    return redirect(`/${Date.now().toString(16)}`);
}