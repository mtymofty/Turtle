# TKOM - Turtle

## Opis języka
Język programowania **Turtle** umożliwia interaktywne tworzenie obrazów poprzez sterowanie żółwiem potrafiącym rysować różnego rodzaju kształty, o zadanym kolorze i wymiarach.

## Konstrukcje językowe

### Operator przypisania

    a = b;				<- Inicjalizacja zmiennej

#### Przykłady:

    length = 10;		<- Zmienna typu integer
    diagonal = 100.75;	<- Zmienna typu double
    v_null = null;		<- Zmienna typu null
    truth = true;		<- Zmienna typu boolean
    text = "Text";		<- Zmienna typu string

### Operatory arytmetyczne

    a + b		<- dodawanie
    a - b		<- odejmowanie
    a / b		<- dzielenie
    a * b		<- mnożenie
    a ^ b		<- potęgowanie
    a // b		<- dzielenie całkowite
    a % b 		<- modulo
  
  #### Przykłady:
  
    sum = 10 + 5;
    diff = 10 - 5;
    quot = 10 / 5;
    prod = 10 * 5;
    exp = 10 ^ 5;
    qout_int = 10 // 5;
    modulo = 10 % 5;

### Operatory porównania

    a == b		<- równe
    a != b		<- różne
    a > b		<- większe
    a >= b		<- większe lub równe
    a < b		<- mniejsze
    a <= b		<- mniejsze lub równe
    
### Operatory logiczne

    a && b		<- a oraz b
    a || b		<- a lub b
    

### Operatory unarne

    !a			<- nie a
    -a			<- minus a
    


### Instrukcje warunkowe

    if(condition){			<- wykonaj jeśli warunek jest prawdą
    ...
    }
    
    unless(condition){		<- wykonaj jeśli warunek nie jest prawdą
    ...
    }
    
    else if(condition){	<- wykonaj jeśli poprzedni warunek był fałszywy oraz obecny jest prawdą
    ...
    }

    else unless(condition){	<- wykonaj jeśli poprzedni warunek był fałszywy oraz obecny nie jest prawdą
    ...
    }

    else {					<- wykonaj jeśli poprzednie warunki były fałszywe
    ...
    }
    
#### Przykłady:

    if(len < 10) {					<- Jeśli len mniejsze od 10
	    res = true;
	} else unless(len % 2 == 0) {	<- Jeśli len nie jest podzielne przez 2
		res = false;
	} else {							<- W innym wypadku
		res = null;
	}

### Instrukcje pętli

    for(exp1; exp2; exp3) {	<- exp1 wykonywane raz przed pętlą, exp2 to warunek wykonywania pętli, exp3 wykonywane zawsze po każdej iteracji. 
    ...
    }
    
    while(condition) {			<- pętla wykonywana gdy warunek jest prawdą
    ...
    }
    
    break		<- przerwij wykonywanie pętli
    
    continue		<- przejdź do kolejnej iteracji
#### Przykłady:

    for(i = 0; i < 5; i++) {
	    j = j + 1;
	}

    while(i < 5) {
	    j = j + 1;
	    i = i + 1;
	}


### Definiowanie funkcji

    fun name(arg1, arg2 ...){	<- Funkcja posiada nazwę oraz przymuje ustaloną liczb argumentów.
    ...
    return data					<- Funkcja może zwracać dane instrukcją return
    }
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

    obj.method()		<- wywołanie metody obiektu
    data = obj.attr		<- dostęp do atrybutu obiektu
    obj.attr = data		<- przypisanie wartości atrybutu
  
## Funkcje i obiekty wbudowane

### Funkcje wbudowane

    print(message)		<- Funkcja służąca do wypisywania w konsoli wiadomości lub danych
    input(message) 		<- Funkcja przyjmująca dane wejściowe od użytkownika, wypisuje wiadomość i czeka na input
#### Przykłady:

    print("Wiadomość do użytkownika");
    print(100);
    print(true);
    string = input("Proszę napisać wiadomość: ")
    
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

Konstruktory:

    fun init(pen_, position_){
		pen = pen_;
		position = position_;
    }
     
    fun init(){
		pen = Pen(True, Color(100, 0, 0, 0));
		position = Position(0, 0);
    }

***Pen*** - obiekt długopisu, umożliwia modyfikowanie cech linii rysowanych przez żółwia.
Atrybuty:
 - *enabled* - wartość boolowska, reprezentuje informację czy długopis może obecnie rysować.
 - *color* - obiekt typu ***Color***

Konstruktory:

    fun init(enabled_, color_){
		enabled = enabled_;
		color = color_;
    }
     
    fun init(){
		enabled = true;
		color = Color(100, 0, 0, 0);
    }

***Position*** - obiekt reprezentujący pozycję żółwia.
Atrybuty:
 - *x* - współrzędna x żółwia
 - *y* - współrzędna y żółwia

Konstruktory:

    fun init(x_, y_){
		x = x_;
		y = y_;
    }
     
    fun init(){
		x = 0;
		y = 0;
    }

***Color*** - obiekt reprezentujący kolor długopisu żółwia.
Atrybuty:
 - *a* - przezroczystość
 - *r* - składowa czerwona
 - *g* - składowa zielona
 - *b* - składowa niebieska

Konstruktory:

    fun init(a_, r_, g_, b_){
		a = a_;
		r = r_;
		g = g_;
		b = b_;
    }
     
    fun init(){
		a = 100;
		r = 0;
		g = 0;
		b = 0;
    }
    
    
### Przykłady

