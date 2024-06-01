import { useCallback, useReducer } from "react";
import PropTypes from "prop-types";
import { entityPropTypeShape } from "../Classes/Entity";
import type { CloseDialogByIntentFunction, DialogItemsMultiplicity, DialogStateAction, DialogStateDictionary, Intent, Item, OpenDialogByIntentFunctionMultipleUnderlyingItems, OpenDialogByIntentFunctionNoUnderlyingItems, OpenDialogByIntentFunctionSingleUnderlyingItem } from "../index";

const dialogItemsMultiplicityByIntent: Record<Intent, DialogItemsMultiplicity> = {
    "single-delete": "single",
    "single-permanent-delete": "single",
    "single-restore": "single",
    "single-edit": "single",
    "multi-create": "none",
    "user-reset-password": "single",
    "user-change-activation-status": "single",
    "multi-delete": "multi",
    "user-change-privileges": "single",
    "exhibition-single-create": "none",
    "exhibition-single-update-settings": "single",
    "image-full-screen-preview": "single",
    "app-settings": "none"
};

export const dialogStatePropTypeShape = PropTypes.shape({
    dialogIsOpen: PropTypes.bool,
    dialogItemsMultiplicityByIntent: PropTypes.string,
    underlyingItem: entityPropTypeShape,
    underlyingItems: PropTypes.arrayOf(entityPropTypeShape)
});

const generateDefaultDialogStates = (intentArray: Intent[]): DialogStateDictionary => {
    const output = {} as DialogStateDictionary;
    for (const intent of intentArray) {
        output[intent] = {
            dialogIsOpen: false,
            dialogItemsMultiplicity: dialogItemsMultiplicityByIntent[intent],
            underlyingItem: null,
            underlyingItems: []
        };
    }
    return output;
};

/**
 * Reducer function for useDialogStates
 * @returns {DialogStateDictionary}
 */
const dialogStateReducer = (state: DialogStateDictionary, action: DialogStateAction): DialogStateDictionary => {
    if (action.type === "open") {
        if (action.dialogItemsMultiplicity !== state[action.dialogIntent].dialogItemsMultiplicity) {
            throw new Error(`The dialog with intent ${action.dialogIntent} 
            has multiplicity ${action.dialogItemsMultiplicity}, 
            but the DialogStateAction dispatched has multiplicity ${action.dialogItemsMultiplicity}`);
        }
        switch (action.dialogItemsMultiplicity) {
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
            return state;
        }
    } else {
        switch (action.dialogItemsMultiplicity) {
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
            return state;
        }
    }
};

/**
 * Hook to help manage the states of multiple dialogs
 */
const useDialogStates = ([...intentArray]: Intent[]): {
    dialogStateDictionary: DialogStateDictionary;
    openDialogByIntentWithNoUnderlyingItems: OpenDialogByIntentFunctionNoUnderlyingItems;
    openDialogByIntentWithSingleUnderlyingItem: OpenDialogByIntentFunctionSingleUnderlyingItem;
    openDialogByIntentWithMultipleUnderlyingItems: OpenDialogByIntentFunctionMultipleUnderlyingItems;
    closeDialogByIntent: CloseDialogByIntentFunction;
} => {
    const [dialogStateDictionary, dialogStateDispatch] = useReducer(dialogStateReducer, intentArray, generateDefaultDialogStates);

    const openDialogByIntentWithNoUnderlyingItems: OpenDialogByIntentFunctionNoUnderlyingItems = useCallback((intent: Intent) => {
        dialogStateDispatch({
            type: "open",
            dialogIntent: intent,
            dialogItemsMultiplicity: "none"
        });
    }, []);

    const openDialogByIntentWithSingleUnderlyingItem: OpenDialogByIntentFunctionSingleUnderlyingItem = useCallback((intent: Intent, item: Item) => {
        dialogStateDispatch({
            type: "open",
            dialogIntent: intent,
            dialogItemsMultiplicity: "single",
            underlyingItem: item
        });
    }, []);

    const openDialogByIntentWithMultipleUnderlyingItems: OpenDialogByIntentFunctionMultipleUnderlyingItems = useCallback((intent: Intent, items: Item[]) => {
        dialogStateDispatch({
            type: "open",
            dialogIntent: intent,
            dialogItemsMultiplicity: "multi",
            underlyingItems: items
        });
    }, []);

    const closeDialogByIntent: CloseDialogByIntentFunction = useCallback((intent: Intent) => {
        dialogStateDispatch({
            type: "close",
            dialogIntent: intent,
            dialogItemsMultiplicity: dialogItemsMultiplicityByIntent[intent]
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
