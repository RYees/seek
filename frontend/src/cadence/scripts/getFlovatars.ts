import { FLOW_CONTRACTS } from "@/helpers/constants";

const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet";

export const getFlovatars = `
    import Flovatar from ${FLOW_CONTRACTS[network].Flovatar};

    pub fun main(address:Address) : [Flovatar.FlovatarData] {
      return Flovatar.getFlovatars(address: address)
    }
`;
