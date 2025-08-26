import { saveCharacterToLocalStorage } from "./character-storage.js";
import { Character, CharacterAttributes } from "./creation-types.js";
import { updateElementStyle, updateElementText } from "./dom-utils.js";
import { getSelectedSlot } from "./slot-manager.js";

const characterCreationForm = document.getElementById("character-creation-form") as HTMLFormElement;
const nameInput = document.getElementById("character-name") as HTMLInputElement;
const playerClassInput = document.getElementById("character-class") as HTMLSelectElement;
const appearanceColorInput = document.getElementById("appearance-color") as HTMLInputElement;

let previewCharacter = new Character("", playerClassInput.value, appearanceColorInput.value);

if (!characterCreationForm || !nameInput || !playerClassInput || !appearanceColorInput) {
    throw new Error("Couldn't find required elements!");
}

export function displayCharacterPreview() {
    updateElementStyle("appearance-color-preview", "backgroundColor", previewCharacter.getColor());
    updateElementText("preview-class", previewCharacter.getClassName());
    updateElementText("preview-class-description", previewCharacter.getClassDescription());
    updateAttributesText(previewCharacter.getAttributes());
}

function verifyCharacterName(name: string): boolean {
    return name.length > 0 && name.length < 15 && /^[a-zA-Z_ ]+$/.test(name);
}

function handleCharacterCreation() {
    const name = nameInput.value.trim();

    if (!verifyCharacterName(name)) {
        updateElementStyle("name-error", "display", "block");
        return;
    }
    updateElementStyle("name-error", "display", "none");

    previewCharacter = new Character(name, playerClassInput.value, appearanceColorInput.value);
    displayCharacterPreview();

    const selectedSlot = getSelectedSlot();
    if (selectedSlot !== null) {
        saveCharacterToLocalStorage(previewCharacter, selectedSlot);
    }
}

function updateAttributesText(characterAttributes: CharacterAttributes) {
    updateElementText("stat-constitution", characterAttributes.constitution.toString());
    updateElementText("stat-strength", characterAttributes.strength.toString());
    updateElementText("stat-mind", characterAttributes.mind.toString());
    updateElementText("stat-agility", characterAttributes.agility.toString());
    updateElementText("stat-defense", characterAttributes.defense.toString());
}

characterCreationForm.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault();

    handleCharacterCreation();
});

appearanceColorInput.addEventListener('change', (event: Event) => {
    previewCharacter = new Character(previewCharacter.getName(), previewCharacter.getClassName(), appearanceColorInput.value);
    updateElementStyle("appearance-color-preview", "backgroundColor", previewCharacter.getColor());
});

playerClassInput.addEventListener('change', (event: Event) => {
    previewCharacter = new Character(previewCharacter.getName(), playerClassInput.value, previewCharacter.getColor());
    updateElementText("preview-class", previewCharacter.getClassName());
    updateElementText("preview-class-description", previewCharacter.getClassDescription());
    updateAttributesText(previewCharacter.getAttributes());
});