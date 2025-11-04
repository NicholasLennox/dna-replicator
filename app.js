let Replicator = require('./libs/replicator');


async function main() {

    // Create initial replicator
    const replicatorZero = new Replicator('ATCGAATC', 0.01);

    // Create a structure to hold the population
    const population = [];
    population.push(replicatorZero);

    // Epochs
    const NUM_EPOCH = 3;

    // Delay in printing epoch number
    const DRAMA_EFFECT = 1000;

    for (let i = 1; i <= NUM_EPOCH; i++) {

        console.log(`Population Epoch: #${i}`);

        /*
            forEach takes a snapshot of the array’s length at the start of the loop and only iterates over those elements.
            Any items you push during the iteration are ignored for that run.
            (if you use for(int i, ...) then it would infinitely loop since it rechecks)
        */
        population.forEach(replicator => {
            population.push(replicator.replicate());
        });

        // Pause for dramatic effect
        await new Promise(r => setTimeout(r, DRAMA_EFFECT));
    }

    console.log(population.map(r => r.genome));
}

main()
