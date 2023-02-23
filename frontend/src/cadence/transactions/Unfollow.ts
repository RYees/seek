import { FLOW_CONTRACTS } from "@/helpers/constants";

const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet";

export const Unfollow = `
    import FIND from ${FLOW_CONTRACTS[network].FIND};
    import Profile from ${FLOW_CONTRACTS[network].Profile};

    // array of [User in string (find name or address)]
    transaction(unfollows:[String]) {

        let profile : &Profile.User

        prepare(account: AuthAccount) {

            self.profile =account.borrow<&Profile.User>(from:Profile.storagePath) ?? panic("Cannot borrow reference to profile")

        }

        execute{
            for key in unfollows {
                let user = FIND.resolve(key) ?? panic(key.concat(" cannot be resolved. It is either an invalid .find name or address"))
                self.profile.unfollow(user)
            }
        }
    }
`;
