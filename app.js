const Replicator = require('./libs/replicator');
const fs = require('fs');
const path = require('path');

function remakeFolder(path) {
    fs.rmdirSync(path, { recursive: true, force: true });
    fs.mkdirSync(path);
}

function createReplicatorZero() {
    return new Replicator('ATCGAATC', 0.05);
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

    // Create initial replicator
    let replicatorZero = createReplicatorZero();

    // Create a structure to hold the population
    const population = [];
    const populationSnapshots = []; // each epochs distribution
    population.push(replicatorZero);

    // Epochs
    const NUM_EPOCH = 10;

    // Delay in printing epoch number
    const DRAMA_EFFECT = 100;

    for (let i = 1; i <= NUM_EPOCH; i++) {

        toggleLog(`Epoch: #${i}`);

        /*
            forEach takes a snapshot of the array’s length at the start of the loop and only iterates over those elements.
            Any items you push during the iteration are ignored for that run.
            (if you use for(int i, ...) then it would infinitely loop since it rechecks)
        */
        population.forEach(replicator => {
            population.push(replicator.replicate());
        });

        // Snapshot population distribution
        populationSnapshots.push({epoch: i, groups: countGroupings(population)});

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
    let totalCount = (Array.from(populationDistribution.values()))
        .reduce((a, b) => b + a);


    // Log file details
    const fileName = `replicators_${(new Date()).toISOString().replaceAll(':', '-').slice(0, 16)}.json`; // : dont work nice in windows so we need to change it
    const pathToLogFile = path.join(logsDir, fileName);
    let formattedLog = {
        date: fileName.split('_')[1],
        totalReplicators: totalCount,
        distictReplicators: populationDistribution.size,
        finalDistribution: Array.from(populationDistribution, (entry) => ({ genome: entry[0], count: entry[1] })),
        populationSnapshots: populationSnapshots.map(snapshot => Array.from(snapshot.groups, ([key, value]) => ({ genome: key, count: value, epoch: snapshot.epoch }))),
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
    return groupingsMap;
}

main()
