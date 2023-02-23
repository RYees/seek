import { FLOW_CONTRACTS } from "@/helpers/constants";

const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet";

export const getFlovatar = `
    import FungibleToken from ${FLOW_CONTRACTS[network].FungibleToken};
    import NonFungibleToken from ${FLOW_CONTRACTS[network].NonFungibleToken};
    import FlowToken from ${FLOW_CONTRACTS[network].FlowToken};
    import Flovatar from ${FLOW_CONTRACTS[network].Flovatar};
    import FlovatarComponent from ${FLOW_CONTRACTS[network].FlovatarComponent};
    import FlovatarComponentTemplate from ${FLOW_CONTRACTS[network].FlovatarComponentTemplate};
    import FlovatarPack from ${FLOW_CONTRACTS[network].FlovatarPack};
    import FlovatarMarketplace from ${FLOW_CONTRACTS[network].FlovatarMarketplace};

    // This script returns the available webshots
    pub fun main(address:Address, flovatarId: UInt64) : Flovatar.FlovatarData? {

        return Flovatar.getFlovatar(address: address, flovatarId: flovatarId)

    }
`;
