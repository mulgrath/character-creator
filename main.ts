import { Character, CharacterAttributes, CharacterClass, CharacterClassType } from "./creation-types.js";

const characterCreationForm = document.getElementById("character-creation-form") as HTMLFormElement;
const nameInput = document.getElementById("character-name") as HTMLInputElement;
const playerClassInput = document.getElementById("character-class") as HTMLSelectElement;
const appearanceColorInput = document.getElementById("appearance-color") as HTMLInputElement;
let player: Character;

if (!characterCreationForm || !nameInput || !playerClassInput || !appearanceColorInput) {
    throw new Error("Couldn't find required elements!");
}

characterCreationForm.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const isValid = name.length > 0 && /^[a-zA-Z0-9_]+$/.test(name);

    if (!isValid) {
        console.warn("Invalid name!");
        return;
    }

    const playerClass: CharacterClass = getCharacterClassByName(playerClassInput.value);

    player = new Character(name, playerClass, appearanceColorInput.value);
    console.log(`Name: ${player.getName()} Attributes: ${player.getAttributes()} Color: ${player.getColor()}`);
});

function getCharacterClassByName(className: string): CharacterClass {
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