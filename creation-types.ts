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

const CLASS_DEFINITIONS = {
    [CharacterClassType.Warrior]: new CharacterAttributes(12, 10, 3, 5, 3),
    [CharacterClassType.Mage]: new CharacterAttributes(5, 5, 15, 5, 1),
    [CharacterClassType.Rogue]: new CharacterAttributes(7, 5, 3, 15, 2),
};

const CLASS_DESCRIPTIONS = {
    [CharacterClassType.Warrior]: "Both sturdy and strong, the Warrior excels at shrugging off attacks while dealing moderate damage with their weapon.",
    [CharacterClassType.Mage]:  "While fragile, the powerful Mage excels in magical attacks that can lay low any that dare to approach.",
    [CharacterClassType.Rogue]: "The nimble Rogue excels in avoiding attacks and striking faster than foes can respond."
}

export class Character {
    private attributes: CharacterAttributes;
    private color: string = 'blue';
    private classType: CharacterClassType;
    private creationDate: Date;

    constructor (private name: string, className: string, color?: string, creationDate?: Date) {
        this.classType = this.getClassTypeFromString(className);
        this.attributes = CLASS_DEFINITIONS[this.classType];
        if (color) {
            this.color = color;
        }
        this.creationDate = creationDate || new Date();
    }

    public getName() {
        return this.name;
    }

    public getAttributes() {
        return this.attributes;
    }

    public getColor() {
        return this.color;
    }

    public getClassType() {
        return this.classType;
    }

    public getClassName(): string {
        return CharacterClassType[this.classType];
    }

    public getClassDescription(): string {
        return CLASS_DESCRIPTIONS[this.classType];
    }

    public getCreationDate(): Date {
        return new Date(this.creationDate);
    }

    public getFormattedCreationDate(): string {
        return new Date(this.creationDate).toDateString();
    }

    private getClassTypeFromString(name: string): CharacterClassType {
        switch (name.toLowerCase()) {
            case "warrior": return CharacterClassType.Warrior;
            case "mage": return CharacterClassType.Mage;
            case "rogue": return CharacterClassType.Rogue;
            default:
                throw new Error(`Unknown character class: ${name}`);
        }
    }
}