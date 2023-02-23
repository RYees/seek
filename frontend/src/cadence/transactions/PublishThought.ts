import { FLOW_CONTRACTS } from "@/helpers/constants";

const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet";

export const PublishThought = `
    import MetadataViews from ${FLOW_CONTRACTS[network].MetadataViews};
    import FindThoughts from ${FLOW_CONTRACTS[network].FindThoughts};
    import FINDNFTCatalog from ${FLOW_CONTRACTS[network].FINDNFTCatalog};
    import FindViews from ${FLOW_CONTRACTS[network].FindViews};
    import FindUtils from ${FLOW_CONTRACTS[network].FindUtils};

    transaction(header: String , body: String , tags: [String], mediaHash: String?, mediaType: String?, quoteNFTOwner: Address?, quoteNFTType: String?, quoteNFTId: UInt64?, quoteCreator: Address?, quoteId: UInt64?) {

        let collection : &FindThoughts.Collection
    
        prepare(account: AuthAccount) {
            let thoughtsCap= account.getCapability<&{FindThoughts.CollectionPublic}>(FindThoughts.CollectionPublicPath)
            if !thoughtsCap.check() {
                account.save(<- FindThoughts.createEmptyCollection(), to: FindThoughts.CollectionStoragePath)
                account.link<&FindThoughts.Collection{FindThoughts.CollectionPublic , MetadataViews.ResolverCollection}>(
                    FindThoughts.CollectionPublicPath,
                    target: FindThoughts.CollectionStoragePath
                )
            }
            self.collection=account.borrow<&FindThoughts.Collection>(from: FindThoughts.CollectionStoragePath) ?? panic("Cannot borrow thoughts reference from path")
        }
    
        execute {
    
            var media : MetadataViews.Media? = nil 
            if mediaHash != nil {
                var file : {MetadataViews.File}? = nil  
                if FindUtils.hasPrefix(mediaHash!, prefix: "ipfs://") {
                    file = MetadataViews.IPFSFile(cid: mediaHash!.slice(from: "ipfs://".length , upTo: mediaHash!.length), path: nil) 
                } else {
                    file = MetadataViews.HTTPFile(url: mediaHash!) 
                }
                media = MetadataViews.Media(file: file!, mediaType: mediaType!)
            }
    
            var nftPointer : FindViews.ViewReadPointer? = nil 
            if quoteNFTOwner != nil {
                    let path = FINDNFTCatalog.getCollectionDataForType(nftTypeIdentifier: quoteNFTType!)?.publicPath ?? panic("This nft type is not supported by NFT Catalog. Type : ".concat(quoteNFTType!))
                    let cap = getAccount(quoteNFTOwner!).getCapability<&{MetadataViews.ResolverCollection}>(path)
                    nftPointer = FindViews.ViewReadPointer(cap: cap, id: quoteNFTId!)
            }
    
            var quote : FindThoughts.ThoughtPointer? = nil 
            if quoteCreator != nil {
                quote = FindThoughts.ThoughtPointer(creator: quoteCreator!, id: quoteId!)
            }
    
            self.collection.publish(header: header, body: body, tags: tags, media: media, nftPointer: nftPointer, quote: quote)
        }
    }
`;
