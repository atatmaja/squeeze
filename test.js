

var guy1 = [{ start: '2018-12-02T16:00:00Z', end: '2018-12-02T18:00:00Z' },
{ start: '2018-12-02T20:00:00Z', end: '2018-12-02T21:00:00Z' } ];

var guy2 = [{ start: '2018-12-02T07:00:00Z', end: '2018-12-02T09:00:00Z' },
{ start: '2018-12-02T19:00:00Z', end: '2018-12-02T23:00:00Z' } ];

var i;
var j;
var guy1start;
var guy2start;
var guy1end;
var guy2end;

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

g1 = invertS(guy1);
g2 = invertS(guy2);
console.log(g1);
console.log(g2);
console.log(mergeS(g1, g2));

//main


