const moment = require("moment");

//find all free spaces for a week's calendar
function processSchedule(schedule){
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

//find free spaces from a day's worth of busy spaces
function invertS(guy)
{
    var i;
    var guyStart;
    var guyEnd;
    var busySpace = [];
    var freeSpace = [];

    //represent busy spaces in 2d array format
    for(i=0;i<guy.length;i++)
    {
        guyStart = parseInt(guy[i].start.substring(11,14));
        guyEnd = parseInt(guy[i].end.substring(11,14));

        busySpace.push([guyStart, guyEnd]);
    }

    let lastFreeTime = 8;

    //find free spaces in between busy ones
    busySpace.forEach(function(busy, ind){
        if(busy[0] > lastFreeTime){
            const freeInterval = [lastFreeTime, busy[0]];
            freeSpace.push(freeInterval);
        }
        lastFreeTime = busy[1];
        if(ind === busySpace.length - 1 && busy[1] < 24){
            freeSpace.push([lastFreeTime, 24]);
        }
    });

    if(busySpace.length === 0){
        freeSpace.push([lastFreeTime, 24]);
    }

    return freeSpace;
}

function mergeS(guy1, guy2){
    const commonFrees = [];
    for(let i=0; i<guy1.length; i++)
    {
        for(let j=0; j<guy2.length; j++)
        {
           const latestStart = guy1[i][0] > guy2[j][0] ? guy1[i][0] : guy2[j][0];
           const earliestEnd = guy1[i][1] < guy2[j][1] ? guy1[i][1] : guy2[j][1];
           if(earliestEnd > latestStart){
                commonFrees.push([latestStart, earliestEnd]);
           }
        }
    }
    return commonFrees
}

module.exports = {
    invertS: invertS,
    mergeS: mergeS,
    processSchedule
}

