import { createCharacterSlots, loadSavedCharacters, setSelectedSlot } from "./slot-manager.js";
import { loadCharacterFromLocalStorage, handleDeleteCharacter, handleExportCharacter, handleImportCharacter } from "./character-storage.js";
import { AppState, switchToMode, currentState, toggleCreationScreen } from "./ui-state-manager.js";
import { displayCharacterPreview } from "./character-creator.js";

const characterCreatorBackButton = document.getElementById("character-creator-back-button") as HTMLButtonElement;
const deleteModeBtn = document.getElementById('delete-mode-btn') as HTMLButtonElement;
const exportModeBtn = document.getElementById('export-mode-btn') as HTMLButtonElement;
const importModeBtn = document.getElementById('import-mode-btn') as HTMLButtonElement;
const modeBackBtn = document.getElementById('mode-back-btn') as HTMLButtonElement;

if (!characterCreatorBackButton || !deleteModeBtn || !exportModeBtn || !importModeBtn || !modeBackBtn) {
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