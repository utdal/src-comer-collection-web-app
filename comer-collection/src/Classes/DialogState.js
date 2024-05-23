export class DialogState {
    constructor ({ dialogIsOpen, openDialog, closeDialog, dialogItems, dialogItem }) {
        /**
         * @type {boolean}
         */
        this.dialogIsOpen = dialogIsOpen;

        /**
         * @type {function}
         */
        this.openDialog = openDialog;

        /**
         * @type {function}
         */
        this.closeDialog = closeDialog;

        /**
         * @type {object[] | null}
         */
        this.dialogItems = dialogItems;

        /**
         * @type {object | null}
         */
        this.dialogItem = dialogItem;
    }
}
