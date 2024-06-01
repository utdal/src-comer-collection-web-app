import React, { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { ManagementPageProvider, useItemCounts, useItems } from "./ManagementPageProvider";
import { entityPropTypeShape, itemsCombinedStatePropTypeShape } from "../Classes/Entity.ts";

const AssociationManagementPageContext = createContext();
const defaultManagementCallbacks = {};

export const AssociationManagementPageProvider = ({ managementCallbacks = defaultManagementCallbacks, secondaryItemsCombinedState, secondaryItemsCallbacks, relevantPrimaryItems, AssociationType, children }) => {
    const contextValue = useMemo(() => {
        return {
            relevantPrimaryItems: relevantPrimaryItems ?? [], AssociationType
        };
    }, [relevantPrimaryItems, AssociationType]);
    return (
        <AssociationManagementPageContext.Provider value={contextValue}>
            <ManagementPageProvider
                Entity={AssociationType.secondary}
                isError={false}
                isLoaded={false}
                itemsCallbacks={secondaryItemsCallbacks}
                itemsCombinedState={secondaryItemsCombinedState}
                managementCallbacks={managementCallbacks}
            >
                {children}
            </ManagementPageProvider>
        </AssociationManagementPageContext.Provider>
    );
};

AssociationManagementPageProvider.propTypes = {
    AssociationType: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    managementCallbacks: PropTypes.objectOf(PropTypes.func),
    relevantPrimaryItems: PropTypes.arrayOf(entityPropTypeShape).isRequired,
    secondaryItemsCallbacks: PropTypes.objectOf(PropTypes.func),
    secondaryItemsCombinedState: itemsCombinedStatePropTypeShape.isRequired
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
