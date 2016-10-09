//withを使用しない
var radius = 4;
var area = Math.PI * radius * radius;

//withを使用する
radius = 4;

with(Math){
    var area = PI * radius * radius;
}