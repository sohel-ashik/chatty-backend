function one(x){
    x = 10;
}

function two(){
    let x = 0;
    one(x);
    console.log(x);
}

two();