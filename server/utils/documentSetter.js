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
        items.ticket = body.ticket;
        items.jewel = body.jewel;
    } else if (type === "guardian") {
        items.destruction = body.destruction;
        items.protection = body.protection;
        items.leapStone = body.leapStone;
    } else if (type === "chaosGate") {
        items.secretMap = body.secretMap;
    } else if (type === "ghostShip") {

    } else if (type === "fieldBoss") {

    } else if (type === "secretMap") {

    } else if (type === "abyssDungeon") {

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