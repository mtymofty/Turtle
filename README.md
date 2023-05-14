# TKOM - Turtle

## Opis języka
Język programowania **Turtle** umożliwia interaktywne tworzenie obrazów poprzez sterowanie żółwiem potrafiącym rysować różnego rodzaju kształty, o zadanym kolorze i wymiarach.


## Dozwolone konstrukcje językowe

### Operator przypisania

    a = b;                  <- Inicjalizacja zmiennej
   Język jest **słabo** oraz **dynamicznie** typowany. Wszystkie zmienne są **mutowalne**.

#### Przykłady:

    length = 10;            <- Zmienna typu integer
    diagonal = 100.75;      <- Zmienna typu double
    v_null = null;          <- Zmienna typu null
    truth = true;           <- Zmienna typu boolean
    text = "Text";          <- Zmienna typu string

### Operatory arytmetyczne

    a + b                   <- dodawanie
    a - b                   <- odejmowanie
    a / b                   <- dzielenie
    a * b                   <- mnożenie
    a ^ b                   <- potęgowanie
    a // b                  <- dzielenie całkowite
    a % b                   <- modulo

  #### Przykłady:

    sum = 10 + 5;
    diff = 10 - 5;
    quot = 10 / 5;
    prod = 10 * 5;
    exp = 10 ^ 5;
    qout_int = 10 // 5;
    modulo = 10 % 5;

### Operatory porównania

    a == b                  <- równe
    a != b                  <- różne
    a > b                   <- większe
    a >= b                  <- większe lub równe
    a < b                   <- mniejsze
    a <= b                  <- mniejsze lub równe

### Operatory logiczne

    a && b                  <- a oraz b
    a || b                  <- a lub b


### Operatory unarne

    !a                      <- nie a
    -a                      <- minus a



### Instrukcje warunkowe

    if(condition){          <- wykonaj jeśli warunek jest prawdą
    ...
    }

    unless(condition){      <- wykonaj jeśli warunek nie jest prawdą
    ...
    }

    else if(condition){     <- wykonaj jeśli poprzedni warunek był fałszywy oraz obecny jest prawdą
    ...
    }

    else unless(condition){ <- wykonaj jeśli poprzedni warunek był fałszywy oraz obecny nie jest prawdą
    ...
    }

    else {                  <- wykonaj jeśli poprzednie warunki były fałszywe
    ...
    }

#### Przykłady:

    if(len < 10) {          <- Jeśli len mniejsze od 10
	    res = true;
	} else unless(len % 2 == 0) {   <- Jeśli len nie jest podzielne przez 2
	    res = false;
	} else {                <- W innym wypadku
	    res = null;
	}

### Instrukcje pętli

    while(condition) {      <- pętla wykonywana gdy warunek jest prawdą
    ...
    }

    break                   <- przerwij wykonywanie pętli

    continue                <- przejdź do kolejnej iteracji
#### Przykłady:

    while(i < 5) {
	    j = j + 1;
	    i = i + 1;
	}


### Definiowanie funkcji

    fun name(arg1, arg2 ...){   <- Funkcja posiada nazwę oraz przymuje ustaloną liczb argumentów.
	    ...
	    return data;            <- Funkcja może zwracać dane instrukcją return
    }
   Parametry funkcji przekazywane są przez **wartość**.
#### Przykłady:

    fun sum(a, b) {
	    return a + b;
	}

### Wywoływanie funkcji

    fun_name(arg1, arg2 ...);
#### Przykłady:

    c = sum(a, b);
    d = sum(5, 10);

### Komentarze

    # To jest komentarz...
    a = 5; 		# To również jest komentarz

### Obiekty

    obj.method();		<- wywołanie metody obiektu
    data = obj.attr;	<- dostęp do atrybutu obiektu
    obj.attr = data;	<- przypisanie wartości atrybutu

## Funkcje i obiekty wbudowane

### Funkcje wbudowane

    print(message)		<- Funkcja służąca do wypisywania w konsoli wiadomości lub danych
    input(message) 		<- Funkcja przyjmująca dane wejściowe od użytkownika, wypisuje wiadomość i czeka na input
#### Przykłady:

    print("Wiadomość do użytkownika");
    print(100);
    print(true);
    string = input("Proszę napisać wiadomość: ");

### Obiekty wbudowane

***Turtle*** - obiekt żółwia, jest używany do rysowania kształtów.

