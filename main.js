let commandHistory = [];
let commandIndex = -1;
let userName = "student";
let currentDir = "home"

let commandInput = document.getElementById("command-input");
commandInput.addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        commandHistory.push(event.target.value);
        commandIndex = -1;
        printCommand(event.target.value);
        event.target.value = "";
    }
    else if(event.key === "ArrowUp"){
        if(commandIndex<=0) commandIndex = commandHistory.length-1;
        else commandIndex--;
        event.target.value = commandHistory[commandIndex];
    }
    else if(event.key === "ArrowDown"){
        if(commandIndex>=commandHistory.length-1) commandIndex = 0;
        else commandIndex++;
        event.target.value = commandHistory[commandIndex];
    }

});

function printCommand(commadnStr){
    let terminalWindow = document.getElementById("terminal-window");
    terminalWindow.innerHTML += `
        <div>
            <p><span style="color: green">${userName}</span> <span style="color: pink">@</span> <span style="color: blue">${currentDir}</span>: ${commadnStr} </p>
        </div>
    `;
    terminalWindow.scrollTop = terminalWindow.scrollHeight;
}