export function updateElementText(id: string, text: string) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`${id} was not found.`);
    }

    element.textContent = text;
}

export function updateElementStyle(id: string, property: string, value: string) {
    const element = document.getElementById(id) as HTMLElement;
    if (!element) throw new Error(`Element ${id} not found`);
    (element.style as any)[property] = value;
}