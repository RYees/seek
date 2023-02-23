import SeekEarlySupporters from 0xf8d6e0586b0a20c7
import NonFungibleToken from 0xf8d6e0586b0a20c7
import MetadataViews from 0xf8d6e0586b0a20c7
transaction(
) {

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
    log("Minted an NFT and stored it into the collection")
  } 

}
 