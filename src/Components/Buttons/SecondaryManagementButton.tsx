import React from "react";
import { Button, Typography } from "@mui/material";
import { useAssociationType } from "../../ContextProviders/AssociationManagementPageProvider";

/**
 * Button placed within AssociationManagementDialog that navigates
 * to the management console for the secondary entity.
 * Either switches dialogs or navigates to a different page,
 * depending on which entities are involved
 */
const SecondaryManagementButton = ({ handleSwitchToSecondary }: {
    readonly handleSwitchToSecondary: () => void;
}): React.JSX.Element => {
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

export default SecondaryManagementButton;
