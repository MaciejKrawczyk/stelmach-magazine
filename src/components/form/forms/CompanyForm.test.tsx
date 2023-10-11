import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import CompanyForm from './CompanyForm'
import axios from "axios";

describe('CompanyForm', () => {

    beforeEach(() => {
        axios.post.mockResolvedValue({ data: {} })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should submit form and show success modal', async () => {

        render(<CompanyForm />);

        // Simulate filling out the form
        fireEvent.change(screen.getByPlaceholderText('Nazwa firmy'), {
            target: { value: 'Test Company' },
        });

        fireEvent.change(screen.getByPlaceholderText('Notatki'), {
            target: { value: 'Test Notes' },
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        // Wait for the success modal to show up after form submission
        await waitFor(() => {
            expect(screen.getByText('Success!')).toBeInTheDocument();
        });
    });
});
