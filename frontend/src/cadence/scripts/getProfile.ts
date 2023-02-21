import { FLOW_FIND_CONTRACTS } from "@/helpers/constants";

const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet";

export const getProfile = `
    import FIND from ${FLOW_FIND_CONTRACTS[network].FIND};
    import Profile from ${FLOW_FIND_CONTRACTS[network].Profile};

    pub fun main(address: Address) :  Profile.UserReport? {
        let account = getAccount(address)
        if account.balance == 0.0 {
            return nil
        }

        var profileReport = account
            .getCapability<&{Profile.Public}>(Profile.publicPath)
            .borrow()?.asReport()

        if profileReport != nil && profileReport!.findName != FIND.reverseLookup(address) {
            profileReport = Profile.UserReport(
                findName: "",
                address: profileReport!.address,
                name: profileReport!.name,
                gender: profileReport!.gender,
                description: profileReport!.description,
                tags: profileReport!.tags,
                avatar: profileReport!.avatar,
                links: profileReport!.links,
                wallets: profileReport!.wallets, 
                following: profileReport!.following,
                followers: profileReport!.followers,
                allowStoringFollowers: profileReport!.allowStoringFollowers,
                createdAt: profileReport!.createdAt
            )
        }

        return profileReport
    }
`;
