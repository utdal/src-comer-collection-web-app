import React, { useCallback } from "react";
import { useItemCounts, useItemsPagination } from "../ContextProviders/ManagementPageProvider.js";
import { IconButton, Stack, Typography, styled } from "@mui/material";
import { KeyboardArrowLeftIcon, KeyboardArrowRightIcon, KeyboardDoubleArrowLeftIcon, KeyboardDoubleArrowRightIcon } from "../Imports/Icons.js";

const DisappearingStack = styled(Stack, {
    shouldForwardProp: (prop) => prop !== "itemCounts"
})(({ itemCounts }) => ({
    display: itemCounts.visible === 0 ? "none" : ""
}));

const PaginationSummary = () => {
    const { paginationStatus, setPaginationStartIndex } = useItemsPagination();
    const itemCounts = useItemCounts();

    const handlePreviousPage = useCallback(() => {
        setPaginationStartIndex(paginationStatus.startIndex - paginationStatus.itemsPerPage);
    }, [paginationStatus.itemsPerPage, paginationStatus.startIndex, setPaginationStartIndex]);

    const handleNextPage = useCallback(() => {
        setPaginationStartIndex(paginationStatus.startIndex + paginationStatus.itemsPerPage);
    }, [paginationStatus.itemsPerPage, paginationStatus.startIndex, setPaginationStartIndex]);

    const handleFirstPage = useCallback(() => {
        setPaginationStartIndex(0);
    }, [setPaginationStartIndex]);

    const handleLastPage = useCallback(() => {
        setPaginationStartIndex(Math.floor(itemCounts.visible / paginationStatus.itemsPerPage) * paginationStatus.itemsPerPage);
    }, [itemCounts.visible, paginationStatus.itemsPerPage, setPaginationStartIndex]);

    return (
        <DisappearingStack
            alignItems="center"
            direction="row"
            itemCounts={itemCounts}
        >
            <IconButton
                disabled={paginationStatus.startIndex <= 0}
                onClick={handleFirstPage}
                size="medium"
            >
                <KeyboardDoubleArrowLeftIcon />
            </IconButton>

            <IconButton
                disabled={paginationStatus.startIndex <= 0}
                onClick={handlePreviousPage}
                size="medium"
            >
                <KeyboardArrowLeftIcon />
            </IconButton>

            <Stack
                direction="row"
                justifyContent="center"
                margin={1}
                spacing={1}
                width="120px"
            >

                <Typography>

                    {paginationStatus.startIndex + 1}

                    {" - "}

                    {paginationStatus.endIndex + 1}

                </Typography>

                <Typography color="grey">

                    {" of "}

                    {itemCounts.visible}

                </Typography>
            </Stack>

            <IconButton
                disabled={paginationStatus.startIndex >= itemCounts.visible - paginationStatus.itemsPerPage}
                onClick={handleNextPage}
                size="medium"
            >
                <KeyboardArrowRightIcon />
            </IconButton>

            <IconButton
                disabled={paginationStatus.startIndex >= itemCounts.visible - paginationStatus.itemsPerPage}
                onClick={handleLastPage}
                size="medium"
            >
                <KeyboardDoubleArrowRightIcon fontSize="medium" />
            </IconButton>
        </DisappearingStack>
    );
};

export default PaginationSummary;
