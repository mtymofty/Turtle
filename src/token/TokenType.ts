export enum TokenType {
    INTEGER,
    DOUBLE,
    STRING,

    IDENTIFIER,
    FUN_KW,
    RET_KW,
    WHILE_KW,
    BREAK_KW,
    CONTINUE_KW,
    NULL_KW,
    IF_KW,
    ELSE_KW,
    UNLESS_KW,

    ASSIGN_OP,
    ADD_OP,
    MULT_OP,
    DIV_OP,
    DIV_INT_OP,
    POW_OP,
    MOD_OP,

    EQ_OP,
    NEQ_OP,
    GRT_OP,
    GRT_EQ_OP,
    LESS_OP,
    LESS_EQ_OP,

    AND_OP,
    OR_OP,

    NOT_OP,
    MINUS_OP,

    DOT_OP,
    L_BRACE_OP,
    L_C_BRACE_OP,
    R_BRACE_OP,
    R_C_BRACE_OP,
    COMMA_OP,
    TERMINATOR,

    EOF,
    UNDEFINED
}