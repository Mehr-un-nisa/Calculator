// Event listener for click on buttons
let screen = document.getElementById('output');
buttons = document.querySelectorAll('.btn');
let screenValue = '';

for(item of buttons){
    item.addEventListener('click', (e) => {
      buttonText = e.target.innerText;
      screen.value += buttonText;
    })
  }


/* HISTORY PART */
var x=0;
var expression_arr = Array();
var result_arr = Array();
var  h=0;

function add_element_to_array(exp, res)
{
  expression_arr[x] = exp;
  result_arr[x] = res;
  x++;
  display_array();
}

function display_array()
{
        var list = document.getElementById('list');
        var newEl = document.createElement('li');
        newEl.setAttribute("id", "item" + h + "");
        newEl.innerHTML = "Expression: " + expression_arr[h] + " , Result: " + result_arr[h] + "\t \t" + "<i class='material-icons' style='font-size:24px;color:red'>backspace</i>";
        newEl.setAttribute("onclick", "remove(this)");
        list.appendChild(newEl);
        h++;
}

function remove(el) {
  var element = el;
  element.remove();
}

/* OPERATORS OBJECT */
operators =  {
    "(": {
        "pre": 0,
        "rule": 0,
        "unary": 0
    },
    "+": {
        "pre": 2,
        "rule": 0,
        "unary": 0,
        "func": (a, b) => {
            return a + b;
        }
    },
    "-": {
        "pre": 2,
        "rule": 0,
        "unary": 0,
        "func": (a, b) => {
            return a - b;
        }
    },
    "*": {
        "pre": 3,
        "rule": 0,
        "unary": 0,
        "func": (a, b) => {
            return a * b;
        }
    },
    "/": {
        "pre": 3,
        "rule": 0,
        "unary": 0,
        "func": (a, b) => {
            return a / b;
        }
    },
    "sqrt(": {
        "pre": 6,
        "rule": 1,
        "unary": 1,
        "func": (n) => {
            return Math.sqrt(n);
        }
    },
    "sin(": {
        "pre": 5,
        "rule": 1,
        "unary": 1,
        "func": (n) => {
            return Math.sin(n);
        },

    },
    "cos(": {
        "pre": 5,
        "rule": 1,
        "unary": 1,
        "func": (n) => {
            return Math.cos(n);
        }
    },
    "tan(": {
        "pre": 5,
        "rule": 1,
        "unary": 1,
        "func": (n) => {
            return Math.tan(n)
        }
    },
    ")": {
        "pre": -1,
        "rule": 0,
        "unary": 0
    }
  };


  Ops = ["+", "-", "*", "/", "sqrt("];
  trigs = ["sin(", "cos(", "tan("];

    // function to check legal number
    isOperand = function (_in) {
        return !isNaN(_in);
    };

    // function to check operator
    isOperator = function (o_p) {
        return Ops.includes(o_p);
    };
    // function to check is digit
    isDigit = function (n) {
        let numReg = /[0-9]/i;
        return numReg.test(n);
    };

    // function to return top of the stack
    peek = function (arr_) {
        return arr_[arr_.length - 1];
    };

    // function to check trigonometric functions
    isTrig = function (t) {
        return trigs.includes(t);
    };

    /* INFIX TO POSTFIX FUNCTIONS*/
    function InfixtoPostfix(_infix) {
        let _post = [];
        let _stack = [];

        for (i = 0; i < _infix.length; i++) {
            let tp = _infix[i];
            if (isOperand(tp)) {
                _post.push(tp);
            } else if (tp === "(") {
                _stack.push(tp);
            } else if (tp === ")") {
                while (_stack.length > 0 && peek(_stack) !== "(") {
                    _post.push(_stack.pop());
                }
                _stack.pop();
            } else if (isOperator(tp) || isTrig(tp)) {
                a = tp;
                b = peek(_stack);

                while (_stack.length > 0 && b !== "(" && ((!operators[a].rule && (operators[a].pre <= operators[b].pre)) ||
                        (operators[a].rule && (operators[a].pre < operators[b].pre)))) {
                    _post.push(_stack.pop());
                    b = peek(_stack);
                }
                _stack.push(a);
            }
        }

        while (_stack.length > 0) {
            let v = _stack.pop();
            if (v !== "(" && v !== ")") {
                _post.push(v);
            }
        }
        return _post;
    }

    /* POSTFIX EVALUATION FUNCTION */
    function postfixEval(_postfix) {
        if (!_postfix.includes("(") && !_postfix.includes(")")) {
            let _out = [];
            for (i = 0; i < _postfix.length; i++) {
                let t = _postfix[i];
                // if it is a value push on the stack
                if (isOperand((t))) {
                    _out.push(t);
                }
                // if it is the operator push on stack
                else if (t in operators) {
                    if (operators[t].unary) {
                        e = Number(_out.pop());
                        _out.push(operators[t].func(e).toFixed(4).toString());
                    } else {
                        a = Number(_out.pop());
                        b = Number(_out.pop());
                        _out.push(operators[t].func(b, a).toFixed(4).toString());
                    }
                }
                // else we skip whitespaces
            }

            if(_out.length > 1){
                alert("Parser Error: " + _postfix + ", stack " + _out);
            }
            return _out[0];
        }
    }

    // GLOBAL instance array for expression
    ins = [];

    function AddValue(str) {
        let val = str.toString();
        let pk = peek(ins);
        if (pk === null || pk === undefined) {
            ins.push(val);
        } else if (pk.includes(".") || isDigit(pk)) {
            ins.push(ins.pop().toString() + val);
        } else if (pk === "-" || pk === "+") {
            let dp = ins[ins.length - 2];
            if (dp === undefined || dp === null || dp === "(" || isOperator(dp) || dp[dp.length - 1] === "(") {
                ins.push(ins.pop().toString() + val);
            } else {
                ins.push(str);
            }
        } else {
            ins.push(str);
        }
    }


    function handleTrig(trig) {
        switch (trig.substring(0, 4)) {
                case "sin(":
                    ins.push(trigs[0]);
                    break;
                case "cos(":
                    ins.push(trigs[1]);
                    break;
                case "tan(":
                    ins.push(trigs[2]);
                    break;
        }
    }

    //operators handler
    function handleOperator(op) {
        for (let i = 0; i < Ops.length; i++) {
            if (Ops[i] === op) {
                ins.push(Ops[i]);
            }
        }
    }

    //point or float sign control function
    function AddPoint(str) {
        let peek = ins[ins.length - 1];
        if (peek === null || peek === undefined) {
            ins.push(str);
        } else if (!peek.includes(".")) {
            if (isOperand(peek)) {
                ins.push(ins.pop().toString() + str);
            } else {
                ins.push(str);
            }
        }
    }

    //braces control handler function
    function AddBrace(str) {
        ins.push(str);
    }

    //constants control handler function
    function handleConst(constant) {
        if (constant === "e") {
            ins.push("e");
        }
        else if(constant === "π"){
            ins.push(constant);
        }
        // else if anyother characters are type so ignore them
    }

    // function to handle constant values such as pi and euler
    function resolveConsts() {
        let _const = ["e", "π"];

        for (i = 0; i < ins.length; i++) {
            let curr = ins[i];
            // if curr is constant
            if (_const.includes(curr)) {
                // if expression is 2π or (1+1)π format
                if (isOperand(ins[i - 1]) || ins[i - 1] === ")") {
                    ins.splice(i, 0, "*");
                    ins[i + 1] = (curr === _const[0]) ? Math.E.toFixed(4) : Math.PI.toFixed(4);
                }
                // if expression is 2*π or 3+π
                else if (ins[i - 1] === "-" || ins[i - 1] === "+" || ins[i - 1] === "*" || ins[i - 1] === "/") {
                    let dp = ins[i - 2];
                    if (dp === undefined || dp === null || dp === "(" || isOperator(dp) || dp[dp.length - 1] === "(") {
                        let op = ins[i - 1];
                        ins.splice(i - 1, 2, op + ((curr === _const[0]) ? Math.E.toFixed(4) : Math.PI.toFixed(4)));
                    }
                    else if(isOperand(dp)){
                        ins[i] = (curr === _const[0]) ? Math.E.toFixed(4) : Math.PI.toFixed(4);
                        console.log(ins);
                    }
                }
                // if expression contain only π or e
                else if(i==0){
                    ins[i] = (curr === _const[0]) ? Math.E.toFixed(4) : Math.PI.toFixed(4);
                }
            }
        }
    }

    function Evaluate() {
        resolveConsts();
        let output = InfixtoPostfix(ins);
        expression = ins.join('');
        let result = postfixEval(output);
        if(result === undefined || result === null)
            alert("Invalid expression");
        else{
            ins = [];
            ins.push(result);
            add_element_to_array(expression, result);
            display();
        }
    }


    function display() {
        let v = ins.join();
        document.getElementById('output').value = st(v).toString();
    }

    // replace all string occurances
    let st = function (v) {
        return v.replace(/,/g, "");
    };

    //clears input screen/
    function screenclear() {
        ins = [];
        screen.value='';
        display();
    }

    // backspace function
    function backspac(){
        let top = peek(ins);
        if (top != undefined){
            if(isOperand(top)) {
                let tp = top.substring(0, top.length - 1);
                if(tp === ""){
                    ins.pop();
                }
                else{
                    ins.pop();
                    ins.push(tp);
                }
            }
            else{
                ins.pop();
            }
            screen.value = screen.value.substr(0, screen.value.length-1);
        }
      }
