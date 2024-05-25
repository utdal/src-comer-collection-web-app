import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import PropTypes from "prop-types";
import { Entity, itemsCombinedStatePropTypeShape } from "../Classes/Entity.js";

/**
 * Return an itemCounts object based on an array of items,
 * and its associated selection and visibility status dictionaries
 * @param {{id: number}[]} items
 * @param {Object<number, boolean>} selectionStatuses
 * @param {Object<number, boolean>} visibilityStatuses
 * @returns {{
 *  all: number,
 *  selected: number,
 *  visible: number,
 *  selectedAndVisible: number
 * }}
*/
const getItemCounts = (items, selectionStatuses, visibilityStatuses) => {
    const itemCounts = {
        all: items.length,
        selected: 0,
        visible: 0,
        selectedAndVisible: 0
    };
    for (const { id } of items) {
        if (selectionStatuses[id]) {
            itemCounts.selected++;
        }
        if (visibilityStatuses[id]) {
            itemCounts.visible++;
        }
        if (selectionStatuses[id] && visibilityStatuses[id]) {
            itemCounts.selectedAndVisible++;
        }
    }
    return itemCounts;
};

const itemsReducer = (state, action) => {
    if (action.type === "setItems") {
        const newSelectionStatuses = {};
        const newVisibilityStatuses = {};

        for (const item of action.items) {
            newSelectionStatuses[item.id] = state.selectionStatuses[item.id] ?? false;
            newVisibilityStatuses[item.id] = state.filterFunction ? state.filterFunction(item) : true;
        }

        return {
            Entity: state.Entity,
            items: action.items,
            selectionStatuses: newSelectionStatuses,
            visibilityStatuses: newVisibilityStatuses,
            filterFunction: state.filterFunction,
            itemCounts: getItemCounts(action.items, newSelectionStatuses, newVisibilityStatuses)
        };
    } else if (action.type === "setSelectedItems") {
        const newSelectionStatuses = {};
        for (const { id } of state.items) {
            newSelectionStatuses[id] = false;
        }
        for (const { id } of action.selectedItems) {
            newSelectionStatuses[id] = true;
        }
        return {
            Entity: state.Entity,
            items: state.items,
            selectionStatuses: newSelectionStatuses,
            visibilityStatuses: state.visibilityStatuses,
            filterFunction: state.filterFunction,
            itemCounts: getItemCounts(state.items, newSelectionStatuses, state.visibilityStatuses)
        };
    } else if (action.type === "filterItems") {
        const filteredItems = state.items.filter(action.filterFunction);
        const newVisibilityStatuses = {};

        for (const { id } of filteredItems) {
            newVisibilityStatuses[id] = true;
        }
        return {
            Entity: state.Entity,
            items: state.items,
            selectionStatuses: state.selectionStatuses,
            visibilityStatuses: newVisibilityStatuses,
            filterFunction: action.filterFunction,
            itemCounts: getItemCounts(state.items, state.selectionStatuses, newVisibilityStatuses)
        };
    } else if (action.type === "setItemSelectionStatus") {
        state.selectionStatuses[action.itemId] = action.newStatus;
        state.itemCounts = getItemCounts(state.items, state.selectionStatuses, state.visibilityStatuses);
        return { ...state };
    } else {
        console.warn("itemsReducer received invalid action object", action);
        return state;
    }
};

const defaultItemsCombinedState = {
    Entity,
    items: [],
    selectionStatuses: {},
    visibilityStatuses: {},
    filterFunction: null,
    itemCounts: {
        all: 0,
        selected: 0,
        visible: 0,
        selectedAndVisible: 0
    }
};

const ManagementPageContext = createContext();

export const ManagementPageProvider = ({ isLoaded, isError, managementCallbacks, itemsCombinedState, setItems, setSelectedItems, setItemSelectionStatus, children }) => {
    const contextValue = useMemo(() => {
        return {
            managementCallbacks,
            itemsCombinedState,
            setItems,
            setSelectedItems,
            setItemSelectionStatus,
            isLoaded,
            isError
        };
    }, [managementCallbacks, itemsCombinedState, setItems, setSelectedItems, setItemSelectionStatus, isLoaded, isError]);
    return (
        <ManagementPageContext.Provider value={contextValue}>
            {children}
        </ManagementPageContext.Provider>
    );
};

