export enum CharacterClassType {
    Warrior,
    Mage,
    Rogue
}

export class CharacterAttributes {
    constructor (
        public constitution: number,
        public strength: number,
        public mind: number,
        public agility: number,
        public defense: number,
    ) {}
}

export class Character {
    private static readonly CLASS_DEFINITIONS = {
        [CharacterClassType.Warrior]: new CharacterAttributes(12, 10, 3, 5, 3),
        [CharacterClassType.Mage]: new CharacterAttributes(5, 5, 15, 5, 1),
        [CharacterClassType.Rogue]: new CharacterAttributes(7, 5, 3, 15, 2),
    };

    private attributes: CharacterAttributes;
    private color: string = 'blue';
    private classType: CharacterClassType;

    constructor (private name: string, className: string, color?: string) {
        this.classType = this.getClassTypeFromString(className);
        this.attributes = Character.CLASS_DEFINITIONS[this.classType];
        if (color) {
            this.color = color;
        }
    }

    getName() {
        return this.name;
    }

    getAttributes() {
        return this.attributes;
    }

    getColor() {
        return this.color;
    }

    getClassType() {
        return this.classType;
    }

    getClassName(): string {
        return CharacterClassType[this.classType];
    }

    private getClassTypeFromString(name: string): CharacterClassType {
        switch (name) {
            case "warrior": return CharacterClassType.Warrior;
            case "mage": return CharacterClassType.Mage;
            case "rogue": return CharacterClassType.Rogue;
            default:
                throw new Error(`Unknown character class: ${name}`);
        }
    }
}