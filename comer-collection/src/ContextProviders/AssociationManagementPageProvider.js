import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { ManagementPageProvider, useItems, useVisibleItems } from "./ManagementPageProvider.js";

const AssociationManagementPageContext = createContext();

export const AssociationManagementPageProvider = ({ managementCallbacks, secondaryItemsCombinedState, setSecondaryItems, setSelectedSecondaryItems, relevantPrimaryItems, AssociationType, children }) => {
    return (
        <AssociationManagementPageContext.Provider
            value={{ relevantPrimaryItems, AssociationType }}
        >
            <ManagementPageProvider
                itemsCombinedState={secondaryItemsCombinedState}
                setItems={setSecondaryItems}
                setSelectedItems={setSelectedSecondaryItems}
                {...{ managementCallbacks }}
            >
                {children}
            </ManagementPageProvider>
        </AssociationManagementPageContext.Provider>
    );
};

AssociationManagementPageProvider.propTypes = {
    AssociationType: PropTypes.any,
    managementCallbacks: PropTypes.object,
    secondaryItemsCombinedState: PropTypes.object,
    setSecondaryItems: PropTypes.func,
    setSelectedSecondaryItems: PropTypes.func,
    relevantPrimaryItems: PropTypes.array,
    children: PropTypes.node
};

/**
 * @returns {Object[]}
 */
export const useRelevantPrimaryItems = () => {
    return useContext(AssociationManagementPageContext).relevantPrimaryItems;
};

/**
 * @returns {class}
 */
export const useAssociationType = () => {
    return useContext(AssociationManagementPageContext).AssociationType;
};

/**
 * @returns {[object[], function]} [secondaryItems, setSecondaryItems]
 */
export const useSecondaryItems = () => {
    return useItems();
};

/**
 * @returns {[object[], function]} [visibleSecondaryItems, filterSecondaryItems]
 */
export const useVisibleSecondaryItems = () => {
    return useVisibleItems();
};