ManagementPageProvider.propTypes = {
    children: PropTypes.node.isRequired,
    isError: PropTypes.bool.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    itemsCombinedState: PropTypes.shape(itemsCombinedStatePropTypeShape).isRequired,
    managementCallbacks: PropTypes.objectOf(PropTypes.func).isRequired,
    setItemSelectionStatus: PropTypes.func.isRequired,
    setItems: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired
};

/**
 * @returns {Object.<string, function()>}
 */
export const useManagementCallbacks = () => {
    return useContext(ManagementPageContext).managementCallbacks;
};

/**
 * @returns {[object[], function]} [items, setItems]
 */
export const useItems = () => {
    const { itemsCombinedState, setItems } = useContext(ManagementPageContext);
    return [itemsCombinedState.items, setItems];
};

/**
 * @returns {[object[], function]} [selectedItems, setSelectedItems]
 */
export const useSelectedItems = () => {
    const { setSelectedItems } = useContext(ManagementPageContext);
    return [useMemo(() => [], []), setSelectedItems];
};

/**
 * @returns {[Object<number, boolean>, (itemId: number, newStatus: bool) => void]} [selectionStatuses, setItemSelectionStatus]
 */
export const useSelectionStatuses = () => {
    const { itemsCombinedState, setItemSelectionStatus } = useContext(ManagementPageContext);
    return [itemsCombinedState.selectionStatuses, setItemSelectionStatus];
};

/**
 * @returns {[Object<number, boolean>, (item: object) => boolean]} [visibilityStatuses, filterItems]
 */
export const useVisibilityStatuses = () => {
    const { itemsCombinedState, filterItems } = useContext(ManagementPageContext);
    return [itemsCombinedState.visibilityStatuses, filterItems];
};

/**
 * @returns {{
 *  all: number,
 *  selected: number,
 *  visible: number,
 *  selectedAndVisible: number
 * }}
 */
export const useItemCounts = () => {
    return useContext(ManagementPageContext).itemsCombinedState.itemCounts;
};

/**
 * @returns {Class} type of entity
 */
export const useEntity = () => {
    return useContext(ManagementPageContext).itemsCombinedState.Entity;
};

/**
 * @returns {[isLoaded: boolean, isError: boolean]} [isLoaded, isError]
 */
export const useItemsLoadStatus = () => {
    const { isLoaded, isError } = useContext(ManagementPageContext);
    return [isLoaded, isError];
};

/**
 * @param {Class} Entity
 * @returns {[
 *  {
 *      Entity: class,
 *      items: object[],
 *      selectionStatuses: Object<number, boolean>,
 *      visibilityStatuses: Object<number, boolean>,
 *      filterFunction: (item: object) => boolean | null,
 *      itemCounts: {
 *          all: number,
 *          selected: number,
 *          visible: number,
 *          selectedAndVisible: number
 *      }
 * },
 *  setItems: (items: object[]) => void,
 *  setSelectedItems: (selectedItems: object[]) => void,
 *  filterItems: (filterFunction: (item: object) => boolean) => void,
 *  setItemSelectionStatus: (itemId: number, newStatus: bool) => void]}
 * [itemsCombinedState, setItems, setSelectedItems, filterItems, setItemSelectionStatus]
 */
export const useItemsReducer = (Entity) => {
    const [itemsCombinedState, itemsDispatch] = useReducer(itemsReducer, {
        ...defaultItemsCombinedState,
        Entity
    });
    const setItems = useCallback((items) => {
        itemsDispatch({
            type: "setItems",
            items
        });
    }, []);
    const setSelectedItems = useCallback((selectedItems) => {
        itemsDispatch({
            type: "setSelectedItems",
            selectedItems
        });
    }, []);
    const filterItems = useCallback((filterFunction) => {
        itemsDispatch({
            type: "filterItems",
            filterFunction
        });
    }, []);
    const setItemSelectionStatus = useCallback((itemId, newStatus) => {
        itemsDispatch({
            type: "setItemSelectionStatus",
            itemId,
            newStatus
        });
    }, []);
    return [itemsCombinedState, setItems, setSelectedItems, filterItems, setItemSelectionStatus];
};
