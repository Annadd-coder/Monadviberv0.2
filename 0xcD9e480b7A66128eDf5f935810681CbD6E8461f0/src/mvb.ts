import { BigInt } from "@graphprotocol/graph-ts";
import { NFTMinted } from "../generated/MVB/MVB";
import { Collection } from "../generated/schema";

export function handleNFTMinted(event: NFTMinted): void {
  // id коллекции приходит третьим параметром события
  let id  = event.params.collectionId.toI32();
  let key = id.toString();

  let col = Collection.load(key);
  if (col == null) {
    col = new Collection(key);
    col.maxSupply     = BigInt.fromI32(100);   // или из контракта
    col.currentSupply = BigInt.zero();
  }

  col.currentSupply = col.currentSupply.plus(BigInt.fromI32(1));
  col.save();
}