const Replicator = require('./libs/replicator');
const fs = require('fs');
const path = require('path');

async function main() {

    // Empty logs folder
    const logsDir = path.join(__dirname, 'logs');
    fs.rmdirSync(logsDir, {recursive: true, force: true});
    fs.mkdirSync(logsDir);

    // Create initial replicator
    const replicatorZero = new Replicator('ATCGAATC', 0.1);

    // Create a structure to hold the population
    const population = [];
    const populationSnapshots = []; // each epochs distribution
    population.push(replicatorZero);

    // Epochs
    const NUM_EPOCH = 10;

    // Delay in printing epoch number
    const DRAMA_EFFECT = 100;

    for (let i = 1; i <= NUM_EPOCH; i++) {

        console.log(`Epoch: #${i}`);

        /*
            forEach takes a snapshot of the array’s length at the start of the loop and only iterates over those elements.
            Any items you push during the iteration are ignored for that run.
            (if you use for(int i, ...) then it would infinitely loop since it rechecks)
        */
        population.forEach(replicator => {
            population.push(replicator.replicate());
        });

        // Snapshot population distribution
        let currentSnapshotMap = new Map();
        population.forEach(rep => currentSnapshotMap.set(rep.genome, isNaN(currentSnapshotMap.get(rep.genome)) ? 1 : currentSnapshotMap.get(rep.genome) + 1));
        populationSnapshots.push(currentSnapshotMap);

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
    let populationDistribution = new Map();
    population.forEach(replicator => {
        // console.log(populationDistribution.get(replicator.genome));
        // console.log(isNaN(populationDistribution.get(replicator.genome)));
        populationDistribution.set(
            replicator.genome, 
            isNaN(populationDistribution.get(replicator.genome)) ? 
                1 
                : 
                populationDistribution.get(replicator.genome) + 1);
        // console.log(populationDistribution.get(replicator.genome));
    });

    // Total count
    let totalReplicators = (Array.from(populationDistribution.values()))
                            .reduce((a,b) => b + a);

    // Debug zone
    let testSnapshots = populationSnapshots.map(snapshot => Array.from(snapshot, ([key, value]) => ({genome: key, count: value})));
    //console.log(testSnapshots);
    

    // Log file details
    const fileName = `replicators_${(new Date()).toISOString().replaceAll(':','-').slice(0, 16)}.json`; // : dont work nice in windows so we need to change it
    const pathToLogFile = path.join(logsDir, fileName);
    let formattedLog = {
        date: fileName.split('_')[1],
        totalReplicators,
        distictReplicators: populationDistribution.size,
        finalDistribution: Array.from(populationDistribution, (entry) => ({ genome: entry[0], count: entry[1]})),
        populationSnapshots: populationSnapshots.map(snapshot => Array.from(snapshot, ([key, value]) => ({genome: key, count: value}))),
    };
    fs.writeFileSync(pathToLogFile, JSON.stringify(formattedLog, null, 2));
    console.log(formattedLog);
}

main()
