import { createCharacterSlots, updateSlotDisplay, loadSavedCharacters, setSelectedSlot } from "./slot-manager.js";
import { exportCharacterToJSON, importCharacterFromJSON, saveCharacterToLocalStorage, loadCharacterFromLocalStorage } from "./character-storage.js";
import { AppState, switchToMode, currentState } from "./ui-state-manager.js";
import { displayCharacterPreview } from "./character-creator.js";

const characterCreatorBackButton = document.getElementById("character-creator-back-button") as HTMLButtonElement;
/// Character Selection ///
const deleteModeBtn = document.getElementById('delete-mode-btn') as HTMLButtonElement;
const exportModeBtn = document.getElementById('export-mode-btn') as HTMLButtonElement;
const importModeBtn = document.getElementById('import-mode-btn') as HTMLButtonElement;
const modeBackBtn = document.getElementById('mode-back-btn') as HTMLButtonElement;

if (!deleteModeBtn || !exportModeBtn || !importModeBtn || !modeBackBtn) {
    throw new Error("Couldn't find required elements!");
}

document.addEventListener('DOMContentLoaded', (event: Event) => {
    const slotContainer = document.getElementById("character-slots-container");
    if (!slotContainer) throw new Error("No slot container found!");
    createCharacterSlots(slotContainer, handleSlotClick);
    displayCharacterPreview();
    loadSavedCharacters();
});

characterCreatorBackButton.addEventListener('click', (event: Event) => {
    toggleCreationScreen();
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

function toggleCreationScreen() {
    if (currentState === AppState.CharacterCreator) {
        switchToMode(AppState.CharacterSelect);
    } else if (currentState === AppState.CharacterSelect) {
        switchToMode(AppState.CharacterCreator);
    }
}

function handleSlotClick(event: Event) {
    const slotIndex = parseInt((event.currentTarget as HTMLElement).getAttribute('data-slot-index')!);
    setSelectedSlot(slotIndex);

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
    if (loadCharacterFromLocalStorage(slotIndex)) {
        // Load the game using the current character
    } else {
        toggleCreationScreen();
    }
}

function handleDeleteCharacter(slotIndex: number) {
    const character = loadCharacterFromLocalStorage(slotIndex);
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
    const selectedCharacter = loadCharacterFromLocalStorage(slotIndex);
    if (selectedCharacter) {
        const jsonString = exportCharacterToJSON(selectedCharacter);
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
                const character = importCharacterFromJSON(jsonString);
                if (character) {
                    saveCharacterToLocalStorage(character, slotIndex);
                    updateSlotDisplay(slotIndex, character);
                    switchToMode(AppState.CharacterSelect);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}