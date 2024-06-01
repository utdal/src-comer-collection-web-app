import React from "react";
import PropTypes from "prop-types";
import { Button, Typography } from "@mui/material";
import { useAssociationType } from "../../ContextProviders/AssociationManagementPageProvider";

/**
 * Button placed within AssociationManagementDialog that navigates
 * to the management console for the secondary entity.
 * Either switches dialogs or navigates to a different page,
 * depending on which entities are involved
 * @param {{
 *  handleSwitchToSecondary: () => void
 * }} props
 */
const SecondaryManagementButton = ({ handleSwitchToSecondary }) => {
    const AssociationType = useAssociationType();
    return (
        <Button
            onClick={handleSwitchToSecondary}
            variant="outlined"
        >
            <Typography>
                {"Manage "}

                {AssociationType.secondary.plural}
            </Typography>
        </Button>
    );
};

SecondaryManagementButton.propTypes = {
    handleSwitchToSecondary: PropTypes.func.isRequired
};

export default SecondaryManagementButton;
