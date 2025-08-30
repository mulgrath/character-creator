export var CharacterClassType;
(function (CharacterClassType) {
    CharacterClassType[CharacterClassType["Warrior"] = 0] = "Warrior";
    CharacterClassType[CharacterClassType["Mage"] = 1] = "Mage";
    CharacterClassType[CharacterClassType["Rogue"] = 2] = "Rogue";
})(CharacterClassType || (CharacterClassType = {}));
export class CharacterAttributes {
    constructor(constitution, strength, mind, agility, defense) {
        this.constitution = constitution;
        this.strength = strength;
        this.mind = mind;
        this.agility = agility;
        this.defense = defense;
    }
}
const CLASS_DEFINITIONS = {
    [CharacterClassType.Warrior]: new CharacterAttributes(12, 10, 3, 5, 3),
    [CharacterClassType.Mage]: new CharacterAttributes(5, 5, 15, 5, 1),
    [CharacterClassType.Rogue]: new CharacterAttributes(7, 5, 3, 15, 2),
};
const CLASS_DESCRIPTIONS = {
    [CharacterClassType.Warrior]: "Both sturdy and strong, the Warrior excels at shrugging off attacks while dealing moderate damage with their weapon.",
    [CharacterClassType.Mage]: "While fragile, the powerful Mage excels in magical attacks that can lay low any that dare to approach.",
    [CharacterClassType.Rogue]: "The nimble Rogue excels in avoiding attacks and striking faster than foes can respond."
};
export class Character {
    constructor(name, className, color, creationDate) {
        this.name = name;
        this.color = 'blue';
        this.classType = this.getClassTypeFromString(className);
        this.attributes = CLASS_DEFINITIONS[this.classType];
        if (color) {
            this.color = color;
        }
        this.creationDate = creationDate || new Date();
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
    getClassName() {
        return CharacterClassType[this.classType];
    }
    getClassDescription() {
        return CLASS_DESCRIPTIONS[this.classType];
    }
    getCreationDate() {
        return new Date(this.creationDate);
    }
    getFormattedCreationDate() {
        return new Date(this.creationDate).toDateString();
    }
    getClassTypeFromString(name) {
        switch (name.toLowerCase()) {
            case "warrior": return CharacterClassType.Warrior;
            case "mage": return CharacterClassType.Mage;
            case "rogue": return CharacterClassType.Rogue;
            default:
                throw new Error(`Unknown character class: ${name}`);
        }
    }
}