#### Rysowanie kwadratu:

    rysuj_kwadrat(zolw, bok) { 
	    for(i=0; i<=3; i++) { 
			zolw.forward(bok);  
			zolw.right();  
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
	  
	kolor = zolw.pen.color 
	kolor.r = 255; 
	
	zolw2 = Turtle();  
	zolw2.pen.color = kolor;  
	zolw2.position = zolw.position


## Formalna specyfikacja i składnia EBNF

### Priorytety i łączność operatorów
| Operatory                                      								| Zapis           			| Łączność     		|
|-																						|-								|-							|
| Nawiasowania                                   							|        ()       				|  lewostronna 	|
| Dostępu do atrybutu i wywołania funkcji/metody 	|       . ()      				|  lewostronna 	|
| Unarne                                        									|        ! -        			| prawostronna 	|
| Potęgowania                                    							|        ^        				| prawostronna 	|
| Multiplikatywne                                							|     * / // %    			|  lewostronna 	|
| Addytywne                                      							|       + -       			|  lewostronna 	|
| Relacyjne                                      								| > >= < <= == != 	|  lewostronna 	|
| Koniunkcji                                     								|        &&       			|  lewostronna 	|
| Alternatywy                                    								|       \|\|      				|  lewostronna 	|
| Przypisania                                   								|       =      				| prawostronna 	|

### EBNF

    LEKSYKA:
    non_zero_digit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    digit = '0' | non_zero_digit;
    integer = '0' | non_zero_digit, {digit};
    double = integer, '.', integer;
    
    boolean = 'true' | 'false';
    
    letter = 'A-Z' | 'a-z';
    escapable = 't' | 'n' | '"' | '\';
    escaped = '\', escapable;
    symbol = "~" | "`" | "!" | "@" | "#" | "$" | "%" | "^" | "&" | 
			  "*" | "(" | ")" | "-" | "_" | "=" | "+" | "[" | "]" | 
			  "{" | "}" | ";" | ":" | "'" | "|" | "," | "<" | "." |
			  ">" | "/" | "?";
	char = letter | escaped | symbol | digit | " ";
    string = '"', {char}, '"';
    
	identifier = letter, {letter | digit | "_"} ;
    
    assign_op = '=';
    and_op = '&&';
    or_op = '||';
    rel_op = '>' | '>=' | '<' | '<=' | '==' | '!=';
    add_op = '+' | '-';
    mult_op = '*' | '/' | '//' | '%';
    pow_op = '^';
    unar_op = '!' | '-';
    dot_op = '.';
    
    terminator = ';'
    comment_sign = "#";
    
    SKLADNIA:
    constant = int | double | string | boolean | null;
    assignment = identifier, assign_op, expression;

    expression = bool_additive, {or_op, bool_additive};
    bool_additive = relational, {and_op, relational};
    relational = additive, [rel_op, additive];
    additive = multiplicative, {add_op, multiplicative};
    multiplicative = powerable, {mult_op, powerable};
    powerable = unarable, {pow_op, unarable};
    unarable = [unar_op], objectable;
    objectable = base_expr, {dot_op, base_expr}; 
    base_expr = parenth_expression | func_call | constant | identifier;
    parenth_expression = "(", expression, ")";
    
    
     

## Obsługa błędów

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

**SyntaxError**: invalid syntax!
line 1, col 7:  "abc = while(True);"

**SyntaxError**: invalid syntax, missing opening bracket!
line 1, col 5:  "for i=0; i<5; i++) {"

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

## Wymagania funkcjonalne

## Sposób realizacji
<img title="Graf" alt="Graf modułów" src="https://i.imgur.com/4mSGu26.png">  

Do **leksera** trafiają szeregowo znaki z kodu źródłowego, które są analizowane leksykalnie i tokenizowane.   
Wyprodukowane tokeny trafiają następnie do **parsera**, który dokonuje analizy składniowej i buduje na ich podstawie drzewo składniowe AST.
Ostatecznie **interpreter** wykonuje program sprawdzając przy okazji poprawność semantyczną.

### Lekser 

#### Typy tokenów

 - IDENTIFIER
 - INT
 - DOUBLE
 - STRING
 - KEYWORDS
	 - FUN_KW
	 - RET_KW
	 - FOR_KW
	 - WHILE_KW
	 - TRUE_KW
	 - FALSE_KW
	 - IF_KW
	 - ELSE_KW
	 - UNLESS_KW
	 - BREAK_KW
	 - CONTINUE_KW
	 - TURTLE_KW
	 - PEN_KW
	 - PISITION_KW
	 - COLOR_KW
 - ARITHMETICS
	 - ASSIGN_OP
	 - ADD_OP
	 - SUB_OP
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
 - EOL
 - EOF
 - UNRECOGNIZED
	

## Testowanie
Poprawne działanie **leksera** sprawdzanie będzie przy użyciu testów jednostkowych weryfikujących wykrywanie pojedynczych tokenów (zarówno poprawnych jak i niepoprawnych). Testy niepoprawne będą przeprowadzane między innymi korzystając z typowych błędów, które mogą przydarzyć się podczas pisaniu kodu, np. literówka, lub brak domknięcia cudzysłowia.

Dla każdej produkcji **parsera** powstanie test jednostkowy sprawdzający jej poprawność.  Dodatkowo przeprowadzone zostaną testy dla scenariuszy nieprawidłowych sekwencji tokenów. 

**Interpreter** będzie sprawdzany będzie poprzez testowanie pełnego potoku przetwarzania na podstawie łańcucha znaków lub pliku wejściowego.
