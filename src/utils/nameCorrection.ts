/**
* Take a string in input and format it to a proper noun.
* egs:
*   nameCorrection("NAME") -> Name
*   nameCorrection("name") -> Name
*   nameCorrection("nAME") -> Name
*/

const nameCorrection = (str: string): string => {
    return str.length > 0 ? str[0].toUpperCase() + str.slice(1).toLowerCase() : '';
}

export { nameCorrection }
