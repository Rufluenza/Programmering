.model small
.data
    helloMsg db 'Hello, World!', 0
    simonMsg db 'Simon says "hello World!"', 0
 
.code
main:
    ; Set up DS register to point to data segment
    mov ax, @data
    mov ds, ax
 
    ; Display the "Hello, World!" message
    mov ah, 09h
    mov dx, offset helloMsg
    int 21h
    mov dx, offset simonMsg
    int 21h
    
 
    ; Exit the program
    mov ah, 4Ch
    int 21h
end main