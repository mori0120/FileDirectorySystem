// classes for data structure.

class File{
    constructor(name, parentDir, parentPath){
        this.name = name;
        this.parentDir = parentDir;
        this.currentPath = parentPath+name+"/";
        this.content = "empty";
        this.dateModified = new Date().toString();
    }

    writeContent(str){
        this.content = str;
        this.dateModified = new Date().toString();
    }

    overWriteContent(str){
        this.content += str;
        this.dateModified = new Date().toString();
    }

    updateDate(){
        this.dateModified = new Date().toString();
    }

    toString(){
        let str = `
            fileName :${this.name}, 
            parentDir: ${this.parentDir.name}, 
            lastModifiedDate: ${this.dateModified}, 
            content: ${this.content}
        `;
        return str;
    }
}

class Dir{
    constructor(name, parentDir, parentPath){
        this.name = name;
        this.parentDir = parentDir;
        this.children = {};
        this.currentPath = parentPath===null? "root/" : parentPath+name+"/";
        this.dateModified = new Date().toString();
    }

    addDir(newDirName){
        if(Object.hasOwn(this.children, newDirName)){
            let count = 1;
            while(Object.hasOwn(this.children, newDirName+"("+count+")")) count++;
            newDirName += "(" + count + ")";
        }
        let newDir = new Dir(newDirName, this, this.currentPath);
        this.children[newDirName] = newDir;
        this.dateModified = new Date().toString();
    }

    addFile(newFileName){
        if(Object.hasOwn(this.children, newFileName)){
            let count = 1;
            while(Object.hasOwn(this.children, newFileName+"("+count+")")) count++;
            newFileName += "(" + count + ")";
        }
        let newFile = new File(newFileName, this, this.currentPath);
        this.children[newFileName] = newFile;
        this.dateModified = new Date().toString();
    }

    updateDate(){
        this.dateModified = new Date().toString();
    }

    printChildren(){
        let resultStr = "";
        for(let child of Object.keys(this.children).sort()){
            resultStr += child + " ";
        }
        return resultStr;
    }

    deleteChild(childName){
        if(!Object.hasOwn(this.children, childName)) return;

        delete this.children[childName];
    }

    toString(){
        let str = `
            directoryName :${this.name}, 
            parentDirectory: ${this.parentDir.name}, 
            lastModifiedDate: ${this.dateModified}, 
            content: ${this.printChildren()}
        `;
        return str;
    }
}

// start main code 

let commandHistory = [];
let historyIndex = -1;
let userName = "student";
const rootDir = new Dir("root", null, null);
let currentDir = rootDir;

let CLITextInput = document.getElementById("command-input");
let CLIOutputDiv = document.getElementById("terminal-window");

CLITextInput.addEventListener('keyup', function(event){
    if(event.key === "Enter") {
        commandHistory.push(event.target.value);
        historyIndex = -1;
        Common.searchCommand(event.target.value);
        event.target.value = "";
    }
    else if(event.key === "ArrowUp"){
        if(historyIndex<=0) historyIndex = commandHistory.length-1;
        else historyIndex--;
        event.target.value = commandHistory[historyIndex];
    }
    else if(event.key === "ArrowDown"){
        if(historyIndex>=commandHistory.length-1) historyIndex = 0;
        else historyIndex++;
        event.target.value = commandHistory[historyIndex];
    }
});

class Common{
    static installedPackages = [];
    static commands = ["touch", "mkdir", "ls", "pwd", "cd", "print", "setContent", "rm"];

    static searchCommand(inputString){
        let inputStrArr = inputString.split(" ");
        this.appendMirrorParagraph(CLIOutputDiv, inputString);
        // パッケージのコマンドを使用しているかをチェック　（今はなし）

        // コマンドが適当かをバリデータでチェック
        if(!this.commandValidator(inputStrArr)["isValid"]){
            this.appendErrorParagraph(CLIOutputDiv, this.commandValidator(inputStrArr)["msg"]);
            return;
        }
        // 引数が適当かをバリデータでチェック
        if(!this.argumentsValidator(inputStrArr)["isValid"]){
            this.appendErrorParagraph(CLIOutputDiv, this.argumentsValidator(inputStrArr)["msg"]);
            return;
        }

        this.executeCommand(inputStrArr);
    }

    static commandValidator(inputStrArr){
        let result = { isValid: true, msg: "" };
        if(this.commands.indexOf(inputStrArr[0])===-1) {
            result.isValid = false;
            result.msg = `
                Invalid input is detected. must take form "commandName [arguments]. CommandNames are ${this.commands.join(" ")}".`;
        }
        return result;
    }

    static argumentsValidator(inputStrArr){
        let zeroArgCommands = ["pwd"];
        let zeroOrSingleArgCommands = ["ls"];
        let singleArgCommands = ["touch", "mkdir", "cd", "print", "rm"];
        let ltOrEqDoubleArgCommands = ["setContent"];

        let command = inputStrArr[0];
        let argumentArr = inputStrArr.slice(1);
        let result = { isValid: true, msg: "" };

        if(zeroArgCommands.indexOf(command)!=-1) {
            if(argumentArr.length!=0){
                result.isValid = false;
                result.msg = `Invalid argument is detected. ${command} doesn't need arguments.`;
            }
            return result;
        }

        if(zeroOrSingleArgCommands.indexOf(command)!=-1) {
            if(argumentArr.length!=0 && argumentArr.length!=1){
                result.isValid = false;
                result.msg = `Invalid argument is detected. ${command}  need no or one argument.`;
            }
            return result;
        }

        if(singleArgCommands.indexOf(command)!=-1) {
            if(argumentArr.length!=1){
                result.isValid = false;
                result.msg = `Invalid argument is detected. ${command}  need just one argument.`;
            }
            return result;
        }
        
        if(ltOrEqDoubleArgCommands.indexOf(command)!=-1) {
            if(argumentArr.length<2){
                result.isValid = false;
                result.msg = `Invalid argument is detected. ${command}  need larger than or equal to two arguments:"path" "string"... `;
            }
            return result;
        }

        // commandValidatorでコマンドが存在することは確認済みなので通常は以下の処理はされない。
        return result;
    }

