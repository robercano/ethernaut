# Double Entry Point

A very interesting demo on the Forta alert bots. We are given a system with a CrytoVault that manages an underlying, represented by the DoubleEntryPoint token. We also have a prior version of the DEP token, the LegacyToken, which is not used anymore. However this legacy token delegates transfers to the new token, so every time we try to transfer the old token, the new is taking care of this transfer and does it by transferring DEP tokens to the recipient.

The CryptoVault has also a refunding functionality (`sweepToken`) which allows to transfer any tokens sent by mistake to the vault, to the address configured in the `sweptTokensRecipient` variable. The `sweepToken` function first checks that the token to be swept is not the actual underlying being used in the vault.

The vault also has 100 DEP tokens and 100 Legacy tokens in it.

By following the logic we can clearly see what happens if we try to sweep the legacy tokens from the vaul:

-   The vault checks if the token to be swept is the underlying token, which is not
-   It then calls the `transfer` function of the legacy token. The legacy token checks if there is a delegate for the transfer, and there is one: the DEP token. It then delegates the transfer to the DEP token
-   The DEP token checks if the caller is the Legacy token, which it is, and does no further checks to ensure the validity of the transfer
-   Finally, it transfers 100 DEP tokens to the `sweptTokensRecipient`, which happens to be our address, thus emptying the vault

Our work here is to generate a Forta Bot that prevents this case. For that we create a contract that will have the Forta contract address and the Vault address, and will implement the `IFortaBot` interface. The `handleTransaction` function will check if the transaction is a call to `delegateTransfer` on the DEP token, with our address as the `to` address, and an amount of 100 ETH. If that is the case it will raise an alert on the Forta contract by calling the `raiseAlert` function with out address as the parameter.

This will make the `delegateTransfer` call fail thanks to the `fortaNotify` modifier, and the transfer will not be executed.

Network: Rinkeby
Level Instance: 0x9F8AEa7775E493E62CFca558dD283E8Ba642aA75
Solution Instance: 0x20a2CD75bD45e9Cce88b95940486457ad5D996aA
Solver: 0xc892cfd3e75Cf428BDD25576e9a42D515697B2C7
