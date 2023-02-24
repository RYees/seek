import { FLOW_CONTRACTS } from "@/helpers/constants";

const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet";

export const getTotalSupply = `
    import SeekEarlySupporters from ${FLOW_CONTRACTS[network].SeekEarlySupporters};

    pub fun main(): UInt64 {
        return SeekEarlySupporters.totalSupply;
    }
`;
