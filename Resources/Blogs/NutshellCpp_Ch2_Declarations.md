# Cpp Notes - Declarations

## 1. Type Declarations

### 1.1 Enum

#### 1.1.1 Intro

An enumerated type declares an optional type name and a set of zero or more identifiers that can be used as values of the type. Examples:

```c++
enum logical {no, maybe, yes};
logical is_permitted = maybe;
enum color {red = 1, green, blue = 4};
const color yellow = static_cast<color>(red|green);
enum zeroes {a, b = 0, c = 0};
```

The name of an enumeration is optional, but without a name you cannot declare use the enumeration in other declarations. Such a declaration is sometimes used to declare integer constants such as the following:

```c++
enum { init_size = 100 };
std::vector<int> data(init_size);
```

An enumerated type is a unique type. Each enumerated value has a corresponding integer value. Enum can be promoted automatically to its integer equivalent, but integers **cannot** be implicitly converted to an enumerated type. Instead, you can use `static_cast<>` to cast an integer. 

#### 1.1.2 Enum Range of Values

The range of values for an enum is defined by the smallest and largest **bitfields** that can hold all of its enumerators. 

More precisely, assuming largest and smallest values of an Enum. type be $v_{min}$ and $v_{max}$. The largest enumerator is $e_{max}$ and the smallest is $e_{min}$. Using 2’s complement representation,  $v_{max}$ is the smallest $2^n-1$, such that $v_{max}\geq \max( abs(e_{min})-1, abs(e_{max}))$. If $e_{min}$ is not negative, $v_{min}=0$; otherwise, $v_{min}=-(v_{max}+1)$.

In other words, the range of values of an Enum can be larger than the range of enumerator values, but the exact range depends on the representation of integers on the host platform. All values between the largest and smallest enums are always valid, even if they do not have corresponding enumerators.

In the following example, the enumeration sign has the range from -2 to 1. Your program might not assign any meaning to `static_cast<sign>(-2)`, but it is semantically valid in a program:

```c++
enum sign {neg=-1, zero=0, pos=1};
```

#### 1.1.3 Overload Operators

Enumerations can be promoted to integers, any arithmetic operation can be performed on enumerated values, but the result is always an integer. You can also overload the operators for your enumerated type. Example:

```c++
// Explicitly cast to int, to avoid infinite recursion.
inline iostate operator | (iostate a, iostate b)
{
    return iostate(int(a)|int(b));
}
inline iostate& operator |= (iostate &a, iostate &b)
{
    a = a | b;
    return a;
}
// Repeat for &, v, and -
int main(void)
{
    iostate err = goodbit;
    if(error())
    {
        err|=badbit;
    }
}
```

#### 1.1.4 POD Types

- **POD**: Plain Old Data
- **Fundamental** types and **Enum**. types are **POD** types, as are pointers and arrays of POD types.
- **POD class**: a class or struct that uses only POD types for its nonstatic data members.
- **POD union**: a union of POD types
- Special Properties:
  - A POD object can be copied byte for byte and retain its value.
  - A local POD obj. withour an initializer is uninitialized => the value is undefined.
    - POD type in a new expression without an initializer is uninit.ed. 
    - POD init with empty initializer: init. as `0`, `false`, or a `null` pointer

----

### 1.2. Typedef

#### 1.2.1 Intro.

`typedef` is a specifier in a declaration, and it must be combined with type specifiers and optional `const` and `volatile` qualifiers (*cv-qualifiers*), but no storage class specifiers.

- cannot have an initializer

  - Example:

  - ```c++
    typedef unsigned int uint;
    typedef long int *long_ptr;
    typedef double matrix[3][3];
    typedef void (*foo)();
    ```

- By conventions, `typedef` appears before the type specifiers. Syntatically, it behaves as a storage class specifier and can be mixed in any order with other type specifiers.

  - Example:

    ```c++
    typedef unsigned long ulong; 	//Conventional
    long typedef int unsigned ulong; //Valid, but a bit strange
    ```

- Helpful with complicated declarations, such as function pointer declarations and template instatiations.

  - Example:

    ```c++
    typedef std::basic_string<char,std::char_traits<char>> string;
    ```

- It **does not** **create** a new type the way class and enum do. More like a **renaming** for an existing type.

- You **cannot** **overload** an operator on ` typedef  ` synonyms (like fundamental types).

