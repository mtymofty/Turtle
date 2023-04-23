import { TokenType } from "../token/TokenType";

export class TokenUtils {
    static simple_one_char_ops: Record<string, TokenType> = {
        "+": TokenType.ADD_OP,
        "-": TokenType.MINUS_OP,
        "*": TokenType.MULT_OP,
        "^": TokenType.POW_OP,
        "%": TokenType.MOD_OP,
        ".": TokenType.DOT_OP,
        "(": TokenType.L_BRACE_OP,
        "{": TokenType.L_C_BRACE_OP,
        ")": TokenType.R_BRACE_OP,
        "}": TokenType.R_C_BRACE_OP,
        ",": TokenType.COMMA_OP,
        ";": TokenType.TERMINATOR
    }

    static extendable_one_char_ops: Record<string, TokenType> = {
        "=": TokenType.ASSIGN_OP,
        "!": TokenType.NOT_OP,
        ">": TokenType.GRT_OP,
        "<": TokenType.LESS_OP,
        "/": TokenType.DIV_OP
    }

    static extended_two_char_ops: Record<string, TokenType> = {
        "==": TokenType.EQ_OP,
        "!=": TokenType.NEQ_OP,
        ">=": TokenType.GRT_EQ_OP,
        "<=": TokenType.LESS_EQ_OP,
        "//": TokenType.DIV_INT_OP
    }

    static double_char_ops: Record<string, TokenType> = {
        "&&": TokenType.AND_OP,
        "||": TokenType.OR_OP
    }

    static keywords: Record<string, TokenType> = {
        "func": TokenType.FUN_KW,
        "return": TokenType.RET_KW,
        "while": TokenType.WHILE_KW,
        "break": TokenType.BREAK_KW,
        "continue": TokenType.CONTINUE_KW,
        "null": TokenType.NULL_KW,
        "if": TokenType.IF_KW,
        "else": TokenType.ELSE_KW,
        "unless": TokenType.UNLESS_KW,
        "true": TokenType.TRUE_KW,
        "false": TokenType.FALSE_KW
    }

    static escapable: Record<string, string> = {
        "n": "\n",
        "t": "\t",
        '\"': '"',
        "\\": "\\"
     }
}
