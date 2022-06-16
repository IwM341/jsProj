lexem_functions = [
    "sin","cos","tan", "cot",
    "arcsin","arccos","arctan",

    "sinh","cosh","tanh", "coth",
    "arcsinh","arccosh","arctanh",

    "ln", "log","exp","Gamma",
    "sqrt",
    "floor","ceil","round",
    "sign", "abs"
]

lexem_greek = [
    "alpha", "Alpha",
    "beta", "Beta",
    "gamma", "Gamma",
    "delta", "Delta",
    "epsilon","Epsilon", "varepsilon",
    "zeta","Zeta",
    "eta","Eta",
    "theta","Theta","vartheta",
    "iota","Iota",
    "kappa","Kappa","varkappa",
    "lambda","Lambda",
    "mu","Mu",
    "nu","Nu",
    "xi","Xi",
    "pi","Pi","varpi",
    "rho","Rho","varrho",
    "sigma","Sigma","varsigma",
    "tau","Tau",
    "upsilon","Upsilon",
    "phi","Phi","varphi",
    "chi","Chi",
    "psi", "Psi", 
    "omega","Omega"
];

lexem_special = [
    "prod","sum","int","frac","cfrac","differentialD","partial","operatorname"
];

lexem_operators = [
    "times","dot","cdot","-","+","*","^","/","%",",","!","mod","colon","choose"
];

lexem_simple_operators = [
    "-","+","*","^","/","%","!","d",","
];

lexem_logic_operators = [
    "land","lor","lnot","implies","leftarrow","rightarrow"
];

op_prior = {
    "<": -2,
    "<=": -2,    
    ">": -2,
    ">=": -2,
    "==": -2,
    "!=": -2,

    "choose": -1,

    "+": 0,
    "-": 0,

    "||": 0.5,
    "leftarrow": 0.5,
    "rightarrow": 0.5,

    "*": 1,
    "/": 1,

    "&&": 2,
    "!": 2.5,

    "fact":2.7,

    "^": 3
};

function create_name(var_name){
    return {type: "var",value: var_name};
}

function create_const(const_name){
    return {type: "const",value: var_name};
}

function create_number(number){
    return {type: "number",value: number};
}


function create_function(func_name,func_args){
    return {type: "function",name: func_name, args: func_args};
}

function create_sum(down_limit,up_limit,sch_var,expr,condition){
    return {type: "sum",
            dlim: down_limit, 
            ulim: up_limit,
            sch : sch_var,
            expr: expr,
            cond:condition
        };
}

function create_prod(down_limit,up_limit,sch_var,expr,condition){
    return {type: "prod",
            dlim: down_limit, 
            up_limit: up_limit,
            ulim : sch_var,
            expr: expr,
            cond:condition
        };
}

function create_diff(diff_var,n,expr){
    return {type: "dif",
            diff_var : diff_var,
            n:n,
            expr: expr
        };
}

function create_unary_operator_token(op,expr){
    return { type:"uop",
        op: op,
        expr:expr
    };
}
function create_binary_operator_token(op,expr1,expr2){
    return { type:"bop",
        op: op,
        expr1:expr1,
        expr2:expr2
    };
}

console.log(create_binary_operator_token("+","2*x+y","5*y+z"));

function is_let(c){
    if( c.toUpperCase() != c.toLowerCase() ){
        return true;
    }
    else{
        return false; 
    }  
}

function is_num(c){
    if( c>="0" && c<= "9" ){
        return true;
    }
    else{
        return false; 
    }  
}

function is_brack(c){
    if( c in ["(",")","{","}","[","]"]){
        return true;
    }
    else{
        return false; 
    }  
}

function is_space(c){
    if( c in [' ','\t','\n','\r','\f','\v']){
        return true;
    }
    else {
        return false;
    }
}

function lexical_parser(S,logger){
    const States = {
        START_READ_NUMBER,
        READ_POINT_NUMBER,
        READ_LATEX,
        
        READ_INDEX,

        READ_VAR,
        WAIT
    };

    var token_list = [];
    var i=0;
    var State = States.WAIT;

    var index_level = 0;
    var bracket_level = 0;

    var tmpsting = "";
    while(i<S.length){
        var c = S.charAt(i); 
        switch (State){
            case States.WAIT:{
                if(c == "_" || c == "^"){
                    
                }
                else if(c in lexem_simple_operators)
                    token_list.push({type:"op",value:c});
                else if (is_brack(c)){
                    token_list.push({type:"bracket",value:c});
                }
                else if(is_num(c)){
                    tmpsting = c;
                    State = States.START_READ_NUMBER;
                }
                else if(is_let(c)){
                    tmpsting = c;
                    State = States.READ_VAR;
                }
                else if(c == "\\"){
                    State = States.START_READ_LATEX;
                }
                else if(is_space(c)){;}
                else{
                    logger = `unexpected simbol at ${i}, \'${c}\' \n`;
                    return null;
                }
            }
            case States.START_READ_NUMBER:{
                if(is_num(c))
                    tmpsting+=c;
                else if(c == "."){
                    tmpsting += ".";
                    State = States.READ_POINT_NUMBER;
                }
                else{
                    token_list.push({type:"number",value:tmpsting});
                    State = State.WAIT;
                    tmpsting = "";
                    i--;
                }
            }
            case States.READ_POINT_NUMBER:{
                if(is_num(c))
                    tmpsting+=c;
                else{
                    token_list.push({type:"number",value:tmpsting});
                    State = State.WAIT;
                    tmpsting = "";
                    i--;
                }
            }
            case  States.READ_VAR:{
                if(is_num(c) || is_let(c)){
                    tmpsting+=c;
                    if(index_level > bracket_level){
                        index_level --;
                        if(!index_level){
                            token_list.push({type:"var",value:tmpsting});
                            State = State.WAIT;
                            tmpsting = "";
                        }
                    }
                }
                else if(c == " "){;}
                else if(c == "_"){
                    index_level ++;
                    tmpsting += "_".repeat(index_level);
                }
                else if(c == "\\"){
                    if(index_level == 0){
                        token_list.push({type:"var",value:tmpsting});
                        State = State.READING_LATEX;
                    }
                }
                else if(c == "{"){
                    if(!index_level){
                        logger = `unexpected bracket \'{\' at  ${i} +\n`;
                        return null;
                    }
                    else{
                        bracket_level ++;
                    }
                }
                else if(c == "}"){
                    if(bracket_level){
                        bracket_level --;
                        index_level --;
                    }
                }
                else {
                    if(bracket_level){
                        logger = `unexpected and of variable at ${i} +\n`;
                        return null;
                    }
                    token_list.push({type:"var",value:tmpsting});
                    tmpsting = "";
                    i--;
                }
            }
            case States.READ_LATEX:{
                if(is_let(c)){
                    tmpsting += c;
                    if(tmpsting in lexem_greek){
                        State = States.READ_VAR;
                    }
                }
                else if(c == "_"){
                    token_list.push({type:"latex",value:tmpsting});
                    token_list.push({type:"op",value:"_"});
                }
            }

        }
        i++;
    }
}