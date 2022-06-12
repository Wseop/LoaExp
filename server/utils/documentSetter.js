let documentSetter = {};

async function setItems(type, body) {
    let items = {};
    
    if (type === "chaosDungeon") {
        items.silling = body.silling;
        items.gold = body.gold;
        items.honorShard = body.honorShard;
        items.destruction = body.destruction;
        items.protection = body.protection;
        items.leapStone = body.leapStone;
        items.hallTicket = body.hallTicket;
        items.cubeTicket = body.cubeTicket;
        items.jewel = body.jewel;
    } else if (type === "guardian") {
        items.destruction = body.destruction;
        items.protection = body.protection;
        items.leapStone = body.leapStone;
    } else if (type === "chaosGate") {
        items.secretMap = body.secretMap;
    } else if (type === "ghostShip") {
        items.honorShard = body.honorShard;
        items.destruction = body.destruction;
        items.protection = body.protection;
        items.solarGrace = body.solarGrace;
        items.solarBlessing = body.solarBlessing;
        items.solarProtection = body.solarProtection;
    } else if (type === "fieldBoss") {
        items.destruction = body.destruction;
        items.protection = body.protection;
        items.solarGrace = body.solarGrace;
        items.solarBlessing = body.solarBlessing;
        items.solarProtection = body.solarBlessing;
        items.jewel = body.jewel;
    } else if (type === "secretMap") {
        items.silling = body.silling;
        items.gold = body.gold;
        items.solarGrace = body.solarGrace;
        items.solarBlessing = body.solarBlessing;
        items.solarProtection = body.solarProtection;
        items.honorShard = body.honorShard;
    } else if (type === "abyssDungeon") {
        items.spearOfLight = body.spearOfLight;
        items.crystalOfOrder = body.crystalOfOrder;
        items.sphereOfBrilliance = body.sphereOfBrilliance;
        items.bookOfJudgement = body.bookOfJudgement;
    } else if (type === "commander") {

    } else if (type === "epona") {

    }

    return items;
}

documentSetter.set = async (type, id, body) => {
    let document = {};
    
    document.userId = id;
    document.character = body.character;
    document.year = body.year;
    document.ww = body.ww;
    document.stage = body.stage;
    document.items = await setItems(type, body);
    
    return document;
};

module.exports = documentSetter;