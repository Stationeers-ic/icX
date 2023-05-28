export const ErrorCodes: { [errorCode: number]: string } = Object.freeze(
    {
        101: 'You can`t use "alias" in icX',
        201: '"{0}" is not defined',
        202: 'Invalid constant value',
        203: 'Invalid constant value',
        204: 'Identifier "{0}" has already been declared',
        205: 'Variable "{0}" is not valid',
        401: "Infinity is used",
        402: "Division by zero",
        403: "Modulo by zero",
        209: "Other error in constant declaration",
        208: "Invalid device",
        207: "Invalid right part",
        206: "Unknown function {0}",
        210: "return is not inside the function",
        211: "duplicated aliases in function {0}",


        901: "Iternal constant use variable",
    })
export default ErrorCodes
