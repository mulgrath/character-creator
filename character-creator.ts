import { saveCharacterToLocalStorage } from "./character-storage.js";
import { Character, CharacterAttributes } from "./creation-types.js";
import { updateElementStyle, updateElementText } from "./dom-utils.js";
import { getSelectedSlot } from "./slot-manager.js";

const characterCreationForm = document.getElementById("character-creation-form") as HTMLFormElement;
const nameInput = document.getElementById("character-name") as HTMLInputElement;
const playerClassInput = document.getElementById("character-class") as HTMLSelectElement;
const colorPreview = document.getElementById('color-preview') as HTMLDivElement;
const hiddenColorInput = document.getElementById('appearance-color') as HTMLInputElement;

let previewCharacter = new Character("", playerClassInput.value, hiddenColorInput.value);

if (!characterCreationForm || !nameInput || !playerClassInput || !colorPreview || !hiddenColorInput) {
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

    previewCharacter = new Character(name, playerClassInput.value, hiddenColorInput.value);
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

colorPreview.addEventListener('click', () => {
    hiddenColorInput.click();
});

hiddenColorInput.addEventListener('change', (event: Event) => {
    const newColor = (event.target as HTMLInputElement).value;
    colorPreview.style.backgroundColor = newColor;
    previewCharacter = new Character(previewCharacter.getName(), previewCharacter.getClassName(), hiddenColorInput.value);
    updateElementStyle("appearance-color-preview", "backgroundColor", previewCharacter.getColor());
});

playerClassInput.addEventListener('change', (event: Event) => {
    previewCharacter = new Character(previewCharacter.getName(), playerClassInput.value, previewCharacter.getColor());
    updateElementText("preview-class", previewCharacter.getClassName());
    updateElementText("preview-class-description", previewCharacter.getClassDescription());
    updateAttributesText(previewCharacter.getAttributes());
});