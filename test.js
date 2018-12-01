

var guy1 = [{ start: '2018-12-02T16:00:00Z', end: '2018-12-02T18:00:00Z' },
{ start: '2018-12-02T20:00:00Z', end: '2018-12-02T21:00:00Z' } ];

var guy2;

var i;
var j;
var guy1start;
var guy2start;
var guy1end;
var guy2end;


function invertS(guy)
{
    var i;
    var guyStart;
    var guyEnd;
    var busySpace = [];
    var freeSpace = [];

    for(i=0;i<guy.length;i++)
    {
        guyStart = parseInt(guy[i].start.substring(11,14));
        guyEnd = parseInt(guy[i].end.substring(11,14));

        busySpace.push([guyStart, guyEnd]);

        /*
        if(guyEnd > 8 && !freeSpace)
        {
            if(guyStart > 8)
            {
                freeSpace.push(8,guyStart);  
            }
            freeSpace.push([guyEnd,0]);
        }

        else if(freeSpace)
        {
            if(guyStart > 8 && i === guy.length-1)
            {

                freeSpace[freeSpace.length-1][1] = guyStart;
                if(guyEnd >  8)
                {
                    freeSpace.push([guyEnd,24]);
                }
            }
            

            else if(guyStart >8 && guyEnd >8)   
            {
                freeSpace[freeSpace.length-1][1] = guyStart;
                freeSpace.push([guyEnd,0]);
            }
        }
        */
    }

    let lastFreeTime = 8;

    for(busy in busySpace){
        if(busy[0] > lastFreeTime && busy[1] < 24){
            console.log(busy[0]);
            const freeInterval = [lastFreeTime, busy[0]];
            lastFreeTime = busy[1];
            freeSpace.push(freeInterval);
        }
    }

    return freeSpace;
}



console.log(invertS(guy1));
//main


