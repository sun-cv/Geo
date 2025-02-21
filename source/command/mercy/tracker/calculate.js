import Shards from '../../../data/mercy/shards.json' with { type: 'json' }

function getMercyChance(shard, rarity, count) {
    const { base, start, increase } = Shards.mercy[shard][rarity];

    if (count < start) return base; // Before mercy starts, just return base chance

    return Math.min(100, base + (count - start) * increase); // Apply mercy increase
}


export { getMercyChance }