# Samaritan

This challenge tests your knowledge about Solidity error, their encoding, and how they are propagated through the call stack.

In particular, the Good Samaritan contract will give you 10 coins through the Wallet contract every time you request a donation. There is a piece of code in the Wallet that checks if there are enough funds to give the donation. If there is not enough, then it raises a `NotEnoughBalance()` error that is catched by the `GoodSamaritan` contract. In that case the Good Samaritan sends the remaining coins to the caller.

However, on every succesfull donation the Wallet contract tries to notify the caller if the caller happens to be a contract. What would happen if we took advantage of this notification to cause a revert in the Wallet contract?

We create a contract that implements the `notify` function that will be called by the `Wallet` contract. In the function we check if the donation is the standard one (10 coins) or if it is bigger than that. In case it is the standard donation, we revert using the `NotEnoughBalance()` error. This causes the error to propagate all the way back to the `GoodSamaritan` contract, which will think the error comes from the `Wallet` contract and will send the remaining coins to the caller. In this second call our `notify` function detects it is a bigger donation and does not revert, thus allowing the `Wallet` contract to send all the funds back to our solution contract.

Profit!

# Instance

Network: Rinkeby
Level Instance: 0x53f17D22dCEb1eaD8d2A947d3278CaD97e65A07F
Solution Instance: 0xc90Aee6Eda58f7cc2268a16CAE4450ECce184dd7
Solver: 0xc892cfd3e75Cf428BDD25576e9a42D515697B2C7
