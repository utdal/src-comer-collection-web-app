import React from "react";
import PropTypes from "prop-types";
import { Box, styled } from "@mui/material";
import { useEntity, useItemsLoadStatus, useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";
import { FullPageMessage } from "../FullPageMessage.js";
import { WarningIcon } from "../../Imports/Icons.js";

const PositionedBox = styled(Box)(() => ({
    gridArea: "table",
    overflowX: "auto"
}));

export const ManagementPageBody = ({ children }) => {
    const [isLoaded, isError] = useItemsLoadStatus();
    const { handleRefresh } = useManagementCallbacks();
    const Entity = useEntity();

    return (
        <PositionedBox>
            {isError
                ? (
                    <FullPageMessage
                        Icon={WarningIcon}
                        buttonAction={handleRefresh}
                        buttonText="Retry"
                        message={`Error loading ${Entity.plural}`}
                    />
                )
                : !isLoaded
                    ? (
                        <FullPageMessage
                            includeLinearProgress
                            message={`Loading ${Entity.plural}...`}
                        />
                    )
                    : (
                        children
                    )}
        </PositionedBox>
    );
};

ManagementPageBody.propTypes = {
    children: PropTypes.node.isRequired
};
