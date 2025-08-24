import { Character, CharacterAttributes } from "./creation-types.js";

enum AppState {
    CharacterSelect,
    CharacterCreator
}

let currentState = AppState.CharacterSelect;

const characterCreationForm = document.getElementById("character-creation-form") as HTMLFormElement;
const nameInput = document.getElementById("character-name") as HTMLInputElement;
const playerClassInput = document.getElementById("character-class") as HTMLSelectElement;
const appearanceColorInput = document.getElementById("appearance-color") as HTMLInputElement;

if (!characterCreationForm || !nameInput || !playerClassInput || !appearanceColorInput) {
    throw new Error("Couldn't find required elements!");
}

let previewCharacter: Character;

document.addEventListener('DOMContentLoaded', (event: Event) => {
    previewCharacter = new Character("", playerClassInput.value, appearanceColorInput.value);
    displayCharacterPreview(previewCharacter);
});

characterCreationForm.addEventListener('submit', (event: SubmitEvent) => {
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

appearanceColorInput.addEventListener('change', (event: Event) => {
    previewCharacter = new Character(previewCharacter.getName(), previewCharacter.getClassName(), appearanceColorInput.value);
    updateElementStyle("color-display", "backgroundColor", previewCharacter.getColor());
});

playerClassInput.addEventListener('change', (event: Event) => {
    previewCharacter = new Character(previewCharacter.getName(), playerClassInput.value, previewCharacter.getColor());
    updateElementText("preview-class", previewCharacter.getClassName());
    updateElementText("preview-class-description", previewCharacter.getClassDescription());
    updateAttributesText(previewCharacter.getAttributes());
});

function verifyCharacterName(name: string): boolean {
    return name.length > 0 && name.length < 15 && /^[a-zA-Z_ ]+$/.test(name);
}

function displayCharacterPreview(character: Character) {
    //updateElementStyle("character-preview", "display", "block");
    updateElementStyle("color-display", "backgroundColor", character.getColor());
    updateElementText("preview-class", character.getClassName());
    updateElementText("preview-class-description", previewCharacter.getClassDescription());
    updateAttributesText(character.getAttributes());
}

function updateAttributesText(characterAttributes: CharacterAttributes) {
    updateElementText("stat-constitution", characterAttributes.constitution.toString());
    updateElementText("stat-strength", characterAttributes.strength.toString());
    updateElementText("stat-mind", characterAttributes.mind.toString());
    updateElementText("stat-agility", characterAttributes.agility.toString());
    updateElementText("stat-defense", characterAttributes.defense.toString());
}

function updateElementText(id: string, text: string) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`${id} was not found.`);
    }

    element.textContent = text;
}

function updateElementStyle(id: string, property: string, value: string) {
    const element = document.getElementById(id) as HTMLElement;
    if (!element) throw new Error(`Element ${id} not found`);
    (element.style as any)[property] = value;
}