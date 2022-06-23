let documentSetter = {};

documentSetter.setReward = async (id, body) => {
    let reward = {};
    
    reward.userId = id;
    reward.character = body.character;
    reward.year = body.year;
    reward.month = body.month;
    reward.stage = body.stage;
    reward.items = body.items;
    
    return reward;
};
documentSetter.setAccessory = async (id, body) => {
    let accessory = {};

    accessory.userId = id;
    accessory.date = new Date();
    accessory.grade = body.grade;
    accessory.part = body.part;
    accessory.quality = body.quality;
    accessory.ability1 = body.ability1;
    accessory.ability2 = body.ability2;
    accessory.engrave1 = body.engrave1;
    accessory.engrave2 = body.engrave2;
    accessory.from = body.from;
};

module.exports = documentSetter;