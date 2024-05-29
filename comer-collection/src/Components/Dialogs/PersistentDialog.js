import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Dialog } from "@mui/material";

/**
 * Creates a dialog that behaves as a form and is
 * resistant to being closed by accident
 * @param {{
 *  maxWidth: ('xs'|'sm'|'md'|'lg'|'xl')
 * }} props
 * @returns
 */
export const PersistentDialog = ({ children, maxWidth, onClose, onSubmit, open }) => {
    const handleClose = useCallback((event, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        onClose();
    }, [onClose]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        onSubmit();
    }, [onSubmit]);

    return (
        <Dialog
            component={onSubmit ? "form" : "div"}
            fullWidth={Boolean(maxWidth)}
            maxWidth={maxWidth}
            onClose={handleClose}
            onSubmit={onSubmit ? handleSubmit : null}
            open={open}
            transitionDuration={0}
        >
            {children}
        </Dialog>
    );
};

PersistentDialog.propTypes = {
    children: PropTypes.node.isRequired,
    maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    open: PropTypes.bool.isRequired
};
