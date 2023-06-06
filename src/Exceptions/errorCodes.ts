export const ErrorCodes: Readonly<{ [errorCode: number]: string }> = {
    101: '"{0}" is not supported',
    102: '"{0}" in "{1}" is not supported',
    103: '"{0}" is not already declared at position "{1}"',
    104: '"{0}" is not a valid number',
    105: "",
    106: 'Operator "{0}" is not supported',
    107: "Strings are not supported",
    108: 'Variable "{0}" is a reserved for internal use',
    901: "Internal error",
    902: 'Variable "{0}" is not found',
    // 202: 'Invalid constant value',
    // 205: 'Variable "{0}" is not valid',
    // 201: '"{0}" is not defined',
    // 202: 'Invalid constant value',
    // 203: 'Invalid constant value',
    // 204: 'Identifier "{0}" has already been declared',
    // 205: 'Variable "{0}" is not valid',
    // 401: "Infinity is used",
    // 402: "Division by zero",
    // 403: "Modulo by zero",
    // 209: "Other error in constant declaration",
    // 208: "Invalid device",
    // 207: "Invalid right part",
    // 206: "Unknown function {0}",
    // 210: "return is not inside the function",
    // 211: "duplicated aliases in function {0}",

    // 902: "It is forbidden to use {0}",
    // 901: "Internal constant use variable",
    // 956: "No implementation for function {0}",
};
export default ErrorCodes;
