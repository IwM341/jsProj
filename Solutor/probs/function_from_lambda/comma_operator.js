function print(...args){
    console.log(...args,"\n");
}
/*
var y;
var x = (y=0, for(var i=0;i<10;++i){y +=i},y)
*/

var x;
var res;
f1 = function(y,y1,y2,y3){
    return Math.exp( (((y+y1)+y2)+y3) + (((y*y1)*y2)*y3) );
}
f2 = function (y,y1,y2,y3){
    return Math.exp( y+y1+y2+y3 + y*y1*y2*y3);
}
t0 = performance.now();
res = f1(x,1,2,3)
t1 = performance.now();
print("res:",res,", dt = ", t1-t0);

t0 = performance.now();
res = f2(x,1,2,3)
t1 = performance.now();
print("res:",res,", dt = ", t1-t0);