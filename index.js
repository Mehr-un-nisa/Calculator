let screen = document.getElementById('screen');
buttons = document.querySelectorAll('.btn');
let screenValue = '';

for(item of buttons){
  item.addEventListener('click', (e) => {
    buttonText = e.target.innerText;
    screen.value += buttonText;
  })
}

function equalFunction(){
  InfixtoPostfix(screen.value);
  // expression = screen.value;
  // console.log(expression);
  // screen.value = eval(screen.value);
  // result = screen.value;
  // console.log(result);
  // add_element_to_array(expression, result);
}

/* HISTORY PART */
var x=0;
var expression_arr = Array();
var result_arr = Array();

function add_element_to_array(exp, res)
{
  expression_arr[x] = exp;
  result_arr[x] = res;
  x++;
  display_array();
}

function display_array()
{
   var e = "";

   for (var y=0; y<expression_arr.length; y++)
   {
     e += "Expression: " + expression_arr[y] + " Result: "+ result_arr[y] + "<br/>";
    //  console.log(e);
     document.getElementById("expression").innerHTML = e;
    //  r += "Result: " + result_arr[y] + "<br/>" + "<hr/>";
    //  document.getElementById("result").innerHTML = r;
   }
  //  document.getElementById("expression").innerHTML = e;
  //  document.getElementById("result").innerHTML = r;
}

/* OPERATORS FUNCTIONS */
function sin(){
  screen.value=Math.sin(screen.value);
}

function cos(){
  screen.value=Math.cos(screen.value);
}

function tan(){
  screen.value=Math.tan(screen.value);
}

function sqrt(){
  screen.value=Math.sqrt(screen.value);
}

function pi(){
  screen.value+=3.14159;
}

function euler(){
  screen.value+=2.71828;
}

function backspec(){
  screen.value = screen.value.substr(0,screen.value.length-1);
}

// INFIX TO POSTFIX CONVERTER
  // Created an empty array
  var stackarr = [];

  // Variable topp initialized with -1
  var topp = -1;

  // Push function for pushing elements inside stack
  function push(e) {
    topp++;
    stackarr[topp] = e;
  }

  // Pop function for returning top element
  function pop() {
    if (topp == -1)
      return 0;
    else {
      var popped_ele = stackarr[topp];
      topp--;
      return popped_ele;
    }
  }

  // Function to check whether the passed character is operator or not
  function operator(op) {
    if (op == '+' || op == '-' ||
      op == '^' || op == '*' ||
      op == '/' || op == '(' ||
      op == ')') {
      return true;
    }
    else
      return false;
  }

  // Function to return the precedency of operator
  function precedency(pre) {
    if (pre == '@' || pre == '(' || pre == ')') {
      return 1;
    }
    else if (pre == '+' || pre == '-') {
      return 2;
    }
    else if (pre == '/' || pre == '*') {
      return 3;
    }
    else if (pre == '^') {
      return 4;
    }
    else
      return 0;
  }

  // Function to convert Infix to Postfix
  function InfixtoPostfix(val) {

    // Postfix array created
    var postfix = [];
    var temp = 0;
    push('@');
    infixval = val;

    // Iterate on infix string
    for (var i = 0; i < infixval.length; i++) {
      var el = infixval[i];

      // Checking whether operator or not
      if (operator(el)) {
        if (el == ')') {
          while (stackarr[topp] != "(") {
            postfix[temp++] = pop();
          }
          pop();
        }

        // Checking whether el is ( or not
        else if (el == '(') {
          push(el);
        }

        // Comparing precedency of el and
        // stackarr[topp]
        else if (precedency(el) > precedency(stackarr[topp])) {
          push(el);
        }
        else {
          while (precedency(el) <=
            precedency(stackarr[topp]) && topp > -1) {
            postfix[temp++] = pop();
          }
          push(el);
        }
      }
      else {
        postfix[temp++] = el;
      }
    }

    // Adding character until stackarr[topp] is @
    while (stackarr[topp] != '@') {
      postfix[temp++] = pop();
    }

    // String to store postfix expression
    var st = "";
    for (var i = 0; i < postfix.length; i++)
      st += postfix[i];


    expression = st;
    // To print postfix expression in HTML
    if(postfixEval(st) === undefined || postfixEval(st) === null)
      alert("Invalid expression");
    else
      document.getElementById("txt").innerHTML = postfixEval(st);

      // expression = screen.value;
      // console.log(expression);
      // screen.value = eval(screen.value);
      result = postfixEval(st);
      // console.log(result);
      add_element_to_array(expression, result);
  }


// POSTFIX EVALUATOR
  function postfixEval(string) {

    var stack = [];
    var ch; // current char

    for (var k = 0, length = string.length; k < length;  k++) {

      ch = string[k];

      // if it's a value, push it onto the stack
      if (/\d/.test(ch))
        stack.push(ch);

      // else if it's an operator
      else if (ch in operators) {

        var b = +stack.pop();
        var a = +stack.pop();

        var value = operators[ch](a, b);
        stack.push(value);

      }
      // else we just skip whitespaces
    }

    if (stack.length > 1)
      throw "ParseError: " + string + ", stack: " + stack;

    return stack[0];

  }

  // operators
  var operators = {
    "+": function (a, b) { return a + b },
    "-": function (a, b) { return a - b },
    "*": function (a, b) { return a * b },
    "/": function (a, b) { return a / b },
    "sin": function (a, b) { return sin(a) },
    "cos": function (a, b) { return cos(a) },
    "tan": function (a, b) { return tan(a)},
  };

