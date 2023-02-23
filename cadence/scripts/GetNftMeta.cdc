import MetadataViews from 0xf8d6e0586b0a20c7;

pub fun main(address: Address): NFTResult {
  
  let account = getAccount(address)

  let collection = account
      .getCapability(/public/SeekEarlySupportersCollection)
      .borrow<&{MetadataViews.ResolverCollection}>()
      ?? panic("Could not borrow a reference to the collection")

  let nft = collection.borrowViewResolver(id: collection.getIDs()[0])

  var data = NFTResult()

  // Get the basic display information for this NFT
  if let view = nft.resolveView(Type<MetadataViews.Display>()) {
    let display = view as! MetadataViews.Display

    data.name = display.name
    data.description = display.description
    data.thumbnail = display.thumbnail.uri()
  }

  // The owner is stored directly on the NFT object
  let owner: Address = nft.owner!.address

  data.owner = owner

  return data
}

pub struct NFTResult {
  pub(set) var name: String
  pub(set) var description: String
  pub(set) var thumbnail: String
  pub(set) var owner: Address
  pub(set) var type: String

  init() {
    self.name = ""
    self.description = ""
    self.thumbnail = ""
    self.owner = 0x0
    self.type = ""
  }
}