- <span style="color: #ffffff; background-color:#008CBA;border: none; padding: 5px 15px; text-align: center; font-weight: bold;">C</span>  In C, we accustomed to declare `typedefs`  for struct, union, and enum declarations, but nor necessary in C++. 

  - Example:

    ```c
    struct point {int x, y;}
    typedef struct point point_t;// not needed in c++, but harmless
    point_t pt;
    ```

---

---

### 2. Object Declarations

---

### 2.0 Intro.

- Object: In traditional OOP, means an instance of a class, but in C++, the definition is slightly boarder to include instances of any data types.

----

### 2.1 Specifiers

#### 2.1.1 Storage class Specifiers

LIst of storage class specifiers:

 - `auto`

    - Denotes an **automatic** variable — that is, a variable with a lifetime limited to the block in which the variable is declared. 
    - **Default** for func. parameters and local variables
    - Rarely used explicitly

 - `extern`

    - Denotes an object with **external** **linkage**, which might be defined in a **different source**. 
    - Function params **cannot** be `extern`

- `mutable`

  - Denotes a data member that **can** be **modified** **even if the containing object is const.**

  - When to use (Google):

    > Occasionally I use it to mark a **mutex** or other thread synchronisation primitive as **being mutable** so that **accessors**/query methods, which are typically marked `const` can still lock the mutex.
    >
    > It's also sometimes useful when you need to instrument your code for debugging or testing purposes, because **instrumentation** often needs to modify auxiliary data from inside query methods.

- `register`

  - Denotes an automatic variable with a **hint to the compiler** that the variable should be stored in **a fast register**.
  - Most modern compilers **ignore** the `register` storage class, cuz compilers better than human at determining which variables belong in registers

- `static`

  - Denotes a variable with a static lifetime and internal linkage. 
  - Function params **cannot** be `static`.

#### 2.1.2 const. and volatile qualifiers

Also known as *cv-qualifiers*:

- `const`

  - Denotes an object that cannot be modified. 

  - A const object cannot ordinarily be the target of an assignment.

  - You **cannot** call a **non-const** member **function** of a **const** **object**.

    - ```c++
      #include <iostream>
      
      class Animal{
      private:
          const int bar = 1;
      public:
          int getBar(){
              return bar;
          }
          int getCosntBar() const{
              return bar;
          }
      };
      
      int main(int argc, const char * argv[]) {
          // insert code here...
          const Animal cat;
          std::cout << cat.getBar() << std::endl;//INVALID
          std::cout << cat.getCosntBar() << std::endl;//VALID
          return 0;
      }
      ```

- `volatile`

  - Denotes an object whose value might change unexpectedly.

  - Prevent compiler to optimize the variable, although it appears not changing.

    > Example: ISR, Interupt Service Routine can cause the register to change values, but the compiler might think it is an unchanged variable and will optimize it

#### 2.1.3 Using Specifiers

- It can appear in any order, but the convention is:

  - **==storage class > type specifiers > cv-qualifiers==**

  - Ex:

    ```c++
    extern long int const mask; // Conventional
    int extern const long mask; // Valid, but wild
    
    // Similarly, for class/enum
    enum Color{
        red,
        black
    } node_color;
    // But most time:
    enum Color{red, black};
    Color node_color; //declare object separately
    ```

---

### 2.2. Declarators

A declarator declares a single name within a declaration.

#### 2.2.1 Arrays

- declared with a **constant** size, **fixed** for the lifetime of the object and cannot change.

- in comparison, changeable array-like container: `<vector>`

- Example:

  ```c++
  int point[2];
  double matrix[3][4]; // A 3x4 matrix
  ```

- You can **omit** the array size if there is an **initializer**, for multidimensional array, you can only imit the **first** (leftmost) size:

  ```c++
  int data[] ={2,4,6}; //data[3]
  int matA[][3]={{1,0,0},{1,2,3}}; //matA[2][3]
  char str[] = "hello"; // str[6], with trailing \0
  ```

- **Function Parameter** is an array, the array’s size is ignored, it is actually a **pointer** type. For Multidimensional, the f**irst dimension is ignored.**

  ```c++
  long sum(long data[], size_t n);
  double chi_sq(double stat[][2]);
  ```

#### 2.2.2 Pointers

- stores the address of another object

- Declaration: (*) + cv-qualifiers + object name + optional initializer

