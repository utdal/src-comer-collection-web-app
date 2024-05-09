import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";

const ManagementPageContext = createContext();

export const ManagementPageProvider = ({ managementCallbacks, children }) => {
    return (
        <ManagementPageContext.Provider value={{ managementCallbacks }}>
            {children}
        </ManagementPageContext.Provider>
    );
};

ManagementPageProvider.propTypes = {
    managementCallbacks: PropTypes.object,
    children: PropTypes.node
};

/**
 * @returns {Object.<string, function>}
 */
export const useManagementCallbacks = () => {
    return useContext(ManagementPageContext).managementCallbacks;
};
