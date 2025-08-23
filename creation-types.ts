export class Character {
    private attributes: CharacterAttributes;
    private color: string = 'blue';

    constructor(
        private name: string,
        private characterClass: CharacterClass,
        color?: string    
    ) {
        this.attributes = characterClass.getStartingAttributes();
        if (color) {
            this.color = color;
        }
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
}

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

export class CharacterClass {
    private startingAttributes: CharacterAttributes;

    constructor(
        private classType: CharacterClassType,
    ) {
        const attributes = CharacterClass.CLASS_DEFINITIONS[this.classType];
        if (!attributes) {
            throw new Error(`No starting attributes defined for class type: ${this.classType}`);
        }
        this.startingAttributes = attributes;
    }   

    private static readonly CLASS_DEFINITIONS = {
        [CharacterClassType.Warrior]: new CharacterAttributes(12, 10, 3, 5, 3),
        [CharacterClassType.Mage]: new CharacterAttributes(5, 5, 15, 5, 1),
        [CharacterClassType.Rogue]: new CharacterAttributes(7, 5, 3, 15, 2),
    };

    public getClassType(): CharacterClassType {
        return this.classType;
    }
    public getStartingAttributes(): CharacterAttributes {
        return this.startingAttributes;
    }
}