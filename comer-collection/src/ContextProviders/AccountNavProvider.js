import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const AccountNavContext = createContext();

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

export const useAccountNav = () => {
    const { selectedNavItem, setSelectedNavItem } = useContext(AccountNavContext);
    return [selectedNavItem, setSelectedNavItem];
};

export const useAccountNavTitle = (newNavItemTitle) => {
    const { setSelectedNavItem } = useContext(AccountNavContext);
    useEffect(() => {
        setSelectedNavItem(newNavItemTitle);
    }, [newNavItemTitle, setSelectedNavItem]);
};
