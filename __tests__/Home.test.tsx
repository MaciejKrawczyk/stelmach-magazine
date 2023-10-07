import {render, screen, waitFor} from "@testing-library/react";
import Home from "@/src/app/page";

it('should have Przegląd text', async () => {
    render(<Home />) // ARRANGE

    const myElem = await waitFor(() => screen.getByText('Przegląd')) // ACTION

    expect(myElem).toBeInTheDocument() // ASSERT
})

// TODO test axios requests...
//  (the test above doesn't work because it makes request before rendering the text...)