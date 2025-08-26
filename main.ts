import { Character, CharacterAttributes } from "./creation-types.js";

enum AppState {
    CharacterSelect,
    CharacterCreator,
    DeleteMode,
    ExportMode,
    ImportMode,
}

let currentState = AppState.CharacterSelect;

/// Character Creation ///
const characterCreationForm = document.getElementById("character-creation-form") as HTMLFormElement;
const nameInput = document.getElementById("character-name") as HTMLInputElement;
const playerClassInput = document.getElementById("character-class") as HTMLSelectElement;
const appearanceColorInput = document.getElementById("appearance-color") as HTMLInputElement;
const characterCreatorBackButton = document.getElementById("character-creator-back-button") as HTMLButtonElement;

/// Character Selection ///
const characterSlots: NodeListOf<Element> = document.querySelectorAll(".character-slot");
const deleteModeBtn = document.getElementById('delete-mode-btn') as HTMLButtonElement;
const exportModeBtn = document.getElementById('export-mode-btn') as HTMLButtonElement;
const importModeBtn = document.getElementById('import-mode-btn') as HTMLButtonElement;
const modeBackBtn = document.getElementById('mode-back-btn') as HTMLButtonElement;

let selectedSlot: number | null = null;

if (!characterCreationForm || !nameInput || !playerClassInput || !appearanceColorInput || !deleteModeBtn || 
    !exportModeBtn || !importModeBtn || !modeBackBtn) {
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

    handleCharacterCreation();
});

deleteModeBtn.addEventListener('click', (event: Event) => {
    switchToMode(AppState.DeleteMode);
});

exportModeBtn.addEventListener('click', (event: Event) => {
    switchToMode(AppState.ExportMode);
});

importModeBtn.addEventListener('click', (event: Event) => {
    switchToMode(AppState.ImportMode);
});

modeBackBtn.addEventListener('click', (event: Event) => {
    switchToMode(AppState.CharacterSelect);
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

function handleCharacterCreation() {
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
}

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
            <div class="creation-date">${new Date().toDateString()}</div>
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
        switchToMode(AppState.CharacterSelect);
    } else if (currentState === AppState.CharacterSelect) {
        switchToMode(AppState.CharacterCreator);
    }
}

function switchToMode(newState: AppState) {
    switch (newState) {
        case AppState.CharacterCreator:
            currentState = AppState.CharacterCreator;
            updateElementStyle("character-creator-screen", "display", "block");
            updateElementStyle("character-select-screen", "display", "none");
            break;
        case AppState.CharacterSelect:
            currentState = AppState.CharacterSelect;
            updateElementStyle("character-creator-screen", "display", "none");
            updateElementStyle("character-select-screen", "display", "block");
            updateElementStyle('mode-instruction', 'display', 'none');
            loadSavedCharacters();
            break;
        case AppState.DeleteMode:
            currentState = AppState.DeleteMode;
            updateElementText('instruction-text', "Select slot to delete");
            updateElementStyle('mode-instruction', 'display', 'block');
            break;
        case AppState.ExportMode:
            currentState = AppState.ExportMode;
            updateElementText('instruction-text', "Select slot to export");
            updateElementStyle('mode-instruction', 'display', 'block');
            break;
        case AppState.ImportMode:
            currentState = AppState.ImportMode;
            updateElementText('instruction-text', "Select slot for imported character, then select character .json file to import");
            updateElementStyle('mode-instruction', 'display', 'block');
            break;
        default:
            throw new Error("Invalid state.");
    }
}

function handleSlotClick(event: Event) {
    const slotIndex = parseInt((event.currentTarget as HTMLElement).getAttribute('data-slot-index')!);
    selectedSlot = slotIndex;

    switch (currentState) {
        case AppState.CharacterSelect:
            handleSelectCharacter(slotIndex);
            break;
        case AppState.DeleteMode:
            handleDeleteCharacter(slotIndex);
            break;
        case AppState.ExportMode:
            handleExportCharacter(slotIndex);
            break;
        case AppState.ImportMode:
            handleImportCharacter(slotIndex);
            break;
    }
}

function handleSelectCharacter(slotIndex: number) {
    if (Character.loadFromLocalStorage(slotIndex)) {
        // Load the game using the current character
    } else {
        toggleCreationScreen();
    }
}

function handleDeleteCharacter(slotIndex: number) {
    const character = Character.loadFromLocalStorage(slotIndex);
    if (character) {
        const confirmDelete = confirm(`Are you sure you want to delete ${character.getName()}?`);
        if (confirmDelete) {
            deleteCharacter(slotIndex);
        }
    }
}

function deleteCharacter(slotIndex: number) {
    localStorage.removeItem(`character_${slotIndex}`);
    updateSlotDisplay(slotIndex, null);
}

function handleExportCharacter(slotIndex: number) {
    const selectedCharacter = Character.loadFromLocalStorage(slotIndex);
    if (selectedCharacter) {
        const jsonString = selectedCharacter.exportToJSON();
        downloadJSON(jsonString, `${selectedCharacter.getName()}.json`);
    }
}

function downloadJSON(jsonString: string, filename: string) {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function handleImportCharacter(slotIndex: number) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const jsonString = e.target?.result as string;
                const character = Character.importFromJSON(jsonString);
                if (character) {
                    character.saveToLocalStorage(slotIndex);
                    updateSlotDisplay(slotIndex, character);
                    switchToMode(AppState.CharacterSelect);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function verifyCharacterName(name: string): boolean {
    return name.length > 0 && name.length < 15 && /^[a-zA-Z_ ]+$/.test(name);
}

function displayCharacterPreview(character: Character) {
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