- When R/W pointer declarations, be sure to keep **reack** of **cv-qualifiers**. It is apply to the pointer’s target. Ex  **[a pointer to const.]**:

  ```c++
  int i, j;
  int const *p = &i; // a pointer to const.
  p = &j; //OK
  *p = 42; //ERR!!
  ```

  As you can see, the pointer `p` is a pointer to a const. Int. The pointer object is modifiable, but you cannot change the int that it points to. 

  > You can think of: [int const] is the type of object that (*p) is pointing to, hence **p is a pointer pointing to an integer constant.**

- In comparison, Ex:

  ```c++
  int i, j;
  int * const p = &i;
  p = &j; //ERR!!
  *p = 42; //OK
  ```

  > You can think of: [int] is the type of the pointer (* const p) is pointing to, and this p object is constant type, hence, the **p is a constant pointer pointing to an integer.**

- You can have pointers to pointers, as deep as you want :see_no_evil:. 

  - And each level of pointer has its own cv-qualifiers.

- So the easiest way to read a complicated pointer declaration is to fine the declarator, work your way from the inside to the outside **I>>O**, and then from the right to left **L<<R**. 

  ```c++
  int x;
  int *p; 					// Pointer to int
  int * const cp = &x; 		// const. pointer to int
  int const *p;				// Pointer to const int
  int const * const cpc = &x; // a Constant pointer to constant int.
  int *pa[10];				// Array of 10 pointers to int
  int **pp;					// a pointer to pointer to int
  ```

- When a function parameter is declared with an array type, the actual type is still a pointer.

  Ex:

  ```c++
  // Both means the same thing
  int sum(int data[], size_t n);
  int sum(int *data, size_t n);
  ```

- When using array notation for multi-dimensional param, only the first dimension can be omit.

  ```c++
  void transpose(double matrix[][3]); //Correct
  void transpose(double matrix[][]); //Error!!
  ```

  > Because the compiler does not know how to layout the memory for matrix  for the second function, but for the first one, it can be think of an array of three pointers.

#### 2.2.3 Function Pointers :cry:

- Declared with an asterisk (*) and the function signature.

- The name and asterisk **must** be enclosed in parenthese, so the asterisk is not interpreted as part of the return type.

  ```c++
  void (*fp)(int); //fp is a pointer to function that takes an int parameter
  				//and returns void
  // -- Implementation -- //
  void print(int);
  fp = print;
  ```

- Sometimes, the declaration can be hard to read, therefore, we use `typedef` declaration.

  ```c++
  typedef void (*Function)(int);
  Function fp;
  fp = print;
  
  // - Sometimes, without typedef, the function can be unreadable:
  // Array of 10 function pointers 
  int* (*fp[10])(int*(*)(int*),int);
  
  // - Let's make it more readable:
  // Declare a type for pointer to int.
  typedef int* int_ptr; //define int_ptr as an integer pointer
  // Declare a func. pointer type for a function that takes an int_ptr param.
  // and returns an int_ptr.
  typedef int_ptr (*int_ptr_func)(int_ptr);// declare a function pointer
  // Declare a func. ptr type for a func that returns int_ptr and takes 2 params: the first of type int_ptr and the second of type int.
  typedef int_ptr (*func_ptr)(int_ptr_func, int); // declare a function pointer
  // Declare an array of 10 func_ptrs
  func_ptr fp[10];
  ```

  - Do a comparison btwn func pointer and object pointer:

    ```c++
    int * p;// create an integer pointer;
    int i= 0;
    p = &i; //point p to i address 
    *p = 24; //assign obj pointed by p as 24
    
    void (*p)(int); //create a void function pointer that takes int param.
    void print(int);//a print function
    p = print;// void function pointer pointing to print function
    ```

#### 2.2.4 Member Pointers

- Pointers to members (data and functions) work differently from other pointers.

  - Syntax for declaring a pointer to a non-static data member or function requires a class anme and scope operator before the asterisk *. 

  - Pointers to members can **never** be cast to ordinary pointers.

  - A pointer to a **static** member is an **ordinary** pointer, **not** a **member** pointer

    Ex:

    ```c++
    #include <iostream>
    
    struct simple{
        int data = 0;
        int func(int d){return d;};
    };
    
    int main(int argc, const char * argv[]) {
        // insert code here...
        int simple::*p = &simple::data;//pointers to a member data
        int (simple::*fp)(int) = &simple::func;//pointers to a member function
        simple s;
        std::cout<<s.data<<std::endl; 
        s.*p = (s.*fp)(42);
        std::cout<<s.data<<std::endl;
        return 0;
    }
    /*** OUTPUT ***/
    0
    42
    ```

