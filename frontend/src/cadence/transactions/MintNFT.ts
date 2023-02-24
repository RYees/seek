import { FLOW_CONTRACTS } from "@/helpers/constants";

const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet";

export const MintNFT = `
  import SeekEarlySupporters from ${FLOW_CONTRACTS[network].SeekEarlySupporters};
  import NonFungibleToken from ${FLOW_CONTRACTS[network].NonFungibleToken};
  import MetadataViews from ${FLOW_CONTRACTS[network].MetadataViews};

  transaction() {
      let signer: AuthAccount
    
      prepare(signer: AuthAccount) {
         self.signer = signer
    
          if signer.borrow<&SeekEarlySupporters.Collection>(from: SeekEarlySupporters.CollectionStoragePath) != nil {
          return
        }
        // Create a new empty collection
        let collection <- SeekEarlySupporters.createEmptyCollection()
        // save it to the account
        signer.save(<-collection, to: SeekEarlySupporters.CollectionStoragePath)
        // create a public capability for the collection
        signer.link<&{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
          SeekEarlySupporters.CollectionPublicPath,
          target: SeekEarlySupporters.CollectionStoragePath
        )
    
      }
      execute {
        let newNFT <- SeekEarlySupporters.mintNFT(address: self.signer.address)
    
        let receiverRef = self.signer.getCapability(SeekEarlySupporters.CollectionPublicPath)
         .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow receiver reference")
    
        receiverRef.deposit(token: <-newNFT)
      } 
    }
`;
