# Cpp Notes - Statements #

- Statements define and control what a program does.


## 1. Expression Statements

- computes an expression, such as a function call or assignment
- expression result is discarded
- Syntax:
  - *expr* ;
  - ; 
    - Statement without expression: *null statement*, used in *for loops

## 2. Declarations

- can appear anywhere a statement appears

### 2.1 Declaration Statements

> **unsigned int num_i, num_w, num_c;**
> num_i = num_w = num_c = 0;
>
> **using namespace std;**
>
> **string line;**
>
> while (getline(cin, line)){
>
> ​	…
>
> ​	**bool in_w = false;**
>
> ​	…	
>
> }



### 2.2 Condition Declarations

- `for` , `pf`, `switch` , and `while` statements permit a declaration within each statement’s condition:

  ```c++
  if (int x = test_this(a, b)) { cout<< x; }
  ```

- But the name cannot be redeclared in the immediate sub statement but can be redeclared in a nested statement.

  ```c++
  if (derived* d = dynamic_cast<derived*>(b)){
  	d->derived_only_func();
  }else{
      assert(d==NULL); // Same d as above
      double d; // ERR: can't redeclare d in a sub-statement
      if(d == 0)
          int d = 2; // VALID: inner block, can be redeclared in a nested statement
  }
  cout << d; 	// Invalid: d no longer in scope
  ```



## 3. Compound Statements

- a sequence of zero or more statements enclosed within curly braces (**{ … }**).
- also called block



## 4. Selections

### 4.1 ==if==

```c++
if(condition) 
	{...}
else
	{...}
```

- if the first condition is correct, it will run the first statement and skip `else` or `if else` after that.

### 4.2 ==Switch==

```c++
void demo(){
  using std::cout;
  switch(number){
    cout<<"yo"<<endl;
      case 1:
          cout<<"1"<<endl;
      case 2:// if it is 1, it will also fall through here, cuz not break
          cout<<"1 or 2"<<endl;
          break;
      case 3:
          cour<<"must be 3"<<endl;
      default:
          break;// not necessary, but good habit
  }  
}

```

### 4.3 Loops

- **While**

  ```c++
  while(condition) { statement... }
  ```

  - Usage: 
    - (typical) unbounded iteration, that is, when you don’know forehand number of iterations

- **For**

  ```c++
  for (init; condition; iterate-expr) { statement... }
  ```

  - The `init`, `condition`, and `iterate-expr` are optional

- **Do**

  ```c++
  do{
      statement...
  }while(expression);
  ```

  - The statement is excuted first, then expression is evaluated & => bool

- Commons:

  - A `break` statement exits the loop immediately
  - A `continue` statement will abort the rest statements & do a loop jump

### 4.4 Control Statement

- Control statement change execution from its normal sequence. When execution leaves a scope, all automatic objects that were created in that scope are destroyed. 

- `break`

  - can be only used in the body of a `loop` or `switch` statement
  - exits current scope/loop/switch immediately

- `continue`

  - can be only used in the body of a `loop` 

- `go to`

  - transfer control to the statement that has *identifier* as a label
  - Jumping into a block is usually a bad idea.
    - In particular, if the jump bypasses the declaration of an object, the results are undefined unless the object has POD type and no intializer.

- `return`

  - transfers execution out of a function to the caller

- `identifier:statement

  ```c++
  int main(int argc, char* argv[])
  {
      int matrix[4][5];
      for(int i=0; i<4; ++i)
          for(int j=0; j<5; ++j)
              if(!(std::cin >> matrix[i][j]))
                  goto err;
      		goto end;
      err: std::cerr<<"Need 20 values for the matrix\n";
      end: return 0;
  }
  ```

  - Any statement can have a label
  - A label is used only as a target of a `goto` statement
  - A statement can have multiple labels, including `case` and `default` labels

### 4.5 Handling Exceptions

- An *exception* interrupts the normal flow of control in a program

- An exception *throws* an object from the point where the exception is raised to the point where the exception is handled. In between those points,

  -  function calls are aborted
  - local scopes are abruptly exited
  - local & temporary objects in those scopes are destroyed

- **TIP**

  - As the name implies, an exception is used for exceptional circumstances, such as indexing a vector with an index that is out of bounds. 
  - The intention in C++ is that `try` statements should have **near zero cost**
  - but throwing and handling an exception **can be expensive** in terms of performance
  - It is important to put the most **specific** first, and put **base** classes later. If you use an ellipsis, it must be last.

- Template:

  ```pseudocode
  try{
      compound-statement...
  }catch(type declarator){
      compound-statement...
  }
  ```

- Mechanism:

  - Each `try` statement is also pushed on the stack
  - Each compund statement forms a separate local scope
  - When an exception is thrown, the execution stack is **unwound**. 
    - Local scioes are popped form the stack (destroying any automatic objects that were declared in each scope) until a `try` statement is found
    - The `try` statement is popped from the exception stack.
    - Then the type of the exception objet is compated with each exception handler.
      - If a match is found, the exception object is copied to the locally-declared exception object, and execution transfers to the compound statement for that handler.

- Rules for `type` in each catch clause is compared with the type `T` of the exception object:

  - If `type` is the same as `T` or `T&` (not considering cv-qualifiers), the handler matches
  - If `type` is a base class of T, the handler matches.
  - If `type` is a pointer that can be converted to `T` using a std. conversion — e.g., type is void* — the handler matches.
  - An ellipsis `(…)` always matches.

- Example:

  ```c++
  class bad_data{
    public: 
      bad_data(int val){
          std::cout<<"Invalid num:"<<val;
      }
  }
  void getdata(int& buf){
      if(buf<0)
      {
          throw bad_data(buf);
      }else{
          buf += 2;
      }
  }
  
  //-- in main --//
  ...
  try{
      int buf = 19;
      getdata(buf);
  }catch(const bad_data& ex){
      std::cerr<< "error: " << ex.what() << "\n";
      return EXIT_FAILURE;
  }catch(...){
      std::cerr<<"fatal error: unknown exception\n";
      return EXIT_FAILURE;
  }
  ...
  ```

























 