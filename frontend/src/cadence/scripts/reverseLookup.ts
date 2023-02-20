import { FLOW_FIND_CONTRACTS } from "@/helpers/constants";

const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet";

export const reverseLookup = `
    import FIND from ${FLOW_FIND_CONTRACTS[network].FIND};

    pub fun main(input: Address): String? {
        return FIND.reverseLookup(input)
    }
`;
