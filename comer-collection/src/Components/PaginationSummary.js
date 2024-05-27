import React, { useCallback } from "react";
import { useItemCounts, useItemsPagination } from "../ContextProviders/ManagementPageProvider.js";
import { IconButton, Stack, Typography, styled } from "@mui/material";
import { ArrowBackIcon, ArrowForwardIcon } from "../Imports/Icons.js";

const DisappearingStack = styled(Stack, {
    shouldForwardProp: (prop) => prop !== "itemCounts"
})(({ itemCounts }) => ({
    visibility: itemCounts.visible === 0 ? "hidden" : "visible"
}));

const PaginationSummary = () => {
    const { paginationStatus, setPaginationStartIndex } = useItemsPagination();
    const itemCounts = useItemCounts();

    const endIndex = paginationStatus.startIndex + paginationStatus.itemsPerPage < itemCounts.visible
        ? paginationStatus.startIndex + paginationStatus.itemsPerPage - 1
        : itemCounts.visible - 1;

    const handlePreviousPage = useCallback(() => {
        setPaginationStartIndex(paginationStatus.startIndex - paginationStatus.itemsPerPage);
    }, [paginationStatus.itemsPerPage, paginationStatus.startIndex, setPaginationStartIndex]);

    const handleNextPage = useCallback(() => {
        setPaginationStartIndex(paginationStatus.startIndex + paginationStatus.itemsPerPage);
    }, [paginationStatus.itemsPerPage, paginationStatus.startIndex, setPaginationStartIndex]);

    return (
        <DisappearingStack
            alignItems="center"
            direction="row"
            itemCounts={itemCounts}
            spacing={1}
        >
            <IconButton
                disabled={paginationStatus.startIndex <= 0}
                onClick={handlePreviousPage}
                size="large"
            >
                <ArrowBackIcon />
            </IconButton>

            <Typography>

                {paginationStatus.startIndex + 1}

                {" - "}

                {endIndex + 1}

            </Typography>

            <Typography color="grey">

                {" of "}

                {itemCounts.visible}

            </Typography>

            <IconButton
                disabled={paginationStatus.startIndex >= itemCounts.visible - paginationStatus.itemsPerPage}
                onClick={handleNextPage}
                size="large"
            >
                <ArrowForwardIcon />
            </IconButton>
        </DisappearingStack>
    );
};

export default PaginationSummary;