    static executeCommand(inputStrArr){
        let command = inputStrArr[0];
        let argumentArr = inputStrArr.slice(1);
        // "touch", "mkdir", "ls", "pwd", "cd", "print", "setContent", "rm"
        switch(command){
            case "touch":
                this.touch(argumentArr.shift());
                break;
            case "mkdir":
                this.mkdir(argumentArr.shift());
                break;
            case "ls":
                this.ls(argumentArr.shift());
                break;
            case "pwd":
                this.pwd();
                break;
            case "cd":
                this.cd(argumentArr.shift());
                break;
            case "print":
                this.print(argumentArr.shift());
                break;
            case "setContent":
                this.setContent(argumentArr.shift(), argumentArr);
                break;
            case "rm":
                this.rm(argumentArr.shift());
                break;
        }
        return;
    }

    static touch(arg){
        if(Object.hasOwn(currentDir.children, arg)){
            currentDir.children[arg].updateDate();
            return;
        }
        currentDir.addFile(arg);
        this.appendResultParagraph(CLIOutputDiv, `created: ${arg}`);
        return;
    }

    static mkdir(arg){
        let targetParentDir = this.getTargetParentDir(arg).parent;
        let childDirName = this.getTargetParentDir(arg).childName;
        if(targetParentDir===null) {
            this.appendResultParagraph(CLIOutputDiv, "\"There are no such directories. Please confirm a path.\"");
            return;
        }
        targetParentDir.addDir(childDirName);
        this.appendResultParagraph(CLIOutputDiv, `created: ${childDirName}`);
        return;
    }

    static ls(arg){
        let result = "";
        if(!arg){
            result = currentDir.printChildren();
            this.appendResultParagraph(CLIOutputDiv, result);
            return;
        }
        let target = this.getTarget(arg);
        if(!target){
            result = "\"There is no such a file or directory. Please confirm a path.\"";
        }
        else if(target instanceof File){
            result = target.toString();
        }
        else if(target instanceof Dir){
            result = target.printChildren();
        }
        this.appendResultParagraph(CLIOutputDiv, result);
        return;
    }

    static pwd(){
        let result = currentDir.currentPath;
        this.appendResultParagraph(CLIOutputDiv, result);
        return;
    }

    static cd(arg){
        let target = this.getTarget(arg);
        
        if(target!=null && target instanceof Dir){
            currentDir = target;
        }
        else{
            this.appendResultParagraph(CLIOutputDiv, "\"There is no such a directory. Please confirm a path.\"");
            return;
        }
    }

    static print(arg){
        let target = this.getTarget(arg);
        if(target!=null && target instanceof File){
            let result = target.content;
            this.appendResultParagraph(CLIOutputDiv, result);
            return;
        }
        else{
            this.appendResultParagraph(CLIOutputDiv, "\"There is no such a file in a written path. Please confirm a path.\"");
            return;
        }
    }

    static setContent(arg, strArr){
        let target = this.getTarget(arg);
        if(target!=null && target instanceof File){
            target.writeContent(strArr.join(" "));
            return;
        }
        else{
            this.appendResultParagraph(CLIOutputDiv, "\"There is no such a file in a written path. Please confirm a path.\"");
            return;
        }
    }

    static rm(arg){
        if(Object.hasOwn(currentDir.children, arg)){
            currentDir.deleteChild(arg);
        }
        return;
    }

    static getTargetParentDir(arg){
        let pathArr = arg.split("/");
        let iterator = currentDir;
        let result = { parent: null, childName: null };
        if(pathArr[0]===""){
            iterator = rootDir;
            pathArr.shift();
        }
        while(pathArr.length>1){
            if(!iterator) {
                return result;
            }
            let next = pathArr.shift();
            if(next==="..") iterator = iterator.parentDir;
            else iterator = iterator.children[next];
        }
        result.parent = iterator;
        result.childName = pathArr[0];
        return result;
    }

    static getTarget(arg){
        let pathArr = arg.split("/");
        let iterator = currentDir;
        if(pathArr[0]===""){
            iterator = rootDir;
            pathArr.shift();
        }
        while(pathArr.length>0){
            if(!iterator) {
                return null;
            }
            let next = pathArr.shift();
            if(next==="..") iterator = iterator.parentDir;
            else iterator = iterator.children[next];
        }
        return iterator;
    }

    static appendMirrorParagraph(parentDiv, inputString){
        parentDiv.innerHTML+=
            `<p>
            <span style='color:green'>${userName}</span>
            <span style='color:magenta'>@</span>
            <span style='color:blue'>${currentDir.currentPath}</span>
            : ${inputString}
            </p>`;

        CLIOutputDiv.scrollTop = CLIOutputDiv.scrollHeight;
        return;
    }

    static appendErrorParagraph(parentDiv, errorMsg){
        parentDiv.innerHTML+=
            `<p>
                <span style='color:red'>Error</span>: ${errorMsg}
            </p>`;

        CLIOutputDiv.scrollTop = CLIOutputDiv.scrollHeight;
        return;
    }

    static appendResultParagraph(parentDir, result){
        parentDir.innerHTML += `
            <p>
                : ${result}
            </p>
        `;
        CLIOutputDiv.scrollTop = CLIOutputDiv.scrollHeight;
        return;
    }
}