Metody:
- *forward(length)* - rysuje prostą linię o długości length
- *right()* - obraca żółwia o 90 stopni w prawo
- *left()* - obraca żółwia o 90 stopni w lewo
- *rotate(angle)* - obraca żółwia o zadany kąt

Atrybuty:
 - *pen* - obiekt typu ***Pen***
 - *position* - obiekt typu ***Position***
 - *angle* - kąt pod którym ustawiony jest żółw. Wartość z zakresu 0-359. Kąt zmienia się wedle wskazówek zegara.

Konstruktory:

    Turtle() - tworzy obiekt żółwia z domyślnymi atrybutami (czarnym długopisem, pozycją (x=0, y=0) i zwrotem w kierunku pionowym (angle=0))
    Turtle(pen, position, angle) - tworzy obiekt żółwia z podanymi przez użytkownika atrybutami

***Pen*** - obiekt długopisu, umożliwia modyfikowanie cech linii rysowanych przez żółwia.

Atrybuty:
 - *enabled* - wartość boolowska, reprezentuje informację czy długopis może obecnie rysować.
 - *color* - obiekt typu ***Color***

Konstruktory:

    Pen() - tworzy obiekt długopisu z domyślnymi atrybutami (piszący i czarny)
    Pen(enabled, color) - tworzy obiekt długopisu z podanymi przez użytkownika atrybutami

***Position*** - obiekt reprezentujący pozycję żółwia.

Atrybuty:
 - *x* - współrzędna x żółwia
 - *y* - współrzędna y żółwia

Konstruktory:

    Position() - tworzy obiekt pozycji z domyślnymi atrybutami (x=0, y=0)
    Position(x, y) - tworzy obiekt pozycji z podanymi przez użytkownika atrybutami

***Color*** - obiekt reprezentujący kolor długopisu żółwia.

Atrybuty:
 - *a* - przezroczystość (widoczność)
 - *r* - składowa czerwona
 - *g* - składowa zielona
 - *b* - składowa niebieska

Konstruktory:

    Color() - tworzy obiekt koloru z domyślnymi atrybutami (100% widoczności, kolor czarny)
    Color(a, r, g, b) - tworzy obiekt koloru z podanymi przez użytkownika atrybutami

### Przykłady

#### Rysowanie kwadratu:

    rysuj_kwadrat(zolw, bok) {
	    i = 0;
	    while (i<=3) {
	    	zolw.forward(bok);
	    	zolw.right();
	    	i = i + 1;
	    }
	}

	zolw = Turtle();
	rysuj_kwadrat(zolw, 10);

#### Rysowanie kolorowej linii

    zolw = Turtle();
	zolw.pen.color = Color(100,0,255,0);
	zolw.forward(10);

	zolw.pen.enabled = false;
	zolw.pen.color.r = 255;
	zolw.forward(10);

	zolw.pen.enabled = true;
	zolw.pen.color.g = 0;
	zolw.forward(10);

	zolw.pen.color.b = 255;
	zolw.forward(10);

#### Definiowanie kilku żółwi

    zolw = Turtle();
	zolw.pen.color = Color(100,0,255,0);

	kolor = zolw.pen.color;
	kolor.r = 255;

	zolw2 = Turtle();
	zolw2.pen.color = kolor;
	zolw2.position = zolw.position;

## Niedozwolone konstrukcje językowe

    Wielokrotne użycie operatorów porównania - dozwolone jest porównanie maksymalnie dwóch obiektów w jednym wyrażeniu:
    if (a > b < c > d) ...

	Definiowanie funkcji wewnątrz innej funkcji:
	fun foo() {
	    ...
	    fun foo_too() {
	    	...
	    }
	...
	}


## Formalna specyfikacja i składnia EBNF

### Priorytety i łączność operatorów
| Operatory                                      		| Zapis           	| Łączność     	|
|-														|-					|-				|
| Nawiasowania                                   		|        ()       	|  lewostronna 	|
| Dostępu do atrybutu i wywołania funkcji/metody        |       . ()      	|  lewostronna 	|
| Potęgowania                                    		|        ^        	| prawostronna 	|
| Unarne                                        		|        ! -        | prawostronna 	|
| Multiplikatywne                                		|     * / // %    	|  lewostronna 	|
| Addytywne                                      		|       + -       	|  lewostronna 	|
| Relacyjne                                      		| > >= < <= == != 	|  lewostronna 	|
| Koniunkcji                                     		|        &&       	|  lewostronna 	|
| Alternatywy                                    		|       \|\|      	|  lewostronna 	|
| Przypisania                                   		|       =      		| prawostronna 	|

