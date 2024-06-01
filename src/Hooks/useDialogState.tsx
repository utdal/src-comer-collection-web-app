import { useCallback, useMemo, useState } from "react";
import { DialogStateOld } from "../Classes/DialogState.js";
import type { Item } from "../index.js";

/**
 * Custom hook to manage dialog state (open/closed and associated items)
 * @param multipleItems Set to false if dialog pertains to only one
 * primary item.  Set to true if dialog pertains to multiple primary items.
 * Exclude the parameter if dialog pertains to no primary items.
 * @returns [dialogState, openDialog, closeDialog]
 */
export const useDialogState = (multipleItems?: boolean): [DialogStateOld, openDialog: (() => void) | (([...newItems]: Item[]) => void) | ((newItem: Item) => void), closeDialog: () => void] => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogItems, setDialogItems] = useState(multipleItems === true ? [] as Item[] : multipleItems === false ? (null as unknown) as Item : null);

    const openDialogWithItems = useCallback(([...newItems]: Item[]): void => {
        if (multipleItems === true) {
            setDialogItems(newItems);
            setDialogIsOpen(true);
        } else if (multipleItems === false) {
            throw new Error("This dialog uses only one item.  Use openDialogWithItem instead.");
        } else {
            throw new Error("This dialog does not use items.  Use openDialog instead.");
        }
    }, [multipleItems]);

    const openDialogWithItem = useCallback((newItem: Item): void => {
        if (multipleItems === true) {
            throw new Error("This dialog uses an array of items.  Use openDialogWithItems instead.");
        } else if (multipleItems === false) {
            setDialogItems(newItem);
            setDialogIsOpen(true);
        } else {
            throw new Error("This dialog does not use items.  Use openDialog instead.");
        }
    }, [multipleItems]);

    const openDialogWithNoItems = useCallback((): void => {
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
        setDialogItems(multipleItems === true ? [] : null);
    }, [multipleItems]);

    const openDialog = multipleItems === true
        ? openDialogWithItems
        : multipleItems === false
            ? openDialogWithItem
            : openDialogWithNoItems;

    const dialogState = useMemo(() => {
        return new DialogStateOld({
            dialogIsOpen,
            openDialog,
            closeDialog,
            dialogItems: multipleItems === true ? dialogItems : null,
            dialogItem: multipleItems === false ? dialogItems : null
        });
    }, [dialogIsOpen, openDialog, closeDialog, multipleItems, dialogItems]);

    return [dialogState, openDialog, closeDialog];
};
