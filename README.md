# File Directory System
## What's this?
This is a Command Line Interface App. You can create a tree structured file system.  
  
## How to use?  
Please input "commandName \[arguments\]".
Supported commands are below.  
- ls \[fileOrDirPath\]  
    - show files and directories in a designated directory or a designated file's information.  
    - If there is no arguments, show files and directories in a current directory.  
- pwd  
    - show a curruent directory's path.  
- touch fileOrDirName
    - create a file named the designated name in a current directory.  
    - If there is the same name file or directory in a current directory, update its last modified date.  
-  mkdir \[dirPath/\]newDirName
    - create a directory named the desigrated name in a desigated directory.
    - If there is no dirPath, a directory is created in a current directory.
- cd filePath
    - change a current directory to a designated one.
- rm fileOrDirName
    - remove a file or directory in a current directory.
- print filePath
    - show a designated file's content.
- setContent filePath contentText
    - overwrite a designated file's content.  
  
**Note**    
When you write fileOrDirPath, ".." means a parent directory.  
If the path starts from "/", it is an absolute path(first "/" means the root direcotry).  
Else, it is a relative path from a current directory.  
  
## URL  
You can use this app here(url: ).
  
## What's is used?
- HTML
- CSS
- JavaScript
