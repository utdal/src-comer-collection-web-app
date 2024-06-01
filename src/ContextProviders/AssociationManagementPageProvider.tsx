import React, { createContext, useContext, useMemo } from "react";
import type { AssociationType, Item } from "..";

interface AssociationManagementPageContextValue {
    relevantPrimaryItems: Item[];
    AssociationType: AssociationType;
}

const AssociationManagementPageContext = createContext((null as unknown) as AssociationManagementPageContextValue);

export const AssociationManagementPageProvider = ({ relevantPrimaryItems, AssociationType, children }: {
    readonly relevantPrimaryItems: Item[];
    readonly AssociationType: AssociationType;
    readonly children: React.ReactNode;
}): React.JSX.Element => {
    const contextValue = useMemo(() => {
        return {
            relevantPrimaryItems, AssociationType
        };
    }, [relevantPrimaryItems, AssociationType]);
    return (
        <AssociationManagementPageContext.Provider value={contextValue}>
            {children}
        </AssociationManagementPageContext.Provider>
    );
};

export const useRelevantPrimaryItems = (): Item[] => {
    return useContext(AssociationManagementPageContext).relevantPrimaryItems;
};

export const useAssociationType = (): AssociationType => {
    return useContext(AssociationManagementPageContext).AssociationType;
};
