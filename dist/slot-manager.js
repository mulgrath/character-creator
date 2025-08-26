import { loadCharacterFromLocalStorage } from "./character-storage.js";
export const SLOT_COUNT = 6;
let selectedSlot = null;
export function updateSlotDisplay(slotIndex, character) {
    const slot = document.querySelector(`[data-slot-index="${slotIndex}"]`);
    if (character) {
        slot.innerHTML = createFilledSlotHTML(character);
        slot.className = 'character-slot filled';
    }
    else {
        slot.innerHTML = createEmptySlotHTML();
        slot.className = 'character-slot empty';
    }
}
export function loadSavedCharacters() {
    for (let slotIndex = 0; slotIndex < SLOT_COUNT; slotIndex++) {
        const savedCharacter = loadCharacterFromLocalStorage(slotIndex);
        updateSlotDisplay(slotIndex, savedCharacter);
    }
}
export function createCharacterSlots(containerElement, clickHandler) {
    for (let i = 0; i < SLOT_COUNT; i++) {
        const newSlot = document.createElement('div');
        newSlot.className = 'character-slot';
        newSlot.setAttribute('data-slot-index', i.toString());
        newSlot.addEventListener('click', clickHandler);
        containerElement.appendChild(newSlot);
    }
}
function createFilledSlotHTML(character) {
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
export function setSelectedSlot(slotIndex) {
    selectedSlot = slotIndex;
}
export function getSelectedSlot() {
    return selectedSlot;
}
function createEmptySlotHTML() {
    return `
        <div class="empty-slot-content">
            <span>Create New Character</span>
        </div>
    `;
}
