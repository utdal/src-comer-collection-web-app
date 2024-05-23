import { useCallback, useMemo, useState } from "react";
import { DialogState } from "../Classes/DialogState.js";

/**
 * Custom hook to manage dialog state (open/closed and associated items)
 * @param {Boolean} multipleItems Set to false if dialog pertains to only one
 * primary item.  Set to true if dialog pertains to multiple primary items.
 * @param {Class} entity Optionally choose a specific type of item
 * @returns {[DialogState, openDialog: function(), closeDialog: function()]} [dialogState, openDialog, closeDialog]
 */
export const useDialogState = (multipleItems) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogItems, setDialogItems] = useState(multipleItems ? [] : null);

    const openDialogWithItems = useCallback(([...newItems]) => {
        if (multipleItems === true) {
            setDialogItems(newItems);
            setDialogIsOpen(true);
        } else if (multipleItems === false) {
            throw new Error("This dialog uses only one item.  Use openDialogWithItem instead.");
        } else {
            throw new Error("This dialog does not use items.  Use openDialog instead.");
        }
    }, [multipleItems]);

    const openDialogWithItem = useCallback((newItem) => {
        if (multipleItems === true) {
            throw new Error("This dialog uses an array of items.  Use openDialogWithItems instead.");
        } else if (multipleItems === false) {
            setDialogItems(newItem);
            setDialogIsOpen(true);
        } else {
            throw new Error("This dialog does not use items.  Use openDialog instead.");
        }
    }, [multipleItems]);

    const openDialogWithNoItems = useCallback(() => {
        if (multipleItems === true) {
            throw new Error("This dialog uses an array of items.  Use openDialogWithItems instead.");
        } else if (multipleItems === false) {
            throw new Error("This dialog uses only one item.  Use openDialogWithItem instead.");
        } else {
            setDialogItems(null);
            setDialogIsOpen(true);
        }
    }, [multipleItems]);

    const closeDialog = useCallback(() => {
        setDialogIsOpen(false);
        setDialogItems(multipleItems ? [] : null);
    }, [multipleItems]);

    const openDialog = multipleItems === true
        ? openDialogWithItems
        : multipleItems === false
            ? openDialogWithItem
            : openDialogWithNoItems;

    const dialogState = useMemo(() => {
        return new DialogState({
            dialogIsOpen,
            openDialog,
            closeDialog,
            dialogItems: multipleItems === true ? dialogItems : null,
            dialogItem: multipleItems === false ? dialogItems : null
        });
    }, [dialogIsOpen, openDialog, closeDialog, multipleItems, dialogItems]);

    return [dialogState, openDialog, closeDialog];
};
