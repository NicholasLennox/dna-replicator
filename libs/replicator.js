/*
    At its simplest, a replicator is any entity that can make copies of itself.

    The core thing it’s replicating is information- a pattern that defines what it is.
    In biological terms, that pattern is stored in nucleotides (A, T, C, G).

    A genome is the complete sequence of nucleotides (A, T, C, G) that defines an organism (or a replicator).
    Each nucleotide is like one letter in a long instruction manual.
*/
class Replicator {
    constructor(genome, mutationRate) {
        this.genome = genome; // An array of genes
        this.mutationRate = mutationRate; // Probability of mutation during replication
    }

    // Retruns new replicator instance
    replicate() {
        return new Replicator(this.genome,this.mutationRate);
    }

    // Private, on chance when replicating
    _mutateGene() {

    }
}

module.exports = Replicator;