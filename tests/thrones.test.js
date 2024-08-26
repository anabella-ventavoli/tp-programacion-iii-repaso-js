//Pruebas para la API de Thrones.
const fs = require ('fs');

async function fetchCharacters() {
    try {
        const response = await fetch ('https://thronesapi.com/api/v2/Characters');
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const characters = await response.json();
        return characters;
    }  
        catch (error) {
            console.error('Error en el fetch:', error);
            return null;
        }
}

function formatearCharacter(character) {
    return console.log(`ID = ${character.id}
Nombre = ${character.firstName}
Apellido = ${character.lastName}
Nombre completo = ${character.fullName}
Título = ${character.title}
Familia = ${character.family}
Imagen = ${character.image}
ImagenUrl = ${character.imageUrl}\n`)
}

//punto1
async function fetchCharacter(nombre, apellido) {
    const characters = await fetchCharacters();
    let idBuscado = characters.findIndex (objeto => objeto.firstName == nombre && objeto.lastName == apellido);
    try {
        const response = await fetch(`https://thronesapi.com/api/v2/Characters/${idBuscado}`);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const charachter = await response.json();
        formatearCharacter(charachter);
    }
        catch (error) {
            console.error('Error en el fetch:', error);
        }
}

//punto2
async function showCharacters() {
    const characters = await fetchCharacters();
    if (characters) {
        console.log(characters); 
    } else {
        console.log('No se pudieron obtener los personajes.');
    }
}

//punto 3
async function saveJson() {
    const characters = await fetchCharacters();
    if (characters) {
        const json = JSON.stringify(characters, null, 2);
        fs.writeFileSync('./personajes.json', json);
        console.log('Archivo personajes.json creado.');
        } else {
            console.log('No se pudieron obtener los personajes.');
        }
}

//punto 4 
function readLocalFile() {
    const file = JSON.parse(fs.readFileSync('./personajes.json', 'utf-8'));
    return file;
}

//punto 4a 
function  familyFilter(family) {
    let familyList = readLocalFile().filter(personaje => personaje.family == family);
    console.log(`La familia ${family} está compuesta por: `)
    familyList.map(personaje =>
        formatearCharacter(personaje)
    )
}

//punto 4b 
function addCharacter () {
    const file = readLocalFile();
    let newId = file.length;
    const newCharacter = {
    "id": newId,
    "firstName": "James",
    "lastName": "Fraser",
    "fullName": "James Alexander Malcolm MacKenzie Fraser",
    "title": "Laird Fraser of Broch Tuarach",
    "family": "Fraser",
    "image": "jamie.jpg",
    "imageUrl": "https://ar.pinterest.com/pin/7740630590310472/"
    }

    file.push(newCharacter); //agrego el personaje nuevo
    console.log(`Se agregó el personaje ${newCharacter.fullName}`);
    formatearCharacter(newCharacter);
    fs.unlinkSync('./personajes.json'); //elimino el archivo
    const newFile = JSON.stringify(file, null, 2); //convierto a json 
    fs.writeFileSync('./personajes.json', newFile); //escribo el archivo nuevo que tiene mi personaje agregado
    console.log('Archivo actualizado.');
}

//punto 4c 
function filterById() {
    let hasta25 = readLocalFile().filter(personaje => personaje.id <= 25); //flitro los personajes con id hasta 25
    const newFile = JSON.stringify(hasta25, null, 2); //convierto a json 
    fs.unlinkSync('./personajes.json'); //elimino el original
    fs.writeFileSync('./personajes.json', newFile); //guardo archivo con personajes id menores a 25
    console.log('Archivo personajes.json actualizado.');
}

//punto 1 - muestra los detalles de un personaje en particular
const nombre = 'Ned';
const apellido = 'Stark';
fetchCharacter(nombre, apellido);

//punto 2 - muestra lista de personajes
showCharacters();

//punto 3 - Guarda lista personajes en un archivo json
saveJson();

//punto 4a - Filtrar por familia
const family = "House Stark";
familyFilter(family);

//punto 4b - Agregar personaje y actualizar
addCharacter();

//punto 4c - Filtrar personajes por ID y actualizar
filterById();