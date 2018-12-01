const moment = require('moment')

//find all free spaces for a week's calendar
function jsonTraversal(schedule){
    let lastInd = 0;
    const results = {};
    //split up week schedules into dict of day schedules
    for(let i = 0; i < 7; i++){
        const date = moment().add(i, 'days').format('YYYY-MM-DD');
        let currentInd = lastInd;
        const resultsRaw = [];
        for(let j = lastInd; j < schedule.length; j++){
            if(schedule[j].start.substring(0, 10) === date){
                currentInd = j
                resultsRaw.push(schedule[j]);
            }
        }
        lastInd = currentInd;
        results[date] = invertS(resultsRaw);
    }
    return results;
}

function parseMapData(strData){
    var body =  JSON.parse(strData);
    var parsed = [];
    var s1 = body.results[0].geometry.location.lat.toString()
    var s2 = body.results[0].geometry.location.lng.toString()
    parsed.push(s1 + "," +  s2);
    parsed.push(body.results[0].name);

    return parsed;
}

module.exports = {
    paraseMapData
}

