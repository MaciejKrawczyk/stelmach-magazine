type Dictionary = { [key: string]: string | Dictionary };

export function findEmptyStrings(dict: Dictionary, parentKey: string = ""): string[] {
    const emptyKeys: string[] = [];

    for (const key in dict) {
        const fullPath = parentKey ? `${parentKey}.${key}` : key;

        if (typeof dict[key] === "string" && dict[key] === "") {
            emptyKeys.push(fullPath);
        } else if (typeof dict[key] === "object" && dict[key] !== null) {
            emptyKeys.push(...findEmptyStrings(dict[key] as Dictionary, fullPath));
        }
    }

    return emptyKeys;
}

// Test
const testDictionary: Dictionary = {
    a: "hello",
    b: "",
    c: "world",
    d: "",
    e: {
        f: "",
        t: "eee",
    }
};

console.log(findEmptyStrings(testDictionary)); // Expected output: ['b', 'd', 'e.f']
