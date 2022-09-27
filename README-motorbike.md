# Motorbike

This level presents us with a proxy pattern in which the Motorbike proxies all calls to an Engine contract. In this pattern the Motorbike contract storage is used while only the Engine contract implementation is used. This is a very common pattern in smart contracts.

You also have the ability of upgrading the Engine contract implementation. This is done by calling the `upgradeToAndCall` function with the address of the new Engine contract and a function to be called encoded in the second parameter `data`.

However this kind of functionality is typically implemented in the proxy itself (in this case the `Motorbike` contract). By doing it in the implementation contract allows for some fiddling around.

The `Motorbike` contract expects the owner to call `upgradeToAndCall` through the `Motorbike` proxy, thus correctly checking that the caller is the upgrader and then forwarding the call to the `Engine` implementation. Remember that the storage being used all the time is the storage for `Motorbike`.

What would happen if we directly called `upgradeToAndCall` on the `Engine` contract? Well, in that case, because the storage of the `Engine` contract is never used or initialized, it would have address `0x000000000000000000000000000000000000000` as the upgrader, and we would not be allowed to call `upgradeToAndCall`.

But what if we would initialize the `Engine` contract directly? By calling `initialize` in the `Engine` contract we would set the upgrader to the address that called `initialize`, which would be our address. After that we are able to directly call `upgradeToAndCall` on the `Engine` contract and upgrade the implementation.

And what kind of implementation we could use? Well, we could upgrade to a contract that self destructs upon calling `initialize()` on it, for example. Because the `Engine` contract delegates the call to the new implementation, it would mean that `Engine` itself would be calling self destruct, and thus destroying itself. Any further calls to the `Engine` contract would fail, including those proxied from the `Motorbike` contract.

In order to do this we need the solution contract:

```
contract MotorbikeSolution {
    function initialize() external {
        selfdestruct(msg.sender);
    }
}
```

and to call `upgradeToAndCall` with the correct `data` parameter so it calls `initialize` in the new contract:

```
upgradeToAndCall(solutionAddress, "0x8129fc1c")
```

And voilá! The `Engine` contract is destroyed and the `Motorbike` is disabled.

# Instance

Network: Rinkeby
Level Instance: 0x607F987808dB1223Ea4255dc2a4658B5b9D4fe3A
Solution Instance: 0x382f9f5185cdA4F8d9597E3e581b3197496885d0
Solver: 0xc892cfd3e75Cf428BDD25576e9a42D515697B2C7
