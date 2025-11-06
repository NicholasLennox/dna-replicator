/*
    At its simplest, a replicator is any entity that can make copies of itself.

    The core thing it’s replicating is information- a pattern that defines what it is.
    In biological terms, that pattern is stored in nucleotides (A, T, C, G).

    A genome is the complete sequence of nucleotides (A, T, C, G) that defines an organism (or a replicator).
    Each nucleotide is like one letter in a long instruction manual.
*/
class Replicator {
    /**
     * @param {string} genome
     * @param { number } mutationRate
     */
    constructor(genome, mutationRate) {
        /** @type { string } */
        this.genome = genome; // String of genes
        /** @type { number } */
        this.mutationRate = mutationRate; // Probability of mutation during replication
    }

    // Retruns new replicator instance
    replicate() {
        // Mutation check
        if (Math.random() < this.mutationRate) {
            const newGenmone = this._mutateGene();
            return new Replicator(newGenmone, this.mutationRate);
        } else {
            return new Replicator(this.genome, this.mutationRate);
        }
    }

    // Private, on chance when replicating
    // Does not change current instances genome, just what the copy will be made with (simulates on replication mutation)
    _mutateGene() {
        // Random index to mutate
        const indexToMutate = Math.round(Math.random() * this.genome.length);
        // Random letter to change to
        const newLetter = 'ATCG'[Math.round(Math.random()*3)]
        // Make the change
        let childGenome = replaceAt(this.genome, indexToMutate, newLetter);
        // console.log(`Parent genome: ${this.genome}, Child genome: ${childGenome}`);

        return childGenome;
    }
}

function replaceAt(word, i, replace) {
    return word.slice(0,i) + replace + word.slice(i+1,word.length);
}

module.exports = Replicator;