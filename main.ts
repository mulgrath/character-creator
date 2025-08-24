import { Character, CharacterAttributes, CharacterClassType } from "./creation-types.js";

const characterCreationForm = document.getElementById("character-creation-form") as HTMLFormElement;
const nameInput = document.getElementById("character-name") as HTMLInputElement;
const playerClassInput = document.getElementById("character-class") as HTMLSelectElement;
const appearanceColorInput = document.getElementById("appearance-color") as HTMLInputElement;

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

    const player = new Character(name, playerClassInput.value, appearanceColorInput.value);
    displayCharacterPreview(player);
});

appearanceColorInput.addEventListener('change', (event: Event) => {
    updateElementStyle("color-display", "backgroundColor", appearanceColorInput.value);
});

playerClassInput.addEventListener('change', (event: Event) => {
});

function displayCharacterPreview(character: Character) {
    
    const characterAttributes: CharacterAttributes = character.getAttributes();

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