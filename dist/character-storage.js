import { Character } from "./creation-types.js";
import { updateSlotDisplay } from "./slot-manager.js";
import { AppState, switchToMode } from "./ui-state-manager.js";
export function saveCharacterToLocalStorage(character, slotIndex) {
    const saveData = {
        name: character.getName(),
        className: character.getClassName().toLowerCase(),
        color: character.getColor()
    };
    localStorage.setItem(`character_${slotIndex}`, JSON.stringify(saveData));
}
export function loadCharacterFromLocalStorage(slotIndex) {
    const saveData = localStorage.getItem(`character_${slotIndex}`);
    if (!saveData)
        return null;
    const data = JSON.parse(saveData);
    return new Character(data.name, data.className, data.color);
}
export function exportCharacterToJSON(character) {
    const exportData = {
        name: character.getName(),
        className: character.getClassName().toLowerCase(),
        color: character.getColor(),
        exportDate: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
}
export function importCharacterFromJSON(jsonString) {
    try {
        const characterData = JSON.parse(jsonString);
        return new Character(characterData.name, characterData.className, characterData.color);
    }
    catch (error) {
        return null;
    }
}
export function handleImportCharacter(slotIndex) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const jsonString = e.target?.result;
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
export function handleDeleteCharacter(slotIndex) {
    const character = loadCharacterFromLocalStorage(slotIndex);
    if (character) {
        const confirmDelete = confirm(`Are you sure you want to delete ${character.getName()}?`);
        if (confirmDelete) {
            deleteCharacterFromSlot(slotIndex);
        }
    }
}
function deleteCharacterFromSlot(slotIndex) {
    localStorage.removeItem(`character_${slotIndex}`);
    updateSlotDisplay(slotIndex, null);
}
export function handleExportCharacter(slotIndex) {
    const selectedCharacter = loadCharacterFromLocalStorage(slotIndex);
    if (selectedCharacter) {
        const jsonString = exportCharacterToJSON(selectedCharacter);
        downloadJSON(jsonString, `${selectedCharacter.getName()}.json`);
    }
}
function downloadJSON(jsonString, filename) {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
