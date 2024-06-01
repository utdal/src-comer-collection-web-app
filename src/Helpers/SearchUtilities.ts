import type { EntityFieldDefinition, Item } from "..";

export const doesItemMatchSearchQuery = (searchQuery: string, item: Item, fieldsToSearch: EntityFieldDefinition[]): boolean => {
    if (fieldsToSearch.length === 0) {
        return true;
    }
    for (const f of fieldsToSearch) {
        const value = item[f.fieldName] != null ? `${item[f.fieldName] as string}` : null;
        if (value != null && Boolean((value).toLowerCase().includes(searchQuery.toLowerCase()))) {
            return true;
        }
    }
    return false;
};

export const searchItems = (searchQuery: string, itemsToSearch: Item[], fieldsToSearch: EntityFieldDefinition[]): Item[] => {
    return itemsToSearch.filter((item) => {
        return doesItemMatchSearchQuery(searchQuery, item, fieldsToSearch);
    });
};
