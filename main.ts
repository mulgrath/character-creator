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
const characterSlots: NodeListOf<Element> = document.querySelectorAll(".character-slot");
const characterCreatorBackButton = document.getElementById("character-creator-back-button") as HTMLButtonElement;

let selectedSlot: number | null = null;

if (!characterCreationForm || !nameInput || !playerClassInput || !appearanceColorInput) {
    throw new Error("Couldn't find required elements!");
}

let previewCharacter: Character;

document.addEventListener('DOMContentLoaded', (event: Event) => {
    previewCharacter = new Character("", playerClassInput.value, appearanceColorInput.value);
    displayCharacterPreview(previewCharacter);
    loadSavedCharacters();
});

characterCreatorBackButton.addEventListener('click', (event: Event) => {
    toggleCreationScreen();
});

characterSlots.forEach(slot => {
    slot.addEventListener('click', handleSlotClick);
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

    if (selectedSlot !== null) {
        player.saveToLocalStorage(selectedSlot);
    }
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

function loadSavedCharacters() {
    for (let slotIndex = 0; slotIndex < characterSlots.length; slotIndex++) {
        const savedCharacter: Character | null = Character.loadFromLocalStorage(slotIndex);
        updateSlotDisplay(slotIndex, savedCharacter);
    }
}

function updateSlotDisplay(slotIndex: number, character: Character | null) {
    const slot = document.querySelector(`[data-slot-index="${slotIndex}"]`) as HTMLElement;
    
    if (character) {
        slot.innerHTML = createFilledSlotHTML(slotIndex, character);
        slot.className = 'character-slot filled';
    } else {
        slot.innerHTML = createEmptySlotHTML();
        slot.className = 'character-slot empty';
    }
}

function createFilledSlotHTML(slotIndex: number, character: Character): string {
    return `
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
    `;
}

function createEmptySlotHTML(): string {
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
        loadSavedCharacters();
    } else if (currentState === AppState.CharacterSelect) {
        currentState = AppState.CharacterCreator;
        updateElementStyle("character-creator-screen", "display", "block");
        updateElementStyle("character-select-screen", "display", "none");
    }
}

function handleSlotClick(event: Event) {
    const slotIndex = parseInt((event.currentTarget as HTMLElement).getAttribute('data-slot-index')!);
    
    if ((event.target as HTMLElement).classList.contains('delete-btn')) {
        const character = Character.loadFromLocalStorage(slotIndex);
        if (character) {
            const confirmDelete = confirm(`Are you sure you want to delete ${character.getName()}?`);
            if (confirmDelete) {
                deleteCharacter(slotIndex);
                updateSlotDisplay(slotIndex, null);
            }
        }
        return;
    }

    selectedSlot = slotIndex;

    if (Character.loadFromLocalStorage(selectedSlot)) {
        // Load the game using the current character
    } else {
        toggleCreationScreen();
    }
}

function deleteCharacter(slotIndex: number) {
    localStorage.removeItem(`character_${slotIndex}`);
}

function verifyCharacterName(name: string): boolean {
    return name.length > 0 && name.length < 15 && /^[a-zA-Z_ ]+$/.test(name);
}

function displayCharacterPreview(character: Character) {
    //updateElementStyle("character-preview", "display", "block");
    updateElementStyle("appearance-color-preview", "backgroundColor", character.getColor());
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