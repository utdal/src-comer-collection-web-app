import React, { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const AppUserContext = createContext();

export const AppUserProvider = ({ children }) => {
    const [appUser, setAppUser] = useState(null);

    const appUserContextValue = useMemo(() => {
        return {
            appUser,
            setAppUser
        };
    }, [appUser, setAppUser]);

    return (
        <AppUserContext.Provider value={appUserContextValue}>
            {children}
        </AppUserContext.Provider>
    );
};

AppUserProvider.propTypes = {
    children: PropTypes.node.isRequired
};