### Gramatyka - EBNF

    LEKSYKA:
    non_zero_digit  = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    digit           = '0' | non_zero_digit;
    integer         = '0' | non_zero_digit, {digit};
    double          = integer, '.', {digit};

    boolean         = 'true' | 'false';

    letter          = 'A-Z' | 'a-z';
    escapable       = 't' | 'n' | '"' | '\';
    escaped         = '\', escapable;
    symbol          = "~" | "`" | "!" | "@" | "#" | "$" | "%" | "^" | "&"
	                  | "*" | "(" | ")" | "-" | "_" | "=" | "+" | "[" | "]"
	                  | "{" | "}" | ";" | ":" | "'" | "|" | "," | "<" | "."
	                  | ">" | "/" | "?";
	char            = letter | escaped | symbol | digit | " ";
    string          = '"', {char}, '"';

	identifier      = letter, {letter | digit | "_"};

    assign_op       = '=';
    and_op          = '&&';
    or_op           = '||';
    rel_op          = '>' | '>=' | '<' | '<=' | '==' | '!=';
    add_op          = '+' | '-';
    mult_op         = '*' | '/' | '//' | '%';
    unar_op         = '!' | '-';
    pow_op          = '^';

    terminator      = ';'


    SKLADNIA:
    program             = {instruction};
    instruction         = fun_def;

    fun_def             = 'fun', identifier, '(', [params], ')', statement_block;
    statement_block     = '{', {statement}, '}';

	statement           = simple_statement, terminator
	                      | compound_statement

    simple_statement    = obj_access, [assign_statement]
	                      | return_statement
	                      | 'break'
	                      | 'continue';

	compound_statement  = if_statement
	                      | while_statement;

    params              = identifier, {",", identifier}

	obj_access          = member {'.', member };
    member              = identifier, ['(' [args] ')'];
	args                = expression, {",", expression};

    assign_statement    = assign_op, expression;
	return_statement    = 'return', [expression];

	if_statement        = if_kw, '(', expression, ')', statement_block,
	                      ['else', statement_block];
	if_kw               = 'if' | 'unless';

	while_statement     = 'while', '(', expression, ')', statement_block

    expression          = disjunction;
    disjunction         = conjunction, {or_op, conjunction};
    conjunction         = comparison, {and_op, comparison};
    comparison          = sum_sub, [rel_op, sum_sub];
    sum_sub             = term, {add_op, term};
    term                = factor, {mult_op, factor};
    factor              = [unar_op], power;
    power               = primary, {pow_op, primary};
    primary             = parenth_expression | constant | obj_access;

    parenth_expression  = "(", expression, ")";
    constant            = int | double | string | boolean | null;


## Obsługa błędów
Błędy zgłaszane w trakcie analizy nie powodują jej przerwania.

### Błędy leksykalne

**LexerError**: unrecognized token!
"~abc = 5;" - line 1, col 1

**LexerError**: exceeding length of an identifier!
"abcdefg(...) = 5;" - line 1, col 101

**LexerError**: exceeding value of a numeric constant (int)!
"abc = 2147483648;" - line 1, col 16

### Błędy składniowe
**SyntaxError**: invalid syntax, missing closing bracket!
line 1, col 9:  "abc = (5;"

**SyntaxError**: invalid syntax, missing semicolon!
line 1, col 8:  "abc = 5"

**SyntaxError**: invalid syntax, encountered unexpected loop statement while parsing expression!
line 1, col 7:  "abc = while(True);"

**SyntaxError**: invalid syntax, missing opening bracket!
line 1, col 5:  "for i=0; i<5; i++) {"

**SyntaxError**: invalid syntax, cannot compare more than two objects in one expression!
line 1, col 11:  "if (a > b < c > d) {"

**SyntaxError**: invalid syntax, cannot define a function inside a function!
line 15, col 1:  "fun foo_too(){"

### Błędy semantyczne

**TypeError**: unsupported operand type!
line 1, col 12:  "abc = True + "str";"

**TypeError**: unsupported operand type!
line 1, col 11:  "abc = "str" ** 2;"

**TypeError**: invalid number of arguments for a function!
line 10, col 22:  "two_arg_fun(first_arg);"

**NameError**: variable name is not defined!
line 1, col 7:  "abc = undef_var;"

**NameError**: function name is not defined!
line 1, col 1:  "undef_fun();"

**ZeroDivisionError**: cannot divide by zero!
line 1, col 9:  "abc = 5/0;"

