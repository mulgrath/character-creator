import { updateElementStyle, updateElementText } from "./dom-utils.js";
import { loadSavedCharacters } from './slot-manager.js';
export var AppState;
(function (AppState) {
    AppState[AppState["CharacterSelect"] = 0] = "CharacterSelect";
    AppState[AppState["CharacterCreator"] = 1] = "CharacterCreator";
    AppState[AppState["DeleteMode"] = 2] = "DeleteMode";
    AppState[AppState["ExportMode"] = 3] = "ExportMode";
    AppState[AppState["ImportMode"] = 4] = "ImportMode";
})(AppState || (AppState = {}));
export let currentState = AppState.CharacterSelect;
export function switchToMode(newState) {
    switch (newState) {
        case AppState.CharacterCreator:
            currentState = AppState.CharacterCreator;
            updateElementStyle("character-creator-screen", "display", "flex");
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
            updateElementText('instruction-text', "Select destination slot, then pick character .json file to import");
            updateElementStyle('mode-instruction', 'display', 'block');
            break;
        default:
            throw new Error("Invalid state.");
    }
}
export function toggleCreationScreen() {
    if (currentState === AppState.CharacterCreator) {
        switchToMode(AppState.CharacterSelect);
    }
    else if (currentState === AppState.CharacterSelect) {
        switchToMode(AppState.CharacterCreator);
    }
}
