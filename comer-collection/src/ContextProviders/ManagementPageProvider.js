import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import PropTypes from "prop-types";
import { itemsCombinedStatePropTypeShape } from "../Classes/Entity.js";

const itemsReducer = (state, action) => {
    if (action.type === "setItems") {
        const filteredItems = state.filterFunction ? action.items.filter(state.filterFunction) : action.items;
        return {
            items: action.items,
            selectedItems: state.selectedItems.filter((si) => (
                action.items.map((i) => i.id).includes(parseInt(si.id))
            )),
            visibleItems: filteredItems,
            selectedVisibleItems: filteredItems.filter((si) => (
                state.selectedItems.map((i) => i.id).includes(parseInt(si.id))
            )),
            filterFunction: state.filterFunction
        };
    } else if (action.type === "setSelectedItems") {
        return {
            items: state.items,
            selectedItems: action.selectedItems,
            visibleItems: state.visibleItems,
            selectedVisibleItems: state.selectedVisibleItems.filter((si) => (
                action.selectedItems.map((i) => i.id).includes(parseInt(si.id))
            )),
            filterFunction: state.filterFunction
        };
    } else if (action.type === "filterItems") {
        const filteredItems = state.items.filter(action.filterFunction);
        return {
            items: state.items,
            selectedItems: state.selectedItems,
            visibleItems: filteredItems,
            selectedVisibleItems: filteredItems.filter((si) => (
                state.selectedItems.map((i) => i.id).includes(parseInt(si.id))
            )),
            filterFunction: action.filterFunction
        };
    } else {
        console.warn("itemsReducer received invalid action object", action);
        return state;
    }
};

const defaultItemsCombinedState = {
    Entity: null,
    items: [],
    selectedItems: [],
    visibleItems: [],
    selectedVisibleItems: [],
    filterFunction: null
};

const ManagementPageContext = createContext();

export const ManagementPageProvider = ({ Entity, managementCallbacks, itemsCombinedState, setItems, setSelectedItems, children }) => {
    const contextValue = useMemo(() => {
        return {
            Entity,
            managementCallbacks,
            itemsCombinedState,
            setItems,
            setSelectedItems
        };
    }, [Entity, managementCallbacks, itemsCombinedState, setItems, setSelectedItems]);
    return (
        <ManagementPageContext.Provider value={contextValue}>
            {children}
        </ManagementPageContext.Provider>
    );
};

ManagementPageProvider.propTypes = {
    Entity: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    itemsCombinedState: PropTypes.shape(itemsCombinedStatePropTypeShape).isRequired,
    managementCallbacks: PropTypes.objectOf(PropTypes.func).isRequired,
    setItems: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired
};

/**
 * @returns {Object.<string, function>}
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
    const { itemsCombinedState, setSelectedItems } = useContext(ManagementPageContext);
    return [itemsCombinedState.selectedItems, setSelectedItems];
};

/**
 * @returns {[object[], function]} [visibleItems, filterItems]
 */
export const useVisibleItems = () => {
    const { itemsCombinedState, filterItems } = useContext(ManagementPageContext);
    return [itemsCombinedState.visibleItems, filterItems];
};

/**
 * @returns {object[]} selectedVisibleItems
 */
export const useSelectedVisibleItems = () => {
    return useContext(ManagementPageContext).itemsCombinedState.selectedVisibleItems;
};

/**
 * @returns {Class} type of entity
 */
export const useEntity = () => {
    return useContext(ManagementPageContext).Entity;
};

/**
 * @returns {[object, function, function, function]} [itemsCombinedState, setItems, setSelectedItems, filterItems]
 */
export const useItemsReducer = () => {
    const [itemsCombinedState, itemsDispatch] = useReducer(itemsReducer, defaultItemsCombinedState);
    const setItems = useCallback((items) => {
        itemsDispatch({
            type: "setItems",
            items
        });
    }, [itemsDispatch]);
    const setSelectedItems = useCallback((selectedItems) => {
        itemsDispatch({
            type: "setSelectedItems",
            selectedItems
        });
    }, [itemsDispatch]);
    const filterItems = useCallback((filterFunction) => {
        itemsDispatch({
            type: "filterItems",
            filterFunction
        });
    }, [itemsDispatch]);
    return [itemsCombinedState, setItems, setSelectedItems, filterItems];
};
