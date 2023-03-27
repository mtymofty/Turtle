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
    truth = True;		<- Stała typu boolean
    text = "Text";		<- Stała typu string

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
  
### Funkcje wbudowane

    print(message)		<- Funkcja służąca do wypisywania w konsoli wiadomości lub danych
    input(message) 		<- Funkcja przyjmująca dane wejściowe od użytkownika, wypisuje wiadomość i czeka na input
#### Przykłady

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

***Pen*** - obiekt długopisu, umożliwia modyfikowanie cech linii rysowanych przez żółwia.
Atrybuty:
 - *enabled* - wartość boolowska, reprezentuje informację czy długopis może obecnie rysować.
 - *color* - obiekt typu ***Color***

***Position*** - obiekt reprezentujący pozycję żółwia.
Atrybuty:
 - *x* - współrzędna x żółwia
 - *y* - współrzędna y żółwia

***Color*** - obiekt reprezentujący kolor długopisu żółwia.
Atrybuty:
 - *a* - przezroczystość
 - *r* - składowa czerwona
 - *g* - składowa zielona
 - *b* - składowa niebieska

Konstruktor:
Color(a, r, g, b)


### Obiekty

    obj.method()		<- wywołanie metody obiektu
    data = obj.attr		<- dostęp do atrybutu obiektu
    obj.attr = data		<- przypisanie wartości atrybutu

#### Przykłady:

    zolw = Turtle();
	zolw.pen.color = Color(23,123,43,234);
	zolw.pen.color.r = 43;
	zolw.forward(10)  ;

	kolor = zolw.pen.color;  
	kolor.g = 234; 
	
	zolw2 = Turtle();  
	zolw2.pen.color = kolor;  
	zolw2.position = zolw1.position ;
	zolw2.right();

## Obsługa błędów
