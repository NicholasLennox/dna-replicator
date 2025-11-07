# DNA Replicator simulator

For fun after I saw a simulation in a [Veritasium video](https://www.youtube.com/watch?v=XX7PdJIGiCw&t=1494s).

## Replicator

### 🧩 What a replicator *is*

At this level, a **replicator** is essentially a **unit of life** (or pre-life).
It doesn’t need to be a cell or organism yet — just *something that carries information and can copy itself*.
So in the simulation, each replicator is one **individual** entity with its own **genome**.

### 🧬 Each replicator’s core property

| Property   | Description                                                                 |
| ---------- | --------------------------------------------------------------------------- |
| **Genome** | The sequence (e.g. `"ATCG..."`) that defines what it is and how it behaves. |

That's the one essential thing every replicator needs. Everything else builds on that.

### ⚙️ Additional useful properties for simulation

You can add more attributes to make your world richer or more lifelike:

| Property                    | Description                                                                     |
| --------------------------- | ------------------------------------------------------------------------------- |
| **Energy / Resources**      | How much fuel it has to replicate. Each replication might cost energy.          |
| **Replication rate**        | How quickly it can replicate — maybe depends on genome length or pattern.       |
| **Mutation rate**           | Could vary per replicator (e.g. some are more “stable,” others mutate more).    |
| **Age / lifespan**          | Adds turnover — replicators die after some time.                                |
| **Fitness**                 | A computed score showing how likely it is to survive or replicate successfully. |
| **Position (x, y)**         | If you add spatial interaction (foraging, collisions, diffusion).               |
| **Lineage / generation ID** | For tracking ancestry or diversity in evolution.                                |
| **Error tolerance**         | How much mutation it can handle before becoming non-functional.                 |

### 🧠 Conceptual model

At its core:

> A replicator = information + rules for copying + access to resources.

Everything else — survival, mutation, selection — emerges from how those rules interact.

## 🧬 Ways a genome can change

1. **Substitution** – change one nucleotide (what you’re already doing).
   `"ATCG"` → `"ATTG"`

2. **Insertion** – add a random base somewhere.
   `"ATCG"` → `"ATACG"`

3. **Deletion** – remove one base.
   `"ATCG"` → `"ACG"`

4. **Duplication** – copy a whole section.
   `"ATCG"` → `"ATCGCG"`

Each of these increases or decreases the length.

## TODOs

- Replicator death
- Replicator birth rate and chance
- Environment saftey factor influencing birth rates and chance to randomly die
