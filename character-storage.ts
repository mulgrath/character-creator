import { Character } from "./creation-types.js";

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