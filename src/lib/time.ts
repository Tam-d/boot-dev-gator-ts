export function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    console.log(match);
    
    if(!match) {
        throw new Error("Unable to parse the given duration.");
    }

    const timeVal = parseInt(match[1]);
    const timeUnit = match[2];

    let timeInMilliseconds = 0;
    
    if(timeUnit === 's') {
        //seconds to milliseconds
        timeInMilliseconds = timeVal * 1000;
    }
    else if(timeUnit === 'm') {
        //minute to milliseconds
        timeInMilliseconds = timeVal * 60 * 1000;
    }
    else if(timeUnit === 'h') {
        //hour to milliseconds
        timeInMilliseconds = timeVal * 60 * 60 * 1000;
    }
    else {
        throw new Error(`Unable to parse time unit of "${timeUnit}".`);
    }
    console.log(timeInMilliseconds)
    return timeInMilliseconds;
}