import { Character } from "./creation-types.js";
var AppState;
(function (AppState) {
    AppState[AppState["CharacterSelect"] = 0] = "CharacterSelect";
    AppState[AppState["CharacterCreator"] = 1] = "CharacterCreator";
})(AppState || (AppState = {}));
let currentState = AppState.CharacterSelect;
const characterCreationForm = document.getElementById("character-creation-form");
const nameInput = document.getElementById("character-name");
const playerClassInput = document.getElementById("character-class");
const appearanceColorInput = document.getElementById("appearance-color");
if (!characterCreationForm || !nameInput || !playerClassInput || !appearanceColorInput) {
    throw new Error("Couldn't find required elements!");
}
let previewCharacter;
document.addEventListener('DOMContentLoaded', (event) => {
    previewCharacter = new Character("", playerClassInput.value, appearanceColorInput.value);
    displayCharacterPreview(previewCharacter);
});
characterCreationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (!verifyCharacterName(name)) {
        updateElementStyle("name-error", "display", "block");
        return;
    }
    updateElementStyle("name-error", "display", "none");
    const player = new Character(name, playerClassInput.value, appearanceColorInput.value);
    displayCharacterPreview(player);
});
appearanceColorInput.addEventListener('change', (event) => {
    previewCharacter = new Character(previewCharacter.getName(), previewCharacter.getClassName(), appearanceColorInput.value);
    updateElementStyle("color-display", "backgroundColor", previewCharacter.getColor());
});
playerClassInput.addEventListener('change', (event) => {
    previewCharacter = new Character(previewCharacter.getName(), playerClassInput.value, previewCharacter.getColor());
    updateElementText("preview-class", previewCharacter.getClassName());
    updateElementText("preview-class-description", previewCharacter.getClassDescription());
    updateAttributesText(previewCharacter.getAttributes());
});
function verifyCharacterName(name) {
    return name.length > 0 && name.length < 15 && /^[a-zA-Z_ ]+$/.test(name);
}
function displayCharacterPreview(character) {
    //updateElementStyle("character-preview", "display", "block");
    updateElementStyle("color-display", "backgroundColor", character.getColor());
    updateElementText("preview-class", character.getClassName());
    updateElementText("preview-class-description", previewCharacter.getClassDescription());
    updateAttributesText(character.getAttributes());
}
function updateAttributesText(characterAttributes) {
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
