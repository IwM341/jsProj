function print(...args){
    console.log(...args,"\n");
}

var t0,res,t1;

fact  = function (n){
    prod = 1;
    for(i=2;i<=n;++i)
        prod *=i;
    return prod;
}
func = Function('return function(x){sum = 0; for(var i=0;i<10;++i){sum += x**i/fact(i)} return sum}')();


t0 = performance.now();
res = func(1);
t1 = performance.now();

print("res:",res,", dt = ", t1-t0);

t0 = performance.now();
res = function(x){sum = 0; for(var i=0;i<10;++i){sum += x**i/fact(i)} return sum}(1);
t1 = performance.now();
print("res:",res,", dt = ", t1-t0);

function EXP(x){
    sum = 0; for(var i=0;i<10;++i){sum += x**i/fact(i)} return sum;
}

const EXP1 = function(x){
    sum = 0; for(var i=0;i<10;++i){sum += x**i/fact(i)} return sum;
}

t0 = performance.now();
res = EXP(1)
t1 = performance.now();
print("res:",res,", dt = ", t1-t0);

t0 = performance.now();
res = 0; for(var i=0;i<10;++i){res += 1**i/fact(i)}
t1 = performance.now();
print("res:",res,", dt = ", t1-t0);

t0 = performance.now();
res = EXP1(1);
t1 = performance.now();
print("res:",res,", dt = ", t1-t0);

