'use client'

import Container from "@/src/components/Container";
import ItemForm from "@/src/components/form/forms/ItemForm";

const App = () => {

    return (
        <Container title={'Dodawanie przedmiotów'}>
            <ItemForm />
        </Container>
    );
};

export default App;
