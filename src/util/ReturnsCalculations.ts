interface PoolPerformanceSnapshot {
  timestamp: number;
  block_number: number;
  pool_address: string;
  chain_id: number;
  inventory0: number;
  inventory1: number;
  total_supply: number;
}

interface TokenPerformanceSnapshot {
  timestamp: number;
  price: number;
}

export type PoolReturns = PoolPerformanceSnapshot[];
export type TokenReturns = TokenPerformanceSnapshot[];

export function calculateReturns(
  poolReturns: PoolReturns,
  token0Returns: TokenReturns,
  token1Returns: TokenReturns
) {
  const hasEmptyData =
    poolReturns.length === 0 ||
    token0Returns.length === 0 ||
    token1Returns.length === 0;
  if (hasEmptyData) {
    // TODO: fail more gracefully than this
    throw new Error('Inputs cannot be empty!');
  }

  // Copy to avoid mutating the actual data
  const poolReturnsCopy = [...poolReturns];

  // Used to prevent mismatched timestamps
  const [matchingPoolReturns, matchingToken0Returns, matchingToken1Returns] =
    intersectionOfReturns(poolReturnsCopy, token0Returns, token1Returns);
  // Whether the pool contains a total_supply that is null
  const containsNull = matchingPoolReturns.some((r) => r.total_supply === null);
  // If the pool contains a total_supply that is null, we want to start after the last null total_supply
  const initialIndex = containsNull
    ? poolReturnsCopy.length -
      poolReturnsCopy.reverse().findIndex((r) => r.total_supply === null)
    : 0;
  const initialSupply = matchingPoolReturns[initialIndex].total_supply;
  const initialP0 = matchingToken0Returns[initialIndex].price;
  const initialP1 = matchingToken1Returns[initialIndex].price;
  const initialPoolTVL =
    matchingPoolReturns[initialIndex].inventory0 * initialP0 +
    matchingPoolReturns[initialIndex].inventory1 * initialP1;
  const initialPricePerShare = initialPoolTVL / initialSupply;
  const initialSqrt = Math.sqrt(initialP0 * initialP1);

  const matching5050Portfolio = {
    amount0: (0.5 * initialPoolTVL) / initialP0,
    amount1: (0.5 * initialPoolTVL) / initialP1,
  };

  return matchingPoolReturns.slice(initialIndex).map((snapshot, i) => {
    const index = i + initialIndex;
    const p0 = matchingToken0Returns[index].price;
    const p1 = matchingToken1Returns[index].price;

    const pricePerShare =
      (snapshot.inventory0 * p0 + snapshot.inventory1 * p1) /
      snapshot.total_supply;
    const pricePerShare5050 =
      (matching5050Portfolio.amount0 * p0 +
        matching5050Portfolio.amount1 * p1) /
      initialSupply;
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

/**
 * Finds the intersection of the timestamps of the three arrays of returns.
 * @param poolReturns the pool returns
 * @param token0Returns the token0 returns
 * @param token1Returns the token1 returns
 * @returns an array of arrays, where each array contains the matching pool, token0, and token1 returns for a given timestamp
 */
function intersectionOfReturns(
  poolReturns: PoolReturns,
  token0Returns: TokenReturns,
  token1Returns: TokenReturns
): [PoolReturns, TokenReturns, TokenReturns] {
  const poolTimestamps = poolReturns.map((r) => r.timestamp);
  const token0Timestamps = token0Returns.map((r) => r.timestamp);
  const token1Timestamps = token1Returns.map((r) => r.timestamp);
  const timestamps = poolTimestamps
    .filter((t: number) => token0Timestamps.includes(t))
    .filter((t: number) => token1Timestamps.includes(t));
  return [
    poolReturns.filter((r) => timestamps.includes(r.timestamp)),
    token0Returns.filter((r) => timestamps.includes(r.timestamp)),
    token1Returns.filter((r) => timestamps.includes(r.timestamp)),
  ];
}
