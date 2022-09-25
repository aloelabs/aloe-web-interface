import axios from 'axios';

export function makeEtherscanRequest(
  fromBlock: number,
  address: string,
  topics: (string | null)[],
  shouldMatchAll: boolean,
  subdomain = 'api',
  pageLength = 1000,
  page?: number,
  toBlock?: number
) {
  let query =
    `https://${subdomain}.etherscan.io/api?module=logs&action=getLogs`.concat(
      `&fromBlock=${fromBlock.toFixed(0)}`,
      toBlock ? `&toBlock=${toBlock.toFixed(0)}` : '&toBlock=latest',
      `&address=${address}`
    );

  for (let i = 0; i < topics.length; i += 1) {
    if (topics[i] === null) continue;
    query += `&topic${i}=${topics[i]}`;

    if (i === topics.length - 1) break;
    query += `&topic${i}_${i + 1}_opr=${shouldMatchAll ? 'and' : 'or'}`;
  }

  if (page) query += `&page=${page}`;
  query = query.concat(
    `&offset=${pageLength}`,
    `&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`
  );

  return axios.get(query);
}
