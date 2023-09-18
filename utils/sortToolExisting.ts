import axios from "axios";

// Helper function to get occupied shelf ids
const getOccupiedShelfIds = (items) => {
    return items.filter(item => item.placeId === 1 && item.shelfId === -1).map(item => item.shelfId);
}

// Helper function to find a matching shelf
const findMatchingShelf = (shelves, items, shelfType, itemType, attributes) => {
    for (let shelf of shelves) {
        if (shelf.id === -1 || shelfType !== shelf.size) continue;

        const itemInShelf = items.find(item => Number(item.shelfId) === Number(shelf.id));

        if (!itemInShelf) return shelf.id;  // Return the id of the empty shelf.

        if (Number(itemInShelf.itemType.id) === Number(itemType)) {
            const matchedAttributes = attributes.every((attr, index) =>
                String(attr.value) === String(itemInShelf.attributeValue[index].value) &&
                String(attr.typeattribute.name) === String(itemInShelf.attributeValue[index].typeattribute.name)
            );

            if (matchedAttributes) return shelf.id;
        }
    }

    return null;  // Return null if no matching shelf is found.
}

export const sortToolExisting = async (shelfType, shelfCategoryId, itemType, attributes) => {
    try {
        const [categoriesShelvesResponse, itemsResponse] = await Promise.all([
            axios.get('/api/category'),
            axios.get('/api/item')
        ]);

        const category = categoriesShelvesResponse.data.find(cat => Number(cat.id) === Number(shelfCategoryId));
        if (!category) {
            throw new Error("No shelf found in the category.");
        }

        const occupiedShelfIds = getOccupiedShelfIds(itemsResponse.data);
        const matchingShelfId = findMatchingShelf(category.shelf, itemsResponse.data, shelfType, itemType, attributes);

        if (matchingShelfId !== null) return { shelfId: matchingShelfId };

        throw new Error("Could not find a suitable shelf.");

    } catch (error) {
        throw new Error(`Error occurred while sorting: ${error.message}`);
    }
}
