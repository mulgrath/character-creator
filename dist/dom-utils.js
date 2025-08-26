export function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`${id} was not found.`);
    }
    element.textContent = text;
}
export function updateElementStyle(id, property, value) {
    const element = document.getElementById(id);
    if (!element)
        throw new Error(`Element ${id} not found`);
    element.style[property] = value;
}
