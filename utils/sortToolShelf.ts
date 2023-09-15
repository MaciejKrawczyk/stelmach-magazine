import axios from "axios";

export const sortTool = async (shelfType, shelfCategoryId, itemType) => {
    // Retrieve data with a single API call if possible.
    const [categoriesShelvesResponse, itemsResponse] = await Promise.all([
        axios.get('/api/category'),
        axios.get('/api/item')
    ]);

    const categoriesShelves = categoriesShelvesResponse.data;
    const items = itemsResponse.data;

    // Use a Set for constant time lookup instead of an array
    const shelvesOccupiedIds = new Set(items.map(item => Number(item.itemTypeId)));

    const category = categoriesShelves.find(cat => cat.id === Number(shelfCategoryId));
    if (!category) {
        throw new Error("nie znaleziono szuflady w kategorii");
    }

    for (const shelf of category.shelf) {
        const shelfId = Number(shelf.id);
        if (shelfId !== 1 && shelfId !== -1 && shelf.size === shelfType) {
            if (shelvesOccupiedIds.has(shelfId)) {
                // If shelf is occupied, find if an item with the same type exists.
                const matchingItem = items.find(item => Number(item.itemTypeId) === Number(itemType));
                if (matchingItem) {
                    return { shelfId };
                }
            } else {
                // If shelf is not occupied, return the shelf.
                return { shelfId };
            }
        }
    }

    throw new Error("nie znaleziono szuflady w kategorii");
}
