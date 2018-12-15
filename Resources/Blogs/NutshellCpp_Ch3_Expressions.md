# Cpp Notes - Expressions #

- Def: An expression combines literals, names, operators, and symbols to express or compute a value, or to achieve a side effect.


## 1. Lvalues & Rvalues

- Definition:

  -  `lvalue` is an **object reference**
    - an expression that yields an **object reference**, such as a variable name, an array subscript reference, a dereferenced pointer, or a function call that returns a reference.
    - always has a defined region of storage (addressable)
  -  `rvalue` is a **value**
    - an expression that is not an `lvalue`
    - Examples include literals, the results of most **operators**, and **fucntion calls** that **return nonreference**
    - Note: Strictly speaking, a function is an lvalue, but the only uses for it are to use it in calling the function, or determining the funciton’s address. 

- <span style="color: #ffffff; background-color:#008CBA;border: none; padding: 5px 15px; text-align: center; font-weight: bold;">C</span> The term `lvalue` is borrowed from C, where only an `lvalue` can be used on the left side of an assignment statement. `rvalue` is a logical counterpart.

  ```c
  #define RVALUE 42
  int lvalue;
  lvalue = RVALUE;
  ```

  **BUT**, it is no longer true in C++, but the names remain because they are convention & are true in most cases. 

  The most significant departure from traditional C is that an `lvalue` in C++ might be `const`, in which case it cannot be the target of an assignment. (C has since evolved and also has `const` lvalues).

- Operators:

  - Built-in assignment operators require an` lvalue` as their lefthand operand.

    - Same for built-in address (**&**) operator, increment (**++**) & decrement (**--**)

  - Other operators require rvalues.

  - The rules are **not as strict** for **user-defined** operators.

    - Any object, including an `rvalue`, can be used to call member functions, including overloaded **=, &, ++, and - - operators**.

  - Other rules:

    | `lvalue`                                                     | `rvalue`                                                   |
    | ------------------------------------------------------------ | ---------------------------------------------------------- |
    | Array                                                        | Address                                                    |
    | Array Subscript ([ ]),<br />dereference (unary *),<br />assignment (=, +=, etc),<br />increment (++), <br />decrement (—) produces lvalues | built-in operators produce rvalues                         |
    | A type cast to a reference type produce lvalues              | other casts produce rvalues                                |
    | A function call that returns a reference returns an lvalue   | Otherwise                                                  |
    | An lvalue is converted implicitly to an rvalue when necessary | but an rvalue **cannot** be implicitly converted to lvalue |

  - Examples:

    ```c++
    class number{
        public:
            number(int i=0):value(i){}
            operator int( ) const {return value;}
            number& operator={const number& N};
        private:
        	int value;
    };
    
    number operator+(const number& x, const number& y);
    
    int main(void){
        number a[10], b(42);
        number* p;
        a;		//lvalue - array
        a[0]; 	//lvalue - array subscript
        &a[0];	//rvalue - address
        *a;		//lvalue - dereference produces lvalue
        p; 		//lvalue - pointer object
        *p; 	//lvalue - pointer dereference
        10; 	//rvalue - number
        number(10); //rvalue - a func. doesn't return lvalue
        a[0] + b; 	//rvalue - built-in operators 
        b = a[0]; 	//lvalue
    }
    ```



## 2. Type Conversions

### 2.1 Arithmetic Types

- a fundamental integral or floating-point type:
  - `bool`, `char`, `signed char`, `unsigned char`, `int`, `short`,` long`,` unsigned int`, `unsigned short`, `unsigned long`,` float`, `double`, or `long double` .

### 2.2 Type Promotion

- An **automatic type conversion** that applies only to **arithmetic types**, 
  - converting a **“smaller” type => “larger” type**, while preserving the original value.
- **Rules**:
  - A “small” inegral rvalue **=>** an `int`, **if** the type `int ` can represent all of the values of the source type; otherwise, it is converted to `unsigned int`.
    - A “small” value: an integral bit-field (Chapter 6) whose size is smaller than an int
  - An rvalue whose type is `wchar_t` or an `enum` (including bit-fields with enum type) **=>** the first type that can hold all the values of the source type, from: ` int`, ` unsigned int`, `long`, or `unsigned long`.
  - An rvalue of `bool` **=>** an `int`; where its value `true` => 1, `false` => 0
  - An rvalue of `float` **=>** `double`

