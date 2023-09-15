import axios from "axios";

export const sortToolShelfMultiple = async (itemsList) => {
    // Retrieve data with a single API call if possible.
    const [categoriesShelvesResponse, itemsResponse] = await Promise.all([
        axios.get('/api/category'),
        axios.get('/api/item')
    ]);

    const categoriesShelves = categoriesShelvesResponse.data;
    const allItems = itemsResponse.data;

    // Use a Set for constant time lookup instead of an array
    const shelvesOccupiedIds = new Set(allItems.map(item => Number(item.itemTypeId)));

    const result = {};

    for (const itemId in itemsList) {
        const { shelfType, shelfCategoryId, itemType } = itemsList[itemId];
        const category = categoriesShelves.find(cat => cat.id === Number(shelfCategoryId));
        if (!category) {
            throw new Error(`Nie znaleziono szuflady w kategorii dla item ID: ${itemId}`);
        }

        let foundShelf = false;

        for (const shelf of category.shelf) {
            const shelfId = Number(shelf.id);
            if (shelfId !== 1 && shelfId !== -1 && shelf.size === shelfType) {
                if (shelvesOccupiedIds.has(shelfId)) {
                    // If shelf is occupied, find if an item with the same type exists.
                    const matchingItem = allItems.find(item => Number(item.itemTypeId) === Number(itemType));
                    if (matchingItem) {
                        result[itemId] = shelfId;
                        foundShelf = true;
                        break;
                    }
                } else {
                    // If shelf is not occupied, return the shelf.
                    result[itemId] = shelfId;
                    shelvesOccupiedIds.add(shelfId);  // mark shelf as occupied
                    foundShelf = true;
                    break;
                }
            }
        }

        if (!foundShelf) {
            throw new Error(`Nie znaleziono szuflady w kategorii dla item ID: ${itemId}`);
        }
    }

    return result;
}