import { Character, CharacterClass, CharacterClassType } from "./creation-types.js";
const characterCreationForm = document.getElementById("character-creation-form");
const nameInput = document.getElementById("character-name");
const playerClassInput = document.getElementById("character-class");
const appearanceColorInput = document.getElementById("appearance-color");
let player;
if (!characterCreationForm || !nameInput || !playerClassInput || !appearanceColorInput) {
    throw new Error("Couldn't find required elements!");
}
characterCreationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const isValid = name.length > 0 && /^[a-zA-Z0-9_]+$/.test(name);
    if (!isValid) {
        console.warn("Invalid name!");
        return;
    }
    const playerClass = getCharacterClassByName(playerClassInput.value);
    player = new Character(name, playerClass, appearanceColorInput.value);
    console.log(`Name: ${player.getName()} Attributes: ${player.getAttributes()} Color: ${player.getColor()}`);
});
function getCharacterClassByName(className) {
    switch (className) {
        case "warrior":
            return new CharacterClass(CharacterClassType.Warrior);
        case "mage":
            return new CharacterClass(CharacterClassType.Mage);
        case "rogue":
            return new CharacterClass(CharacterClassType.Rogue);
        default:
            throw new Error("Invalid class type!");
    }
}
