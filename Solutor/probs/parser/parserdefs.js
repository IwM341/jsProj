module.exports.Types = {
    word:0,
    const:1,
    latex:2,
    bracket:3,
    symbol:4
}
module.exports.LexicalToken = class {
    
    constructor(type,value){
        this.type = type;
        this.value = value;
    }
};
