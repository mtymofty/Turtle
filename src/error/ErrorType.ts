export enum ErrorType {
    STRING_EOL_ERR,
    STRING_EOF_ERR,
    STRING_LEN_ERR,
    IDENT_LEN_ERR,
    NUM_PREC_ZERO_ERR,
    DOUBLE_EXC_VAL_ERR,
    INTEGER_EXC_VAL_ERR,
    OPERATOR_PARSE_ERR,
    UNREC_TOKEN_ERR,
    NEWLINE_ERR,
    PATH_ERR,

    INVALID_TOKEN_ERR,
    PARAMS_LEFT_BRACE_ERR,
    PARAMS_RIGHT_BRACE_ERR,
    PARAMS_COMMA_ERR,
    PARAM_NAME_ERR,
    FUN_BLOCK_ERR,
    FUN_IDENTIFIER_ERR,
    FUN_NAME_ERR,
    BLOCK_END_ERR,
    TERMINATOR_ERR,
    IF_LEFT_BRACE_ERR,
    IF_RIGHT_BRACE_ERR,
    IF_COND_ERR,
    IF_BLOCK_ERR,
    ELSE_BLOCK_ERR,
    WHILE_LEFT_BRACE_ERR,
    WHILE_RIGHT_BRACE_ERR,
    WHILE_COND_ERR,
    WHILE_BLOCK_ERR,
    IDENT_MEM_ACCESS_ERR,
    ASSIGN_ERR,
    FUN_METH_CALL_ERR,
    ARGS_COMMA_ERR,
    ARGS_RIGHT_BRACE_ERR,
    OBJ_ACC_ERR,
    PARENTH_RIGHT_BRACE_ERR,
    OR_EXPR_ERR,
    ADD_EXPR_ERR,
    AND_EXPR_ERR,
    DIV_EXPR_ERR,
    MULT_EXPR_ERR,
    COMP_EXPR_ERR,
    SUB_EXPR_ERR,
    EXP_EXPR_ERR,
    NEG_EXPR_ERR,
    INTDIV_EXPR_ERR,
    MODULO_EXPR_ERR,
    COMP_NUM_ERR,

    MAIN_FUN_ERR,
    MAIN_PARAM_ERR,
    FUN_UNDEF_ERR,
    ARGS_NUM_ERR,
    VAR_UNDEF_ERR,
    ADD_TYPE_ERR,
    SUBTR_TYPE_ERR,
    DIV_TYPE_ERR,
    INTDIV_TYPE_ERR,
    MOD_TYPE_ERR,
    MULT_TYPE_ERR,
    EXP_TYPE_ERR,
    AND_TYPE_ERR,
    OR_TYPE_ERR,
    NEG_TYPE_ERR,
    LOG_NEG_TYPE_ERR,
    EQ_TYPE_ERR,
    NEQ_TYPE_ERR,
    GRT_TYPE_ERR,
    GRTEQ_TYPE_ERR,
    LESS_TYPE_ERR,
    LESSEQ_TYPE_ERR
}

export enum WarningType {
    STRING_ESC_WARN
}
