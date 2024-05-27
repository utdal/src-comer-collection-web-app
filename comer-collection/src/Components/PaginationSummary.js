import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useItemCounts, useItemsPagination } from "../ContextProviders/ManagementPageProvider.js";
import { IconButton, Stack, Typography, styled } from "@mui/material";
import { KeyboardArrowLeftIcon, KeyboardArrowRightIcon, KeyboardDoubleArrowLeftIcon, KeyboardDoubleArrowRightIcon } from "../Imports/Icons.js";

const DisappearingStack = styled(Stack, {
    shouldForwardProp: (prop) => prop !== "isHidden"
})(({ isHidden }) => ({
    display: isHidden ? "none" : ""
}));

const DisappearingIconButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== "isHidden"
})(({ isHidden }) => ({
    display: isHidden ? "none" : ""
}));

const PaginationSummary = ({ hideOnSinglePage }) => {
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

    const isHidden = itemCounts.visible === 0 ? "none" : "" || (hideOnSinglePage && itemCounts.visible <= paginationStatus.itemsPerPage);
    const skipButtonsHidden = itemCounts.visible <= 2 * paginationStatus.itemsPerPage;

    const textWidth = useMemo(() => (
        `${50 + (Math.floor(Math.log10(itemCounts.visible)) + 1) * 20}px`
    ), [itemCounts.visible]);

    return (
        <DisappearingStack
            alignItems="center"
            direction="row"
            isHidden={isHidden}

        >
            <DisappearingIconButton
                disabled={paginationStatus.startIndex <= 0}
                isHidden={skipButtonsHidden}
                onClick={handleFirstPage}
                size="medium"
            >
                <KeyboardDoubleArrowLeftIcon />
            </DisappearingIconButton>

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
                width={textWidth}
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

            <DisappearingIconButton
                disabled={paginationStatus.startIndex >= itemCounts.visible - paginationStatus.itemsPerPage}
                isHidden={skipButtonsHidden}
                onClick={handleLastPage}
                size="medium"
            >
                <KeyboardDoubleArrowRightIcon fontSize="medium" />
            </DisappearingIconButton>
        </DisappearingStack>
    );
};

PaginationSummary.propTypes = {
    hideOnSinglePage: PropTypes.bool
};

export default PaginationSummary;
