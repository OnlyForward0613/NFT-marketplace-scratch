/* test/sample-test.js */
describe("NFTMarket", function() {
  it("Should create and execute market sales", async function() {
    /* deploy the marketplace */
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
    const nftMarketplace = await NFTMarketplace.deploy()
    await nftMarketplace.deployed()

    let listPrice = await nftMarketplace.getListPrice()
    listPrice = listPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* create two tokens */
    await nftMarketplace.createToken("https://ipfs.io/ipfs/QmcCC9D3Kb4onJHCLUnjVNpZgyn33tVK98gwSYN4p13BeG", auctionPrice, { value: listPrice })
    await nftMarketplace.createToken("https://ipfs.io/ipfs/Qma5EaAwJgEtDaSPapTbAMe6tepnjnciFg5irezVaGT3NK", auctionPrice, { value: listPrice })

    const [_, buyerAddress] = await ethers.getSigners()

    /* execute sale of token to another user */
    await nftMarketplace.connect(buyerAddress).executeSale(1, { value: auctionPrice })

    /* resell a token */
    // await nftMarketplace.connect(buyerAddress).resellToken(1, auctionPrice, { value: listPrice })

    /* query for and return the unsold items */
    items = await nftMarketplace.getAllNFTs()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nftMarketplace.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items: ', items)
  })
})