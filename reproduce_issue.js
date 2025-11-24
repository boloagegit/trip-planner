import { parseMatrixCSV } from './src/utils/csvParser.js';

const mockData = [
    {
        "時間": "12:00",
        "12/28 (日)抵達": "抵達東京",
        "12/29 (一)": "逛街"
    },
    {
        "時間": "13:00",
        "12/28 (日)抵達": "抵達東京",
        "12/29 (一)": "吃飯"
    }
];

try {
    console.log("Testing parseMatrixCSV with valid data...");
    const result = parseMatrixCSV(mockData);
    console.log("Result valid:", JSON.stringify(result, null, 2));

    console.log("Testing parseMatrixCSV with empty array...");
    const resultEmpty = parseMatrixCSV([]);
    console.log("Result empty:", JSON.stringify(resultEmpty, null, 2));

    console.log("Testing parseMatrixCSV with null...");
    const resultNull = parseMatrixCSV(null);
    console.log("Result null:", JSON.stringify(resultNull, null, 2));

    console.log("Testing parseMatrixCSV with undefined...");
    const resultUndefined = parseMatrixCSV(undefined);
    console.log("Result undefined:", JSON.stringify(resultUndefined, null, 2));

} catch (error) {
    console.error("Error caught:", error);
}
