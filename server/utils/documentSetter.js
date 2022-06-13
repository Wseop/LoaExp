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
    accessory.character = body.character;
    accessory.year = body.year;
    accessory.month = body.month;
    accessory.content = body.content;
    accessory.detail = body.detail;
};

module.exports = documentSetter;