### 2.3 Arithmetic Type Conversions

- An auto type conversion that the **compiler** applies to the operands of the built-in arithmetic & comparison operators.

- Note: we are using “**=>**” as "**is converted to**"

- Try to **preserve** the original values as much as **possible**. **Do not always succeed**.

  > -1/1u **does not produce**  -1, because -1: `int`, which is firstly => `unsigned int`, yielding an implementation-defined arithmetic value. On a 32-bit, 2’s complement system, the result will be 4294967296u.

- **Rules** are applied in the following **order**:
  1. **If:** 		 one operand has type `long double` , the other => `long double`
  2. **else if:** one operand has type `double` , the other => `double`
  3. **else if:** one operand has type `float` , the other => `float`
  4. **else if:** integral promotions are performed 
  5. **After integral promotion**: if one operand is `unsigned long`, the other => `unsigned long`
  6. **else if:** one operand has type `long` , and the other is `unsigned int`, then:
     1. **if:** all values of `unsigned int` fit in a `long int`, the `unsigned int` is converted to `long int`.
     2. **else:** both operands => `unsigned long`
  7. **else if:** one operand has type `long` , the other => `long`
  8. **else if:** one operand has type `unsigned` , the other => `unsigned`
  9. **else:** both operands => `int`.

### 2.4 Implicit Numeric Conversions

- An arithmetic value can be converted implicitly  to a different arithmetic value, even if that conversion loses information.
- Ex:
  - `float`=>`int` , `float` is truncated toward zero by discarding the fractional part

### 2.5 Lvalue Conversions

- `lvalue` auto => `rvalue` for contexts, where an `rvalue` is required.
- Note: “-> ” will used to represent “pointing to”
- Conversions:
  - an array lvalue => a pointer rvalue, -> the 1st elem. of the array
  - a function lvalue => an rvalue pointer, -> function
  - any other lvalue => an rvalue with the same value
  - if it is not a class type, cv-qualifiers are removed from the type:
    - Thus, a `const int` lvalue => `int` rvalue

### 2.6 Conversion to bool

- Arithmetic, enum, & pointer values can be => `bool`

  - Null ptr & zero arithm. values are **false**
  - Else, is **true**

  ```pseudocode
  if (ptr)
  	... // Do sth., if ptr is not null ptr
  else
  	... // ptr is null, do sth. else
  ```

- Some classes have operators to convert an object to `void*`, so it can be converted to bool.

  > ==Reason for **void***:==
  >
  >  Any ptr type would do, but `void*` is used, cuz the pointer used here is not meant to be dereferenced, only converted to `bool`. To avoid automatic promotion to an integer.

### 2.7 Type Casts

- It is an explicit type conversion.

- ==**Six forms of type cast expressions:**==

  - Forms:

    1. `(type) expr`

    2. `type (expr)`
    3. **`const_cast<type>(expr)`** :+1:
       - force an expression to be `const`
       - or to remove a `const`

    4. **`dynamic_cast<type>(expr)`** :+1:

       - If you have a pointer or reference to an object whose declared type is a base class, but you need to obtain a **derived** class pointer or reference.
       - Only works with **polymorphic classes**, which has at least one virtual function.

    5. **`static_cast<type>(expr)`** :+1:

       - Common use: 
         - force one enum => different enum type
         - force an arithmetic type => different type
         - force a particular conversion from a class-type object that has multiple type conversion operators
         - Reverse any implicit type conversion (See the second Ex.)
       - Ex:
         - `sqrt(float(i))` => `sqrt(static_cast<float>(i))` for readability
         - C++ auto converts an `enum` => `int` , use `static_cast` if you want to convert an `int`=>`enum`.
         - you can use it to cast a pointer to/from `void*`

    6. **`reinterpret_cast<type>(expr)`** :+1:

       - served for potentially **unsafe** type casts

         - such as converting one type of pointer to another.

         - convert a pointer to an integer, vice versa

           > Internal debugging package might record debug log files, the logger might convert pointers to integers using `reinterepret_cast<>` and print the integers using a specific format.

  - Background:

    - 1st form was inherited from C
    - 2nd form was added in the early days of C++, same meaning as 1st
    - Last 4 forms supplant the 2 older forms, **and are preferred**, cuz more specific >> reducing the risk of error.

