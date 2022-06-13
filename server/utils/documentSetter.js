let documentSetter = {};

documentSetter.set = async (id, body) => {
    let document = {};
    
    document.userId = id;
    document.character = body.character;
    document.year = body.year;
    document.month = body.month;
    document.stage = body.stage;
    document.items = body.items;
    
    return document;
};

module.exports = documentSetter;