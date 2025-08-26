import { Character } from "./creation-types.js";
import { updateSlotDisplay } from "./slot-manager.js";
import { AppState, switchToMode } from "./ui-state-manager.js";

export function saveCharacterToLocalStorage(character: Character, slotIndex: number): void {
    const saveData = {
        name: character.getName(),
        className: character.getClassName().toLowerCase(),
        color: character.getColor()
    };
    localStorage.setItem(`character_${slotIndex}`, JSON.stringify(saveData));
}

export function loadCharacterFromLocalStorage(slotIndex: number): Character | null {
    const saveData = localStorage.getItem(`character_${slotIndex}`);
    if (!saveData) return null;

    const data = JSON.parse(saveData);
    return new Character(data.name, data.className, data.color);
}

export function exportCharacterToJSON(character: Character): string {
    const exportData = {
        name: character.getName(),
        className: character.getClassName().toLowerCase(),
        color: character.getColor(),
        exportDate: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
}

export function importCharacterFromJSON(jsonString: string): Character | null {
    try {
        const characterData = JSON.parse(jsonString);
        return new Character(characterData.name, characterData.className, characterData.color);
    } catch (error) {
        return null;
    }
}


export function handleImportCharacter(slotIndex: number) {
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

export function handleDeleteCharacter(slotIndex: number) {
    const character = loadCharacterFromLocalStorage(slotIndex);
    if (character) {
        const confirmDelete = confirm(`Are you sure you want to delete ${character.getName()}?`);
        if (confirmDelete) {
            deleteCharacterFromSlot(slotIndex);
        }
    }
}

function deleteCharacterFromSlot(slotIndex: number) {
    localStorage.removeItem(`character_${slotIndex}`);
    updateSlotDisplay(slotIndex, null);
}

export function handleExportCharacter(slotIndex: number) {
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