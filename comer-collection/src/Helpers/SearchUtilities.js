export const searchItems = (searchQuery, itemsToSearch, fieldsToSearch) => {
    return itemsToSearch.filter((item) => {
        return doesItemMatchSearchQuery(searchQuery, item, fieldsToSearch);
    });
};

export const doesItemMatchSearchQuery = (searchQuery, item, fieldsToSearch) => {
    if (fieldsToSearch?.length === 0) { return true; }
    for (const f of fieldsToSearch) {
        if (item[f] && Boolean((item[f]).toLowerCase().includes(searchQuery.toLowerCase()))) {
            return true;
        }
    }
    return false;
};
