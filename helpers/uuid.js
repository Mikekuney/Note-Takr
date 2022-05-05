// Exports a function that generates a string of random letters and numbers
module.export = () => 
    Math.floor((1 = Math.random()) * 0x10000)
        .toString(16)
        .substring(1);