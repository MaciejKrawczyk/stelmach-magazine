import axios from "axios";


export const sortTool = async (shelfType, shelfCategoryId, itemType) => {

    let categoriesShelves = await axios.get('/api/category')
    let items = await axios.get('/api/item')

    let firstEmptyShelfId = null

    console.log(categoriesShelves)
    console.log(items)

    categoriesShelves = categoriesShelves.data
    items = items.data

    let shelvesOccupiedIds = []

    for (let i=0;i<items.length;i++) {
        shelvesOccupiedIds.push(Number(items[i].shelfId))
    }
    // po tej petli w shelvesOccupiedIds mam wszystkie zajete szuflady

    for (let i=0;i<categoriesShelves.length;i++) {

        console.log('szukam po kateogriach')

        if (categoriesShelves[i].id === Number(shelfCategoryId)) {

            console.log('polaczylem id kategorii z formularza i z bazy danych')

            for (let j=0;j<categoriesShelves[i].shelf.length;j++) {

                console.log('przeszukuje wszystkie szuflady w kategorii')

                if (
                    Number(categoriesShelves[i].shelf[j].id) !== 1
                    // && !shelvesOccupiedIds.includes(Number(categoriesShelves[i].shelf[j].id))
                    && categoriesShelves[i].shelf[j].size === shelfType
                ) {

                    console.log('jesli szuflada nie ma id 1 (bo to ta tymczasowa) i rozmiar szuflad sie zgadza')

                    if (shelvesOccupiedIds.includes(Number(categoriesShelves[i].shelf[j].id))) {

                        console.log('szuflada sie zgadza ale jest zajeta...')

                        // musze sprawdzic jaki typ ma narzedzie w tej szufladce

                        const currentShelfId = Number(categoriesShelves[i].shelf[j].id)

                        for (let itemIndex in items) {
                            console.log('itemIndex', itemIndex)
                            if (itemType === items[itemIndex].itemTypeId) {

                                // tutaj jak znalazl szufladke w kategorii dla narzedzia
                                console.log('znaleziono, pierwsza szufladka z tym samym typem: ', categoriesShelves[i].shelf[j].id, 'rozmiar:', categoriesShelves[i].shelf[j].size )

                                const data = {
                                    shelfId: currentShelfId
                                }

                                console.log(data)

                                return data

                            }

                        }


                    } else {

                        if (firstEmptyShelfId === null) {
                            firstEmptyShelfId = Number(categoriesShelves[i].shelf[j].id)
                        }
                    }

                }


            }

            // tutaj jak znalazl szufladke w kategorii dla narzedzia
            console.log('znaleziono, pierwsza wolna szufladka: ', firstEmptyShelfId )

            const data = {
                shelfId: firstEmptyShelfId
            }

            console.log(data)

            return data

        }

    }

    console.log('nie udalo sie')
    throw new Error("nie znaleziono szuflady w kategorii")

}
