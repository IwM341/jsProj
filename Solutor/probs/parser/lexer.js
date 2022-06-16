const LTypes = {
    word:0,
    constant:1,
    latex:2,
    bracket:3,
    symbol:4
}
 class  LexicalToken{
    
    constructor(type,value){
        this.type = type;
        this.value = value;
    }

};


const symbols = ["+","-","/","*","_",",","^","%","!","=","<",">"] ;
const brackets =  ["(",")","{","}","[","]","|","ulcorner","urcorner","llcorner","lrcorner"];
const spaces = [' ','\t','\n','\r','\f','\v'];

function is_let(c){
    if( c.toUpperCase() != c.toLowerCase() ){
        return true;
    }
    else{
        return false; 
    }  
}

function is_smb(c){
    if( symbols.includes(c)){
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
    if( brackets.includes(c)){
        return true;
    }
    else{
        return false; 
    }  
}

function is_space(c){
    if( spaces.includes(c)){
        return true;
    }
    else {
        return false;
    }
}

function lexer(S){
    var lexems = []
    var i = 0;
    var logger = ""
    var ind = false;
    while(i<S.length){
        let c = S[i];
        if (c == "d"){
            lexems.push(new LexicalToken(LTypes.word,c));
        }
        else if(is_let(c)){

            if(ind){
                lexems.push(new LexicalToken(LTypes.word,c));
                ind = false;
            }
            else{
                let str = c;
                for(i++; i <S.length && (is_let(S[i]) || is_num(S[i]) || is_space(S[i])) ;i++){
                    if(!is_space(S[i]))
                        str += S[i];
                }
                lexems.push(new LexicalToken(LTypes.word,str));
            }
        }
        else if(is_num(c)){
            if(ind){
                lexems.push(new LexicalToken(LTypes.constant,Number(c)));
                ind = false;
            }
            let str = c;
            for(i++; i <S.length && (is_num(S[i]) || is_num(S[i]) || S[i] == "." || is_space(S[i]) );i++){
                if(!is_space(S[i]))
                    str += S[i];
            }
            lexems.push(new LexicalToken(LTypes.constant,Number(str)));
        }
        else if(c == "\\"){
            let str = "";
            for(i++; i <S.length && (is_let(S[i]) || is_space(S[i])) ;i++){
                if(!is_space(S[i]))
                    str += S[i];
            }
            lexems.push(new LexicalToken(LTypes.latex,str));
        }
        else if(is_smb(c)){
            if(c=="_" && c == "^"){
                ind = true;
            }
            lexems.push(new LexicalToken(LTypes.symbol,c));
            i++;
        }
        else if(is_brack(c)){
            lexems.push(new LexicalToken(LTypes.bracket,c));
            i++;
        }
        else if(is_space(S[i])){
            i++;
        }
        else{
            let log = `undefined symbol \'${c}\' at i = ${i}\n`
            logger += log;
            console.log(log);
            i++;
        }
    }
    return new class LexerResult{
        constructor(lexems,logger){
            this.lexems = lexems;
            this.logger = logger;
        }
    }(lexems,logger);
}

/*
var lexems = lexer("x=\\frac{-b\\pm \\sqrt{b^2.3-4a*c}}{2.1a}")
const fs = require('fs');

fs.writeFileSync('log.json',JSON.stringify(lexems));
*/


const PTypes = {
    variable:0,
    constant:1,
    function:2,
    special: 3,
    operator:4,
    bracket:5
};
class Token{
    constructor (type,value){
        this.type = type;
        this.value = value;
    }
}

function VarToken(var_str,latex_str){
    let token = new Token(PTypes.variable,var_str);
    token.latex =  latex_str;
    return token;
}

const OperatorTable = {
    "times":"*",
    "dot":"*",
    "cdot":"*",
    "mod":"%",
    "colon":"/",
    "choose":"ch",
    "land":"and","lor":"or","lnot":"not","implies":"imp","leftarrow":"limp","rightarrow":"imp",
    "leq":"<=","leqslant":"<=","geq":">=","geqslant":">=","ne":"!=","neg":"not",

};
const ConstTable = {
    "exponentialE" : "e",
    "differentialD" : "d",
    "partial" : "d"
};

const latex_symbols = require("./latex.json");

function is_var(lx){
    return lx.type == LTypes.word  || 
        (lx.type == LTypes.latex && 
        latex_symbols.greek.includes(lx.value));
}
function lexical_parser(lexem_list ){
    var tokens = [];
    var logger = "";


    
    

    i = 0;

    while(i < lexem_list.length){
        lx = lexem_list[i];
        if(is_var(lx)){
            let str_var = lx.value;
            let str_latex = lx.value;
            i++;
            
            if(i == lexem_list.length){
                tokens.push(VarToken(str_var,str_latex));
                break;
            }
            if(lexem_list[i].value == "_"){
                let varlvl = 0;
                let brlvl = 0;
                let fast_index = true;
                while(i < lexem_list.length && varlvl > brlvl || fast_index){
                    lx = lexem_list[i];
                    if(lx.value == "_"){
                        fast_index = true;
                        varlvl ++;
                        str_var += "_".repeat(varlvl);
                        str_latex += "_";
                    }
                    else if(lx.value == "{"){
                        fast_index = false;
                        str_latex += "{";
                        brlvl ++;;
                    }
                    else if(lx.value == "}"){
                        str_latex += "}";
                        brlvl ++;
                        varlvl --;
                    }
                    else if(lx.type == LTypes.constant || is_var(lx)){
                        let val = String(lx.value).replace(".","");
                        str_var += val;
                        str_latex += ""
                        if(fast_index){
                            varlvl --;
                        }
                    }
                    i++;
                }
            }
            tokens.push(VarToken(str_var,str_latex));   
        }
        else if(lx.type == LTypes.bracket){
            tokens.push(new Token(PTypes.bracket,lx.value));
            i++;
        }
        else if(lx.type == LTypes.constant){
            tokens.push(new Token(PTypes.constant,lx.value));
            i++;
        }
        else if(lx.type == LTypes.symbol){
            let smb = lx.value;
            if(smb == "!"){
                smb = "fact";
            }
            tokens.push(new Token(PTypes.operator,smb));
            i++;
        }
        else if(lx.type == LTypes.latex){
            if(latex_symbols.functions.includes(lx.value)){
                tokens.push(new Token(PTypes.function,lx.value));
            }
            else if(latex_symbols.constants.includes(lx.value)){
                if (!(lx.value in ConstTable)){
                    logger += `ConstTable doesn't contain ${lx.value} at i = ${i}\n`; 
                }
                else
                    tokens.push(new Token(PTypes.variable,ConstTable[lx.value]));
            }
            else if(latex_symbols.special.includes(lx.value)){
                tokens.push(new Token(PTypes.special,lx.value));
            }
            else if(latex_symbols.inequalities.includes(lx.value) || 
            latex_symbols.logic.includes(lx.value) ||
            latex_symbols.operators.includes(lx.value)){
                if (!(lx.value in OperatorTable)){
                    logger += `OperatorTable doesn't contain ${lx.value} at i = ${i}\n`; 
                }
                else
                    tokens.push(new Token(PTypes.operator,OperatorTable[lx.value]));
            }
            i++;
        }
        else {
            logger += `Undefined token ${lx} at i = ${i}\n`; 
            i++;
        }
    }

    return new class LParserResult{
        constructor(tokens,logger){
            this.tokens = tokens;
            this.logger = logger;
        }
    }(tokens,logger);
}

/*
var lexems = lexer("x=\\frac{-b\\pm \\sqrt{b^2.3-4a*c}}{2.1a}");
var tokens = lexical_parser(lexems.lexems);
const fs = require('fs');

fs.writeFileSync('log_lexer.json',JSON.stringify(lexems,null,'\t'));
fs.writeFileSync('log_Lparser.json',JSON.stringify(tokens,null,'\t'));

*/
const OperatorPrior = {

    ",":-10,
    
    "=":-1,

    "==":0.5,
    "!=":0.5,
    ">=":0.5,
    "<=":0.5,
    "<":0.5,
    ">":0.5,
    "not":0,
    "imp":0,
    "limp":0,
    "and":0,
    "or":0,

    "ch":0.6,
    "fact":4,

    "+":1,
    "-":1,
    "*":2,
    "/":2,
    "%":2,
    "do":3,
    "**": 5,

};
function parser(){

}
