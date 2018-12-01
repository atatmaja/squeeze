

var guy1 = [{ start: '2018-12-02T16:00:00Z', end: '2018-12-02T18:00:00Z' },
{ start: '2018-12-02T20:00:00Z', end: '2018-12-02T21:00:00Z' } ];

var guy2;

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
        console.log(busy);
        if(busy[0] > lastFreeTime){
            const freeInterval = [lastFreeTime, busy[0]];
            lastFreeTime = busy[1];
            freeSpace.push(freeInterval);
        }
        if(ind === busySpace.length - 1 && busy[1] < 24){
            freeSpace.push([lastFreeTime, 24]);
        }
    });


    return freeSpace;
}



console.log(invertS(guy1));
//main