- Short forms of casting do not provide error-checking as specified castings do. Long casting help the compiler enforce the intent.



## 3. Constant Expressions

- an expression can be evaluated at compile time

### 3.1 Integral Constant Expressions

- whose type integral or an enumeration

- Situations:

  - array bounds
  - enum values
  - `case` labels
  - Bit-field sizes
  - `static` member initializaers
  - value template arguments

- An integral `static const` data member can be init.ed in the class definition if the initializer is a const. Integral or enumerated expression. The member can then be used as a const. expression elsewhere in the class defintion. Example:

  ```c++
  template<typename T, size_t size>
  class array{
  public:
  	static const size_t SIZE = size;
  	...
  private:
  	T data[SIZE];
  };
  ```

### 3.2 Null Pointers

- A constant expression with a value of 0 can be a *null pointer constant*. 

- a *null pointer constant*  (can be)=> null pointer value (0)

- A null pointer value has an implementation-defined bit pattern. 

  - Many use all zero bits, but some don’t.

  - Serves only as a mnemonic for the programmer

    - Help for readability, using NULL instead of 0.

      ```c++
      Token tok1 = 0;
      Token tok2 = NULL;
      ```



## 4. Expression Evaluation

- Any expression might ahve one or more of the following **side effects**:
  - Accessing a volatile object
  - Modifying an object
  - Calling a func. in the std. lib.
  - Calling any other func. that has side effects

### 4.1 Sequence Points

-  Well-defined points in time during the execution of a program, 

  - at which the side effects have all been completed for expressions that gave beebn evaluated, 
  - and no side effects have been started for unevaluated expression.

- Btwn sequence points, the compiler is free to reorder expressions in any way that preserves the original semantics.

- **When to be aware:**

  - Usually, you can ignore the details of sequence points, but when you are using **global** or **volatile** objects, it is important that you know exactly when it is safe to access thiose objects.

  - Any expression that modifies a scalar object more than once btwn swquence points, or that examines a scalae object;s value after modifying it >>> undefined behaviour

    ```c++
    int i = 0;
    i = ++i - ++i; // ERR: undefined behaviour
    printf("%d, %d", ++i, ++i); // ERR: undefined behavior
    i = 3, ++i, i++; // OK: i == 5
    ```

- **Where are these sequence points:**

  - At End of every expression that is not a subexpression
    - Used in an expression statement, an initializer, as a condition in an if statement, etc.
  - After evaluating all function arguments but before calling the function.
  - When a function returns: after copying the return value from the function call (if any), but before evaluating any other expressuons outside the function.
  - After evaluating the first expression (expr1) in each of the following expressions (with built-in operators, ~~overloaded operators~~):
    - expr1 && expr2
    - expr1 || expr2
    - expr ? expr2 : expr3
    - expr1, expr2

### 4.2 Order of Evaluation

- The order in which operands are evaluated is **unspecified**, so you should **NEVER** write code that depends on a particular order. 

  > Ex: in f( )/g( ), f( ) might be called first or last. The difference can be significant when the functions have side effects.
  >
  > ```c++
  > // -- BAD CODE --
  > int x = 1;
  > int f(void){ x=2; return x }
  > int g(void){ return x; }
  > int main(void){
  >     std::cout<< f()/g() <<'\n';
  > }
  > ```

### 4.3 Short-Circuit Evaluation

- Logical operators (&& and ||) perform **short-circuit** evaluation.

- Left operand is evaluated, and if the expression result can be known at that point, all right operand is **not evaluated**:

  ```c++
  if(false && f()) ...//f() is never called
  if(true || f()) ...//f() is never called
  ```

- **BUT** if the logical operator is **overloaded**, however, it cannot perform short-circuit evaluation.
  - ==Therefore, you should **avoid** **overloading** the **&& and || operators==**



## 5. Expression Rules

- **Unary Operators**
  - Logical negation (!a)
  - Addition (a+b)
  - Ternary operator (a?b:c)
- **Precedence Table:** (Check online, too long, not gonna put it here)























