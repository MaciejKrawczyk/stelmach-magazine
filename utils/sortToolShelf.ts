import axios from "axios";

const getItemsFromApi = async () => {
    try {
        const response = await axios.get('/api/item');
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get items: ${error.message}`);
    }
};

const getCategoriesFromApi = async () => {
    try {
        const response = await axios.get('/api/category');
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get categories: ${error.message}`);
    }
};

const getOccupiedShelfIds = (items) => {
    return items.filter(item => item.placeId === 1 && item.shelfId === -1).map(item => item.shelfId);
};

const findMatchingShelf = (shelves, items, shelfType, itemType, attributes) => {
    for (let shelf of shelves) {
        if (shelf.id === -1 || shelfType !== shelf.size) continue;

        const itemInShelf = items.find(item => Number(item.shelfId) === Number(shelf.id));

        if (!itemInShelf) return shelf.id;

        if (Number(itemInShelf.itemType.id) === Number(itemType)) {
            const matchedAttributes = Object.entries(attributes).every(([typeattributeId, value]) => {
                const attribute = itemInShelf.attributeValue.find(attr => Number(attr.typeattribute.id) === Number(typeattributeId));
                return attribute && String(attribute.value) === String(value);
            });

            if (matchedAttributes) return shelf.id;
        }
    }
    return null;
};

export const sortTool = async (shelfCategoryId, shelfType, itemType, attributes) => {
    try {
        const [categories, items] = await Promise.all([getCategoriesFromApi(), getItemsFromApi()]);

        const category = categories.find(cat => Number(cat.id) === Number(shelfCategoryId));

        if (!category) {
            throw new Error("No shelf found in the shelf-shelf-category.");
        }

        const occupiedShelfIds = getOccupiedShelfIds(items);
        const matchingShelfId = findMatchingShelf(category.shelf, items, shelfType, itemType, attributes);

        if (matchingShelfId !== null) return { shelfId: matchingShelfId };

        console.error('Not found suitable shelf');
        throw new Error("Could not find a suitable shelf.");

    } catch (error) {
        console.error(error);
        throw new Error(`Error occurred while sorting: ${error.message}`);
    }
};
