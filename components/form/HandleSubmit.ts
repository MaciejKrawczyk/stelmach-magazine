import {z} from "zod";

export const universalHandleSubmit = async (
    formData: any,
    zodSchema: z.ZodSchema<any>,
    serverSubmitFunction: (data: any) => Promise<void>
) => {
    try {
        console.log(formData)
        zodSchema.parse(formData);
        await serverSubmitFunction(formData);

        return {
            success: true,
            errors: {},
            validationError: null
        };

    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: { [key: string]: string } = {};
            error.errors.forEach(err => {
                const field = err.path[0];
                errors[field] = "Proszę uzupełnić to pole";
            });
            return {
                success: false,
                errors,
                validationError: `Wystąpił błąd przy weryfikacji formularza. ${JSON.stringify(errors)}`
            };
        } else {
            return {
                success: false,
                errors: {},
                validationError: `Błąd przy realizacji formularza: ${error.message}`
            };
        }
    }
}
