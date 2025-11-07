const Replicator = require('./libs/replicator');
const fs = require('fs');
const path = require('path');

function remakeFolder(path) {
    fs.rmdirSync(path, { recursive: true, force: true });
    fs.mkdirSync(path);
}

function createReplicatorZero(safteyFactor) {
    return new Replicator({ 
        mutationRate: 0.05, 
        saftey: safteyFactor 
    });
}

function toggleLog(message, ...optionalParams) {
    const toggle = 1;
    if (toggle) {
        console.log(message, ...optionalParams)
    }
}

async function main() {

    // Clear old logs
    const logsDir = path.join(__dirname, 'logs');
    remakeFolder(logsDir);

    // Total epochs
    const NUM_EPOCH = 10;

    // Delay in printing epoch number
    const DRAMA_EFFECT = 100;

    // Max replicas (environment setting)
    const MAX_REPLICAS = 1000;

    // Environment saftey factor (1 - chance to randomly die in an epoch)
    const SAFTEY_FACTOR = 0.9; // 0.9 = 90% chance to survive epoch

    // Create initial replicator
    let replicatorZero = createReplicatorZero(SAFTEY_FACTOR);

    // Create a structure to hold the population
    const population = [];
    const populationSnapshots = []; // each epochs distribution
    population.push(replicatorZero);

    for (let i = 1; i <= NUM_EPOCH; i++) {

        toggleLog(`Epoch: #${i}`);

        /*
            forEach takes a snapshot of the array’s length at the start of the loop and only iterates over those elements.
            Any items you push during the iteration are ignored for that run.
            (if you use for(int i, ...) then it would infinitely loop since it rechecks)
        */

        // Only replicate if there is space in the environment
        population.forEach(replicator => {
            // First check if the replicator survived the epoch
            if (replicator.trySurviveEpoch()) {
                // If there is space, they can replicate
                if (population.length < MAX_REPLICAS) {
                    population.push(replicator.replicate());
                }
            } else {
                // If it doesn#t survive, remove it from the list
                population.splice(population.findIndex(r => r === replicator), 1);
                // console.log(replicator);
            }
        });

        // Snapshot population distribution
        populationSnapshots.push({ epoch: i, groups: countGroupings(population) });

        // Pause for dramatic effect
        await new Promise(r => setTimeout(r, DRAMA_EFFECT));
    }

    // Count numbers of different replicators (based on genome)
    /*
        Need a key-value pair (genmone, count)
        Go through each element:
            Key: replicator.genome
            Value: running total, starting at 0
    */
    let populationDistribution = countGroupings(population);

    // Total count
    let totalCount = populationDistribution.reduce((total, group) => total += group.count, 0);


    // Log file details
    const fileName = `replicators_${(new Date()).toISOString().replaceAll(':', '-').slice(0, 16)}.json`; // : dont work nice in windows so we need to change it
    const pathToLogFile = path.join(logsDir, fileName);
    let formattedLog = {
        date: fileName.split('_')[1],
        totalReplicators: totalCount,
        distictReplicators: populationDistribution.length,
        finalDistribution: populationDistribution,
        populationSnapshots: populationSnapshots.map(snapshot => ({ epoch: snapshot.epoch, groups: snapshot.groups.length, total: snapshot.groups.reduce((total, group) => total += group.count, 0), groupsDetails: snapshot.groups })),
    };
    fs.writeFileSync(pathToLogFile, JSON.stringify(formattedLog, null, 2));

    let { totalReplicators, distictReplicators } = formattedLog;
    toggleLog({ totalReplicators, distictReplicators });

}

function countGroupings(populationArr) {
    let groupingsMap = new Map();
    populationArr.forEach(e => {
        let currVal = groupingsMap.get(e.genome)
        groupingsMap.set(
            e.genome,
            isNaN(currVal) ? 1 : currVal + 1
        )
    })
    return Array.from(groupingsMap, ([key, value]) => ({ genome: key, count: value }))
}

main()
