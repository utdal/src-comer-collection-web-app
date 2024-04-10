import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const AccountNavContext = createContext();
export const AccountNavProvider = ({ children }) => {
    const [selectedNavItem, setSelectedNavItem] = useState("");

    return (
        <AccountNavContext.Provider value={{ selectedNavItem, setSelectedNavItem }}>
            {children}
        </AccountNavContext.Provider>
    );
};
AccountNavProvider.propTypes = {
    children: PropTypes.node
};


export const useAccountNav = () => {
    const { selectedNavItem, setSelectedNavItem } = useContext(AccountNavContext);
    return [selectedNavItem, setSelectedNavItem];
};
