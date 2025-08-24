import { Character } from "./creation-types.js";
const characterCreationForm = document.getElementById("character-creation-form");
const nameInput = document.getElementById("character-name");
const playerClassInput = document.getElementById("character-class");
const appearanceColorInput = document.getElementById("appearance-color");
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
    const player = new Character(name, playerClassInput.value, appearanceColorInput.value);
    displayCharacterPreview(player);
});
appearanceColorInput.addEventListener('change', (event) => {
    updateElementStyle("color-display", "backgroundColor", appearanceColorInput.value);
});
playerClassInput.addEventListener('change', (event) => {
    updateElementText("preview-class", playerClassInput.value);
});
function displayCharacterPreview(character) {
    const characterAttributes = character.getAttributes();
    updateElementStyle("character-preview", "display", "block");
    updateElementStyle("color-display", "backgroundColor", character.getColor());
    updateElementText("preview-name", character.getName());
    updateElementText("preview-class", character.getClassName());
    updateElementText("stat-constitution", characterAttributes.constitution.toString());
    updateElementText("stat-strength", characterAttributes.strength.toString());
    updateElementText("stat-mind", characterAttributes.mind.toString());
    updateElementText("stat-agility", characterAttributes.agility.toString());
    updateElementText("stat-defense", characterAttributes.defense.toString());
}
function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`${id} was not found.`);
    }
    element.textContent = text;
}
function updateElementStyle(id, property, value) {
    const element = document.getElementById(id);
    if (!element)
        throw new Error(`Element ${id} not found`);
    element.style[property] = value;
}
