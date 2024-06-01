import React, { useCallback } from "react";
import { Dialog } from "@mui/material";

/**
 * Creates a dialog that behaves as a form and is
 * resistant to being closed by accident
 */
const PersistentDialog = ({ children, maxWidth, onClose, onSubmit, open }: {
    readonly maxWidth?: "lg" | "md" | "sm" | "xl" | "xs";
    readonly children: React.ReactNode;
    readonly onClose: () => void;
    readonly onSubmit?: () => void;
    readonly open: boolean;
}): React.JSX.Element => {
    const handleClose = useCallback((event: Event, reason: "backdropClick" | "escapeKeyDown"): void => {
        if (reason === "backdropClick") {
            return;
        }
        onClose();
    }, [onClose]);

    const handleSubmit = useCallback((e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit();
        }
    }, [onSubmit]);

    return (
        <Dialog
            component={onSubmit ? "form" : "div"}
            fullWidth={Boolean(maxWidth)}
            maxWidth={maxWidth}
            onClose={handleClose}
            onSubmit={handleSubmit}
            open={open}
            transitionDuration={0}
        >
            {children}
        </Dialog>
    );
};

export default PersistentDialog;
