import { createCharacterSlots, loadSavedCharacters, setSelectedSlot } from "./slot-manager.js";
import { loadCharacterFromLocalStorage, handleDeleteCharacter, handleExportCharacter, handleImportCharacter } from "./character-storage.js";
import { AppState, switchToMode, currentState, toggleCreationScreen } from "./ui-state-manager.js";
import { displayCharacterPreview } from "./character-creator.js";
const characterCreatorBackButton = document.getElementById("character-creator-back-button");
const deleteModeBtn = document.getElementById('delete-mode-btn');
const exportModeBtn = document.getElementById('export-mode-btn');
const importModeBtn = document.getElementById('import-mode-btn');
const modeBackBtn = document.getElementById('mode-back-btn');
if (!characterCreatorBackButton || !deleteModeBtn || !exportModeBtn || !importModeBtn || !modeBackBtn) {
    throw new Error("Couldn't find required elements!");
}
document.addEventListener('DOMContentLoaded', (event) => {
    const slotContainer = document.getElementById("character-slots-container");
    if (!slotContainer)
        throw new Error("No slot container found!");
    createCharacterSlots(slotContainer, handleSlotClick);
    displayCharacterPreview();
    loadSavedCharacters();
});
characterCreatorBackButton.addEventListener('click', (event) => {
    toggleCreationScreen();
});
deleteModeBtn.addEventListener('click', (event) => {
    switchToMode(AppState.DeleteMode);
});
exportModeBtn.addEventListener('click', (event) => {
    switchToMode(AppState.ExportMode);
});
importModeBtn.addEventListener('click', (event) => {
    switchToMode(AppState.ImportMode);
});
modeBackBtn.addEventListener('click', (event) => {
    switchToMode(AppState.CharacterSelect);
});
function handleSlotClick(event) {
    const slotIndex = parseInt(event.currentTarget.getAttribute('data-slot-index'));
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
function handleSelectCharacter(slotIndex) {
    if (loadCharacterFromLocalStorage(slotIndex)) {
        // Load the game using the current character
    }
    else {
        toggleCreationScreen();
    }
}
