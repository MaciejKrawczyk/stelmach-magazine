import axios from "axios";


export const sortTool = async (shelfType, shelfCategoryId) => {

    console.log(shelfType)
    console.log(shelfCategoryId)

    let categoriesShelves = await axios.get('/api/category')
    let items = await axios.get('/api/item')

    categoriesShelves = categoriesShelves.data
    items = items.data

    let shelvesOccupiedIds = []

    for (let i=0;i<items.length;i++) {
        shelvesOccupiedIds.push(Number(items[i].shelfId))
    }
    console.log(shelvesOccupiedIds)
    // po tej petli w shelvesOccupiedIds mam wszystkie zajete szuflady

    console.log(categoriesShelves)
    for (let i=0;i<categoriesShelves.length;i++) {
        console.log('szukam po kateogriach')
        if (categoriesShelves[i].id === Number(shelfCategoryId)) {
            console.log('polaczylem id kategorii z formularza i z bazy danych')
            for (let j=0;j<categoriesShelves[i].shelf.length;j++) {
                console.log('przeszukuje wszystkie szuflady w kategorii')
                if (Number(categoriesShelves[i].shelf[j].id) !== 1 && !shelvesOccupiedIds.includes(Number(categoriesShelves[i].shelf[j].id)) && categoriesShelves[i].shelf[j].size === shelfType ) {

                    // tutaj jak znalazl szufladke w kategorii dla narzedzia
                    console.log('znaleziono, id szufladki: ', categoriesShelves[i].shelf[j].id, 'rozmiar:', categoriesShelves[i].shelf[j].size )
                    const data = {
                        shelfId: categoriesShelves[i].shelf[j].id
                    }
                    console.log(data)
                    return data
                }
            }



        }

    }

    console.log('nie udalo sie')
    throw new Error("nie znaleziono szuflady w kategorii")

}


export const sortItemShelf = async (items: any[]) => {
    // returns dict { itemId: shelfId }
    // i need itemId, shelfType and Category of the shelf

    const allShelves = await axios.get('/api/shelf')

    for (let i=0;i<items.length;i++) {

        // const itemShelfType = items[i].shelfType
        // const itemShelfCategory =

    }


}