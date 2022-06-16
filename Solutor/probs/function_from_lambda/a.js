function print(...data){
    console.log(...data);
}

print( 2>3 ? 3 : 5);

var Correct = true;
var func = null;


try{
    const x = 0;
    func = Function("const x = 0; return function(a,b){return x*a+b;}")();
    //func = Function("return x*a+b;");
} catch (e){
    print(e);
    print('incorrt synthax');
    Correct = false;
}


if(typeof(func) == 'function'){
    try {
        func(2,3)
    } catch (e) {
        print(e);
        print('cannot eval function');
        Correct = false;
    }
    //print( func(2,4));
}
else
    print(typeof(func));

if(Correct)
    print(func(2,3));