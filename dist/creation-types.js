export class Character {
    constructor(name, characterClass, color) {
        this.name = name;
        this.characterClass = characterClass;
        this.color = 'blue';
        this.attributes = characterClass.getStartingAttributes();
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
}
export var CharacterClassType;
(function (CharacterClassType) {
    CharacterClassType[CharacterClassType["Warrior"] = 0] = "Warrior";
    CharacterClassType[CharacterClassType["Mage"] = 1] = "Mage";
    CharacterClassType[CharacterClassType["Rogue"] = 2] = "Rogue";
})(CharacterClassType || (CharacterClassType = {}));
export class CharacterClass {
    constructor(classType) {
        this.classType = classType;
        this.CLASS_DEFINITIONS = {
            [CharacterClassType.Warrior]: new CharacterAttributes(12, 10, 3, 5, 3),
            [CharacterClassType.Mage]: new CharacterAttributes(5, 5, 15, 5, 1),
            [CharacterClassType.Rogue]: new CharacterAttributes(7, 5, 3, 15, 2),
        };
        this.startingAttributes = this.CLASS_DEFINITIONS[this.classType];
    }
    getClassType() {
        return this.classType;
    }
    getStartingAttributes() {
        return this.startingAttributes;
    }
}
export class CharacterAttributes {
    constructor(constitution, strength, mind, agility, defense) {
        this.constitution = constitution;
        this.strength = strength;
        this.mind = mind;
        this.agility = agility;
        this.defense = defense;
    }
}
