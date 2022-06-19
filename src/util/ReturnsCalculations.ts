import Big from "big.js";

interface PoolPerformanceSnapshot {
    timestamp: string; // TODO this should be a number like `TokenPerformanceSnapshot`, but Matt hasn't standardized the API yet
    block_number: number;
    pool_address: string;
    chain_id: number;
    inventory0: number;
    inventory1: number;
    total_supply: number;
}

interface TokenPerformanceSnapshot {
    timestamp: number,
    price: number,
}

export type PoolReturns = PoolPerformanceSnapshot[];
export type TokenReturns = TokenPerformanceSnapshot[];

export function calculateReturns(poolReturns: PoolReturns, token0Returns: TokenReturns, token1Returns: TokenReturns) {
    const hasEmptyData = poolReturns.length === 0 || token0Returns.length === 0 || token1Returns.length === 0;
    if (hasEmptyData) {
        // TODO: fail more gracefully than this
        throw new Error('Inputs cannot be empty!');
    }
    let initialIndex = 0;
    for (let i = 0; i < poolReturns.length; i++) {
        if (poolReturns[i].total_supply !== null) {
            initialIndex = i;
            break;
        }
    }

    const initialSupply = poolReturns[initialIndex].total_supply;
    const initialP0 = token0Returns[initialIndex].price;
    const initialP1 = token1Returns[initialIndex].price;
    const initialPoolTVL = (poolReturns[initialIndex].inventory0 * initialP0) + (poolReturns[initialIndex].inventory1 * initialP1);
    const initialPricePerShare = initialPoolTVL / initialSupply;
    const initialSqrt = Math.sqrt(initialP0 * initialP1);

    const matching5050Portfolio = {
        amount0: 0.5 * initialPoolTVL / initialP0,
        amount1: 0.5 * initialPoolTVL / initialP1,
    };

    return poolReturns.slice(initialIndex).map((snapshot, i) => {
        const p0 = token0Returns[i].price;
        const p1 = token1Returns[i].price;

        const pricePerShare = ((snapshot.inventory0 * p0) + (snapshot.inventory1 * p1)) / snapshot.total_supply;
        const pricePerShare5050 = ((matching5050Portfolio.amount0 * p0) + (matching5050Portfolio.amount1 * p1)) / initialSupply;

        return {
            pool: pricePerShare / initialPricePerShare,
            fifty_fifty: pricePerShare5050 / initialPricePerShare,
            sqrt: Math.sqrt(p0 * p1) / initialSqrt,
            token0: p0 / initialP0,
            token1: p1 / initialP1,
            timestamp: snapshot.timestamp,
        };
    });
}

// export function testCalculatePortfolioReturns() {
//     let poolReturnsExample: PoolReturns = POOL_RETURNS_EXAMPLE.map((snapshot) => {
//         return {
//             ...snapshot,
//             // inventory0: new Big(snapshot.inventory0),
//             // inventory1: new Big(snapshot.inventory1),
//             // total_supply: new Big(snapshot.total_supply),
//         };
//     })
//     console.log(calculateReturns(poolReturnsExample, TOKEN0_RETURNS_EXAMPLE, TOKEN1_RETURNS_EXAMPLE));
// }