#### 2.2.5 References

- a synonym for an object or function

- Symbol: (&)

- Cannot declare:

  -  a reference of a reference
  -  a reference to a class member
  - a pointer to a reference
  - an array of references
  - a cv-qualified reference

  Ex:

  ```c++
  int x;				
  int &r = x; 		// Reference to int
  int& const rc = x;  // ERR: no cv qualified references
  int && rr;			// ERR: no reference of reference
  int & ra[10]; 		// ERR: no arrays of reference
  int *&* rp = &r;	// ERR: no pointer to reference
  int *p = &x;		// Pointer to int
  int *&* pr = p; 	// OK: reference to pointer
  ```

- Usage:

  - Bind names to temporary objects
  - implement call-by-reference for func. params. and optimize call-by-val for large func. params.
    - To avoid unnecessary copy of the return value.
    - copy operation can be costly for a large object.
    - To prevent modifying the object (which will violate the call-by-value convention), so we need to declare the reference **const** => improves the performance of call-by-reference
  - Common use of references is to use a const reference for function parameters, especially for large objects.

-----

### 2.3 Initializers

- supplies an initial value for an object being declared.
- Must supply an initializer for the definition of a reference or const. object.
- Two types:
  - Assignment like: `int x = 42;`
  - Function like: `int w[4] = {1, 2, 3, 4}; `

#### 2.3.1 Initializing arrays

- 1-D

  - `int vec[] = {1,2,3};  // Arrays of three elements`
  - `int zero[4]= {}; // Init to all zeros`

- Multi-D

  - Identity matrix: `int id1[3][3]={{1},{0,1},{0,0,1}};`
  - Identity matrix: `int id2[3][3]={1,0,0,0,1,0,0,0,1};`

- An **array** of **char** or **wchar_t** is special, because we can use a **string** literal

  - ==Remember that every **string** literal has an implicit **null** character at the end==

    - The following two examples are equivalent
      - `char str1[] = “hello”;`
      - `char str2[] = {'H','e','l','l','o','\0'};`
    - Where `\0` is a null character
    - The following 2 ex are equivalent (wide char example)
      - `wchar_t ws1[]=L"Hello";`
      - `wchar_t ws2[] =  {L'H’,L'e’,L'l’,L'l’,L'o’,L'\0’};`

    - Note: The last expression in an initializer list can be followed by a comma. (This is convenient)

- Initializing Scalars
  - You can also init any scalar obj. with a single value in curly braces `int x = {24};` , but you **cannot** omit the value the way you can with **a single-element array.**

----

### 2.4 Object Life Time

- Every object has a **lifetime**: the duration from when the memory for the object is allocated and the object is initialiedzed ~ when the object is destroyed and the memory is released
- **Three Categories:**
  - ==Automatic==: 
    - Objects are local to a function body or a nested block within a function body
    - Created, when execution reaches the declaration
    - Destroyed, when execution leaves the block, or scope
  - ==Static==:
    - Objects can be 
      - Local: **static** storage class specifier
        - Created, when reaches the declaration
      - Global: at **namespace** scope
        - Constructed, when the program starts but **before** **main** is entered.
      - Destroyed, in the opposite order of their construction (Chapter 5)
  - ==Dynamic==:
    - Objects created with new expressions
    - Lifetimes extend until the **delete** expression is invoked on the object’s addresses 

---

### 2.5 Namespaces

- a named scope
- avoid name collisions with declarations in other namespaces
  - ex: `layout::fraction`, `eqn::fraction`, and `math::fraction`
- unnamed namespace
  - `namespace{...}` , the compiler generates a unique, private name for the unnamed namespace in each unique scope
  - Pros: you are guaranteed that all names declared in it can never clash with names in other source files
  - Cons: you cannot use the scope operator (::) to qualify identifiers in an unnamed namespace
    - so you must avoid name collisions within the same source file.

- ==**How to use namespaces**== :star: :star2:

  Namespaces have **no runtime cost**. 

  - When you define a class in a namespace, be sure to **declare all associated operators and functions in the same namespace.**
  - To make namespaces **easier to use**, keep **namespaces** names **short**, or use aliases to craft short synonyms for longer names.
  - **Never** place a `using` **directive** in a header. It can create name collisions for any user of the header.
  - **Keep** `using` directives local to functions to **save typing and enhance clarity.**
  - Use `using namespaces std` outside function **ONLY** for **tiny** programs or for **backward compatibility** in legacy projects. 






















