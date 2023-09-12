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


 ## --dev-notes
 - ## submit + modal

 - #### początek funkcji page
```typescript
// submit button
const [isClicked, setIsClicked] = useState(false);
// success modal
const [isOpen, setIsOpen] = useState(false);
const [object, setObject] = useState([]);
```

 - #### w funkcji handleSubmit po spełnieniu warunków

```typescript
setIsClicked(true);
setIsOpen(false);
```

 - #### po udanym requescie
```typescript
setObject(data.data);
setIsOpen(true);
setIsClicked(false);
```

