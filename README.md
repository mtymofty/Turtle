# TKOM - Turtle

## Opis języka
Język programowania **Turtle** umożliwia interaktywne tworzenie obrazów poprzez sterowanie żółwiem potrafiącym rysować różnego rodzaju kształty, o zadanym kolorze i wymiarach.

## Konstrukcje językowe

### Zmienne

    a = b;				<- Inicjalizacja zmiennej

#### Przykłady:

    length = 10;		<- Zmienna typu integer
    diagonal = 100.75;	<- Zmienna typu double
    v_null = null;		<- Zmienna typu null
    truth = True;		<- Zmienna typu boolean
    text = "Text";		<- Zmienna typu string

### Operatory arytmetyczne

    a + b		<- dodawanie
    a - b		<- odejmowanie
    a / b		<- dzielenie
    a * b		<- mnożenie
    a ^ b		<- potęgowanie
    a // b		<- dzielenie całkowite
    a % b 		<- modulo
    a++			<- inkrementacja
    a--			<- dekrementacja
  
  #### Przykłady:
  
    sum = 10 + 5;
    diff = 10 - 5;
    quot = 10 / 5;
    prod = 10 * 5;
    exp = 10 ^ 5;
    qout_int = 10 // 5;
    modulo = 10 % 5;
    incr++;
    decr--;

### Operatory porównania

    a == b		<- równe
    a != b		<- różne
    a > b		<- większe
    a >= b		<- większe lub równe
    a < b		<- mniejsze
    a <= b		<- mniejsze lub równe
    
### Operatory logiczne

    a and b		<- a oraz b
    a && b		<- a oraz b
    a or b		<- a lub b
    a || b		<- a lub b
    not a		<- nie a
    !a			<- nie a
    


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
	    res = True;
	} else unless(len % 2 == 0) {	<- Jeśli len nie jest podzielne przez 2
		res = False;
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
#### Przykłady:

    for(i = 0; i < 5; i++) {
	    j++;
	}

    while(i<5) {
	    j++;
	    i++;
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
    print(True);
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
		enabled = True;
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
	
	zolw.pen.enabled = False;
	zolw.pen.color.r = 255;
	zolw.forward(10);
	
	zolw.pen.enabled = True;
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

## Obsługa błędów
### Syntax Error
SyntaxError: invalid syntax!
line 1, col 1:  "%^abc = 5;"

SyntaxError: unexpected EOF!
 line 1, col 9:  "abc = (5"

### Name Error
NameError: name is not defined!
line 1, col 1:  "abc == 5;"

### TypeError
TypeError: unsupported operand type
line 1, col 12:  "abc = True + "abc";"

### ZeroDivisionError



## Sposób uruchomienia, wej./wyj.

## Wymagania funkcjonalne

## Sposób realizacji


## Testowanie
Poprawne działanie **leksera** sprawdzanie będzie przy użyciu testów jednostkowych weryfikujących wykrywanie pojedynczych tokenów (zarówno poprawnych jak i niepoprawnych). Testy niepoprawne będą przeprowadzane między innymi korzystając z typowych błędów, które mogą przydarzyć się podczas pisaniu kodu, np. literówka, lub brak domknięcia cudzysłowia.

Dla każdej produkcji **parsera** powstanie test jednostkowy sprawdzający jej poprawność.  Dodatkowo przeprowadzone zostaną testy dla scenariuszy nieprawidłowych sekwencji tokenów. 

**Interpreter** będzie sprawdzany będzie poprzez testowanie pełnego potoku przetwarzania na podstawie łańcucha znaków lub pliku wejściowego.
