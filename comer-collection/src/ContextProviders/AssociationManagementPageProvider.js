import React, { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { ManagementPageProvider, useItemCounts, useItems } from "./ManagementPageProvider.js";
import { entityPropTypeShape, itemsCombinedStatePropTypeShape } from "../Classes/Entity.js";

const AssociationManagementPageContext = createContext();
const defaultManagementCallbacks = {};

export const AssociationManagementPageProvider = ({ managementCallbacks = defaultManagementCallbacks, secondaryItemsCombinedState, setSecondaryItems, setSelectedSecondaryItems, relevantPrimaryItems, AssociationType, children }) => {
    const contextValue = useMemo(() => {
        return {
            relevantPrimaryItems, AssociationType
        };
    }, [relevantPrimaryItems, AssociationType]);
    return (
        <AssociationManagementPageContext.Provider value={contextValue}>
            <ManagementPageProvider
                itemsCombinedState={secondaryItemsCombinedState}
                managementCallbacks={managementCallbacks}
                setItems={setSecondaryItems}
                setSelectedItems={setSelectedSecondaryItems}
            >
                {children}
            </ManagementPageProvider>
        </AssociationManagementPageContext.Provider>
    );
};

AssociationManagementPageProvider.propTypes = {
    AssociationType: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    managementCallbacks: PropTypes.objectOf(PropTypes.func),
    relevantPrimaryItems: PropTypes.arrayOf(entityPropTypeShape).isRequired,
    secondaryItemsCombinedState: PropTypes.exact(itemsCombinedStatePropTypeShape).isRequired,
    setSecondaryItems: PropTypes.func.isRequired,
    setSelectedSecondaryItems: PropTypes.func.isRequired
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
 * Copy of useItemCounts for use inside Association contexts.  Renamed for clarity.
 */
export const useSecondaryItemCounts = () => {
    return useItemCounts();
};
