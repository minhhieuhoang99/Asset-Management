import { createContext } from "react";

const CurrentUserContext = createContext({
    token: null,
    role : null,
    location: null,
    code: null,
    firstLogin : null,
    user: null,
});

export default CurrentUserContext;