import type { Item } from "..";

export class DialogStateOld {
    public dialogIsOpen: boolean;

    public openDialog: (arg0: unknown) => void;

    public closeDialog: () => void;

    public dialogItems: Item[];

    public dialogItem: Item;

    public constructor ({ dialogIsOpen, openDialog, closeDialog, dialogItems, dialogItem }: {
        dialogIsOpen: boolean;
        openDialog: (arg0: unknown) => void;
        closeDialog: () => void;
        dialogItems: Item[];
        dialogItem: Item;
    }) {
        this.dialogIsOpen = dialogIsOpen;
        this.openDialog = openDialog;
        this.closeDialog = closeDialog;
        this.dialogItems = dialogItems;
        this.dialogItem = dialogItem;
    }
}
