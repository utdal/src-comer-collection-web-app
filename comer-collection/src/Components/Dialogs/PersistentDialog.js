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
export const PersistentDialog = ({ children, maxWidth, onClose, isForm, onSubmit, open }) => {
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
            component={isForm ? "form" : "div"}
            fullWidth={Boolean(maxWidth)}
            maxWidth={maxWidth}
            onClose={handleClose}
            onSubmit={isForm ? handleSubmit : null}
            open={open}
            sx={{ zIndex: 10000 }}
        >
            {children}
        </Dialog>
    );
};

PersistentDialog.propTypes = {
    children: PropTypes.node.isRequired,
    isForm: PropTypes.bool,
    maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
