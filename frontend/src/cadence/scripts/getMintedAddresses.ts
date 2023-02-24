import { FLOW_CONTRACTS } from "@/helpers/constants";

const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet";

export const getMintedAddresses = `
  import SeekEarlySupporters from ${FLOW_CONTRACTS[network].SeekEarlySupporters};

  pub fun main(address: Address): Bool {
      return SeekEarlySupporters.mintedAdresses.contains(address)
  }
`;
