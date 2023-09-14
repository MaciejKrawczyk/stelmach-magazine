# DOKUMENTACJA MAGAZYNU PZ STELMACH

## PIERWSZE URUCHOMIENIE / PO WYCZYSZCZENIU BAZY
 - /api/category => stworzyć domyślną kategorie
```http request
http://localhost:3000/api/category POST
```
```json
{
    "name": "domyślna",
    "color": "lightgray",
    "notes": "domyślna"
}
```
 - /api/generateShelves => tworzy szuladki
```http request
http://localhost:3000/api/generateShelves POST
```

 --- 

## notes

 - szuflada id -1 => na jakimś stanowisku (też wyjęte i zamówione) oprócz magazynu

 - miejsce id -1 => wyjęte
 - miesjce id 18 => zamowione