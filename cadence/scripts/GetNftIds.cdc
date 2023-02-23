import MetadataViews from 0xf8d6e0586b0a20c7;
pub fun main(address: Address): [UInt64] {
    
  let account = getAccount(address)
  let collection = account
    .getCapability(/public/SeekEarlySupportersCollection)
    .borrow<&{MetadataViews.ResolverCollection}>()
    ?? panic("Could not borrow a reference to the collection")
  let IDs = collection.getIDs()
  return IDs;
}