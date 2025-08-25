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
const characterSlots = document.querySelectorAll(".character-slot");
const characterCreatorBackButton = document.getElementById("character-creator-back-button");
let selectedSlot = null;
if (!characterCreationForm || !nameInput || !playerClassInput || !appearanceColorInput) {
    throw new Error("Couldn't find required elements!");
}
let previewCharacter;
document.addEventListener('DOMContentLoaded', (event) => {
    previewCharacter = new Character("", playerClassInput.value, appearanceColorInput.value);
    displayCharacterPreview(previewCharacter);
    loadSavedCharacters();
});
characterCreatorBackButton.addEventListener('click', (event) => {
    toggleCreationScreen();
});
characterSlots.forEach(slot => {
    slot.addEventListener('click', handleSlotClick);
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
    if (selectedSlot !== null) {
        player.saveToLocalStorage(selectedSlot);
    }
});
appearanceColorInput.addEventListener('change', (event) => {
    previewCharacter = new Character(previewCharacter.getName(), previewCharacter.getClassName(), appearanceColorInput.value);
    updateElementStyle("appearance-color-preview", "backgroundColor", previewCharacter.getColor());
});
playerClassInput.addEventListener('change', (event) => {
    previewCharacter = new Character(previewCharacter.getName(), playerClassInput.value, previewCharacter.getColor());
    updateElementText("preview-class", previewCharacter.getClassName());
    updateElementText("preview-class-description", previewCharacter.getClassDescription());
    updateAttributesText(previewCharacter.getAttributes());
});
function loadSavedCharacters() {
    for (let slotIndex = 0; slotIndex < characterSlots.length; slotIndex++) {
        const savedCharacter = Character.loadFromLocalStorage(slotIndex);
        updateSlotDisplay(slotIndex, savedCharacter);
    }
}
function updateSlotDisplay(slotIndex, character) {
    const slot = document.querySelector(`[data-slot-index="${slotIndex}"]`);
    if (character) {
        slot.innerHTML = createFilledSlotHTML(slotIndex, character);
        slot.className = 'character-slot filled';
    }
    else {
        slot.innerHTML = createEmptySlotHTML();
        slot.className = 'character-slot empty';
    }
}
function createFilledSlotHTML(slotIndex, character) {
    return `
        <div class="character-slot" data-slot-index="${slotIndex}">
            <div class="character-portrait">
                <div class="color-display" style="background-color: ${character.getColor()};"></div>
            </div>
            <div class="character-info">
                <div class="character-name">${character.getName()}</div>
                <div class="character-class">${character.getClassName()}</div>
            </div>
            <div class="character-meta">
                <div class="creation-date">08/24/2025</div>
                <button class="delete-btn">Delete</button>
            </div>
        </div>
    `;
}
function createEmptySlotHTML() {
    return `
        <div class="empty-slot-content">
            <span>Create New Character</span>
        </div>
    `;
}
function toggleCreationScreen() {
    if (currentState === AppState.CharacterCreator) {
        currentState = AppState.CharacterSelect;
        updateElementStyle("character-creator-screen", "display", "none");
        updateElementStyle("character-select-screen", "display", "block");
    }
    else if (currentState === AppState.CharacterSelect) {
        currentState = AppState.CharacterCreator;
        updateElementStyle("character-creator-screen", "display", "block");
        updateElementStyle("character-select-screen", "display", "none");
    }
}
function handleSlotClick(event) {
    const slotIndex = parseInt(event.currentTarget.getAttribute('data-slot-index'));
    if (event.target.classList.contains('delete-btn')) {
        console.log(`Delete slot ${slotIndex}`);
        return;
    }
    selectedSlot = slotIndex;
    if (Character.loadFromLocalStorage(selectedSlot)) {
        // Load the game using the current character
    }
    else {
        toggleCreationScreen();
    }
}
function verifyCharacterName(name) {
    return name.length > 0 && name.length < 15 && /^[a-zA-Z_ ]+$/.test(name);
}
function displayCharacterPreview(character) {
    //updateElementStyle("character-preview", "display", "block");
    updateElementStyle("appearance-color-preview", "backgroundColor", character.getColor());
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
