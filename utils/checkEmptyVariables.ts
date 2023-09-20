export function checkEmptyVariables(variables: { [key: string]: string | null | undefined | any[] }): string[] {
    const emptyVariableNames: string[] = [];

    for (const [name, value] of Object.entries(variables)) {
        if (value === null || value === undefined) {
            emptyVariableNames.push(name);
        } else if (typeof value === 'string' && value.trim() === '') {
            emptyVariableNames.push(name);
        } else if (Array.isArray(value) && value.length === 0) {
            emptyVariableNames.push(name);
        }
    }

    return emptyVariableNames;
}