import XRegExp = require("xregexp")

export let is_letter = XRegExp('^\\p{L}$');
export let is_digit = XRegExp('^\\p{N}$');
