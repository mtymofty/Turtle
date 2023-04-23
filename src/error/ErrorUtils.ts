import { ErrorType, WarningType } from "./ErrorType";

export class ErrorUtils {
    static error_mess: Record<ErrorType, string> = {
        [ErrorType.STRING_EOL_ERR]: `ERROR - UNEXPECTED EOL WHILE PARSING STRING`,
        [ErrorType.STRING_EOF_ERR]: `ERROR - UNEXPECTED EOF WHILE PARSING STRING`,
        [ErrorType.STRING_LEN_ERR]: "ERROR - EXCEEDING LENGTH OF A STRING!",
        [ErrorType.IDENT_LEN_ERR]: "ERROR - EXCEEDING LENGTH OF AN IDENTIFIER!",
        [ErrorType.NUM_PREC_ZERO_ERR]: "ERROR - PRECEDING ZERO IN A NUMERIC CONSTANT!",
        [ErrorType.DOUBLE_EXC_VAL_ERR]: "ERROR - EXCEEDING VALUE OF A NUMERIC CONSTANT (DOUBLE)!",
        [ErrorType.INTEGER_EXC_VAL_ERR]: "ERROR - EXCEEDING VALUE OF A NUMERIC CONSTANT (INT)!",
        [ErrorType.OPERATOR_PARSE_ERR]: `ERROR WHILE PARSING "$ " OPERATOR\nEXPECTED "$" GOT "$ "`,
        [ErrorType.UNREC_TOKEN_ERR]: `ERROR - UNRECOGNIZED TOKEN: "$"`,
        [ErrorType.NEWLINE_ERR]: `CRITICAL ERROR - ENCOUNTERED TWO DIFFERENT NEWLINE SIGNS - CORRUPTED FILE`
    }

    static warning_mess: Record<WarningType, string> = {
        [WarningType.STRING_ESC_WARN]: "WARNING - TRIED TO ESCAPE UNESCAPABLE CHARACTER",
    }
}
