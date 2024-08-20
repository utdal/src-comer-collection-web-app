import React, { useCallback } from "react";
import { useItemCounts, useItemsPagination } from "../../ContextProviders/ManagementPageProvider";
import type { IconButtonOwnProps, StackOwnProps } from "@mui/material";
import { IconButton, Stack, styled } from "@mui/material";
import { KeyboardArrowLeftIcon, KeyboardArrowRightIcon, KeyboardDoubleArrowLeftIcon, KeyboardDoubleArrowRightIcon } from "../../Imports/Icons";
import PaginationSummaryMenu from "./PaginationSummaryMenu";

interface DisappearingStackProps extends StackOwnProps {
    isHidden: boolean;
}

interface DisappearingIconButtonProps extends IconButtonOwnProps {
    isHidden: boolean;
}

const DisappearingStack = styled(Stack, {
    shouldForwardProp: (prop) => prop !== "isHidden"
})(({ isHidden }: DisappearingStackProps) => ({
    visibility: isHidden ? "hidden" : "visible"
}));

const DisappearingIconButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== "isHidden"
})(({ isHidden }: DisappearingIconButtonProps) => ({
    display: isHidden ? "none" : ""
}));

const PaginationSummary = ({ hideOnSinglePage }: {
    readonly hideOnSinglePage?: boolean;
}): React.JSX.Element => {
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
        setPaginationStartIndex(Math.ceil(itemCounts.visible / paginationStatus.itemsPerPage - 1) * paginationStatus.itemsPerPage);
    }, [itemCounts.visible, paginationStatus.itemsPerPage, setPaginationStartIndex]);

    const isHidden = itemCounts.visible === 0 || (hideOnSinglePage === true && itemCounts.visible <= paginationStatus.itemsPerPage);
    const skipButtonsHidden = itemCounts.visible <= 2 * paginationStatus.itemsPerPage;

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

            <PaginationSummaryMenu
                paginationStatus={paginationStatus}
                visibleItemCount={itemCounts.visible}
            />

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

export default PaginationSummary;
