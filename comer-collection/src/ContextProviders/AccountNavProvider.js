import React, { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const AccountNavContext = createContext();

export const AccountNavProvider = ({ children }) => {
    const [selectedNavItem, setSelectedNavItem] = useState("");

    const accountNavContextValue = useMemo(() => {
        return {
            selectedNavItem,
            setSelectedNavItem
        };
    }, [selectedNavItem, setSelectedNavItem]);

    return (
        <AccountNavContext.Provider value={accountNavContextValue}>
            {children}
        </AccountNavContext.Provider>
    );
};

AccountNavProvider.propTypes = {
    children: PropTypes.node.isRequired
};
