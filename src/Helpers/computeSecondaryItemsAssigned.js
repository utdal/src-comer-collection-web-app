export const computeSecondaryItemsAssigned = (secondaryItemsAll, secondariesByPrimary, primaryItems) => {
    if (primaryItems?.length === 0) { return []; }
    return secondaryItemsAll.filter((si) => {
        return (
            Object.entries(secondariesByPrimary)
                .filter((entry) => primaryItems.map((pi) => pi.id).includes(parseInt(entry[0])))
                .map((entry) => entry[1]).filter((secondaries) => secondaries.map(s => s.id).includes(parseInt(si.id))).length > 0
        );
    });
};