## Sposób uruchomienia, wej./wyj.
Program będzie uruchamiany przez odpowiedni skrypt, otrzymujący plik tekstowy z zapisanym kodem jako parametr.

## Wymagania
1. Program będzie w stanie przeanalizować i wykonać poprawnie skonstruowane instrukcje w zdefiniowanym języku.
2. Język będzie umożliwiał rysowanie kształtów w wyświetlanym dla użytkownika oknie.
3. Możliwa będzie modyfikacja:
   - koloru linii
   - długości linii
   - kierunku (kąta) rysowania
   - pozycji, z której rozpoczyna się rysowanie
4. Program będzie informował użytkownika o pomyłkach w kodzie pod postacią komunikatu o błędzie. Ponadto przekazana zostanie użytkownikowi informacja o miejscu wystąpienia błędu (linia oraz kolumna) wraz z zawierającą go częścią kodu.
5. Zaimplementowane będą mechanizmy zabezpieczające przed błędami, takie jak maksymalna długość tokenu, graniczne wartości stałych liczbowych i maksymalna długość łańcucha znaków.
6. Możliwe będzie zatrzymanie wykonania programu przy użyciu skrótu klawiszowego.
7. Program uniemożliwi zdefiniowanie dwóch funkcji o tych samych nazwach.
8. Zmienne definiowane w języku będą miały określony zasięg (scope): globalny, lokalny, blokowy

## Sposób realizacji
<img title="Graf" alt="Graf modułów" src="https://i.imgur.com/0vBynHX.jpg">

Do **leksera** trafiają szeregowo znaki z kodu źródłowego, które są analizowane leksykalnie i tokenizowane.
Wyprodukowane tokeny trafiają następnie do **parsera**, który dokonuje analizy składniowej i buduje na ich podstawie drzewo składniowe AST.
Ostatecznie **interpreter** wykonuje program sprawdzając przy okazji poprawność semantyczną.
Dodatkowo moduł **obsługi błędów**, komunikujący się z każdym z wymienionych komponentów, będzie odpowiedzialny za informowanie użytkownika o występujących w kodzie błędach.

### Lekser
Lekser pobiera znaki leniwie, pojedynczo znak po znaku. Odpowiednio skonstruowane wedle zasad języka ciągi znaków grupowane są w tokeny. W przypadku, gdy niemożliwe jest zidentyfikowanie tokenu lub łamane jest któreś z istniejących zabezpieczeń (np. na wartość stałej liczbowej) wywoływany jest błąd. Nie przerywa to jednak wykonania programu, aby zapewnić bardziej obszerną analizę.

#### Typy tokenów

 - IDENTIFIER
 - INT
 - DOUBLE
 - STRING
 - KEYWORDS
	 - FUN_KW
	 - RET_KW
	 - WHILE_KW
	 - BREAK_KW
	 - CONTINUE_KW
	 - TRUE_KW
	 - FALSE_KW
	 - NULL_KW
	 - IF_KW
	 - ELSE_KW
	 - UNLESS_KW
 - ARITHMETIC
	 - ASSIGN_OP
	 - ADD_OP
	 - MULT_OP
	 - DIV_OP
	 - DIV_INT_OP
	 - POW_OP
	 - MOD_OP
 - COMPARISON
	 - EQ_OP
	 - NEQ_OP
	 - GRT_OP
	 - GRT_EQ_OP
	 - LESS_OP
	 - LES_EQ_OP
 - LOGICAL
	 - AND_OP
	 - OR_OP
 - UNARY
	 - NOT_OP
	 - MINUS_OP
 - DOT_OP
 - L_BRACE
 - L_C_BRACE
 - R_BRACE
 - R_C_BRACE
 - COMMA
 - SEMICOL
 - EOF
 - UNRECOGNIZED


## Testowanie
Poprawne działanie **leksera** sprawdzanie będzie przy użyciu testów jednostkowych weryfikujących wykrywanie pojedynczych tokenów (zarówno poprawnych jak i niepoprawnych). Testy niepoprawne będą przeprowadzane między innymi korzystając z typowych błędów, które mogą przydarzyć się podczas pisaniu kodu, np. literówka, lub brak domknięcia cudzysłowia.

Dla każdej produkcji **parsera** powstanie test jednostkowy sprawdzający jej poprawność.  Dodatkowo przeprowadzone zostaną testy dla scenariuszy nieprawidłowych sekwencji tokenów.

**Interpreter** będzie sprawdzany będzie poprzez testowanie pełnego potoku przetwarzania na podstawie łańcucha znaków lub pliku wejściowego.
