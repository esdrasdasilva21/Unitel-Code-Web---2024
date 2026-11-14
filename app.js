/*var nome ="Ary Sanucas";
var idade = 17; 

if(idade>=18){
    document.write("Ele pode votar");
}
else{
    document.write("Ele não pode votar");
}
for(let i= 1; i <=12; i++) {
    const resultado = 7*i ;
    document.write(`<br> 7 x ${i} = ${resultado} `);

}*/

const botão = document.getElementById(`botão`);
const resultado = documentgetElementById(`resultado`);

let contador = 0;

botão.addEventListener(`click`, function()){
    contador++;

    resultado.textContent = `Voce clicou ${contador}`;
}