import { useCallback, useReducer } from "react";
import PropTypes from "prop-types";
import { entityPropTypeShape } from "../Classes/Entity.js";

/**
 * @type {{
 *  [S in Intent]: DialogItemsMultiplicity
 * }}
 */
const dialogItemsMultiplicityByIntent = {
    "single-delete": "single",
    "single-permanent-delete": "single",
    "single-restore": "single",
    "single-edit": "single",
    "multi-create": "none",
    "user-reset-password": "single",
    "user-change-activation-status": "single"
};

export const dialogStatePropTypeShape = PropTypes.shape({
    dialogIsOpen: PropTypes.bool,
    dialogItemsMultiplicityByIntent: PropTypes.string,
    underlyingItem: entityPropTypeShape,
    underlyingItems: PropTypes.arrayOf(entityPropTypeShape)
});

/**
 * @param {Intent[]} intentArray
 * @returns {DialogStateDictionary}
 */
const generateDefaultDialogStates = (intentArray) => {
    /**
     * @type {DialogStateDictionary}
     */
    const output = {};
    for (const intent of intentArray) {
        output[intent] = {
            dialogIsOpen: false,
            dialogItemsMultiplicity: dialogItemsMultiplicityByIntent[intent] ?? "none",
            underlyingItem: null,
            underlyingItems: []
        };
    }
    return output;
};

/**
 * Reducer function for useDialogStates
 * @param {DialogStateDictionary} state
 * @param {DialogStateAction} action
 * @returns {DialogStateDictionary}
 */
const dialogStateReducer = (state, action) => {
    const correctMultiplicity = state[action.dialogIntent].dialogItemsMultiplicity;
    if (action.type === "open") {
        if (correctMultiplicity !== action.dialogItemsMultiplicity) {
            throw new Error(`The dialog with intent ${action.dialogIntent} 
            has multiplicity ${correctMultiplicity}, 
            but the DialogStateAction dispatched has multiplicity ${action.dialogItemsMultiplicity}`);
        }
        switch (correctMultiplicity) {
        case "multi":
            return {
                ...state,
                [action.dialogIntent]: {
                    ...state[action.dialogIntent],
                    dialogIsOpen: true,
                    underlyingItems: action.underlyingItems
                }
            };
        case "single":
            return {
                ...state,
                [action.dialogIntent]: {
                    ...state[action.dialogIntent],
                    dialogIsOpen: true,
                    underlyingItem: action.underlyingItem
                }
            };
        case "none":
            return {
                ...state,
                [action.dialogIntent]: {
                    ...state[action.dialogIntent],
                    dialogIsOpen: true
                }
            };
        default:
            throw new Error(`Action contains invalid dialogItemsMultiplicity ${action.dialogItemsMultiplicity}`);
        }
    } else if (action.type === "close") {
        switch (correctMultiplicity) {
        case "multi":
            return {
                ...state,
                [action.dialogIntent]: {
                    ...state[action.dialogIntent],
                    dialogIsOpen: false,
                    underlyingItems: []
                }
            };
        case "single":
            return {
                ...state,
                [action.dialogIntent]: {
                    ...state[action.dialogIntent],
                    dialogIsOpen: false,
                    underlyingItem: null
                }
            };
        case "none":
            return {
                ...state,
                [action.dialogIntent]: {
                    ...state[action.dialogIntent],
                    dialogIsOpen: false
                }
            };
        default:
            console.warn("Correct multiplicity was not calculated correctly in dialogStateReducer");
            return state;
        }
    }
    return state;
};

/**
 * Hook to help manage the states of multiple dialogs
 * @param {Intent[]} intentArray
 */
const useDialogStates = ([...intentArray]) => {
    const [dialogStateDictionary, dialogStateDispatch] = useReducer(dialogStateReducer, intentArray, generateDefaultDialogStates);

    /**
     * @type {OpenDialogByIntentFunctionNoUnderlyingItems}
     */
    const openDialogByIntentWithNoUnderlyingItems = useCallback((intent) => {
        dialogStateDispatch({
            type: "open",
            dialogIntent: intent,
            dialogItemsMultiplicity: "none"
        });
    }, []);

    /**
     * @type {OpenDialogByIntentFunctionSingleUnderlyingItem}
     */
    const openDialogByIntentWithSingleUnderlyingItem = useCallback((intent, item) => {
        dialogStateDispatch({
            type: "open",
            dialogIntent: intent,
            dialogItemsMultiplicity: "single",
            underlyingItem: item
        });
    }, []);

    /**
     * @type {OpenDialogByIntentFunctionMultipleUnderlyingItems}
     */
    const openDialogByIntentWithMultipleUnderlyingItems = useCallback((intent, items) => {
        dialogStateDispatch({
            type: "open",
            dialogIntent: intent,
            dialogItemsMultiplicity: "multi",
            underlyingItems: items
        });
    }, []);

    /**
     * @type {CloseDialogByIntentFunction}
     */
    const closeDialogByIntent = useCallback((intent) => {
        dialogStateDispatch({
            type: "close",
            dialogIntent: intent
        });
    }, []);
    return {
        dialogStateDictionary,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent
    };
};

export default useDialogStates;
