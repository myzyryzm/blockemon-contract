<!-- @format -->

# blockemon-contract

## Set Up

`yarn` : installs all the relevant node modules \
`yarn build` : creates the out/main.wasm file \
`yarn test` : runs the main.spec.ts file in assembly/\_\_tests\_\_

## NEAR

`near dev-deploy out/main.wasm` : deploys the contract

### View Methods

`near view $CONTRACT getAllBlockemon` : returns a list of all blockemon\
`near view $CONTRACT getBlockemonById '{"id": $POKEMON_ID}'` : gets a blockemon by id\
`near view $CONTRACT getUserBlockemon '{"owner": $OWNER_NAME}'` : gets all blockemon for a specific account

### Change Methods

`near call $CONTRACT createBlockemon '{"nickname": $POKEMON_NAME}' --account_id $YOUR_ACCOUNT` : creates a blockemon with the specified name and assigns the owner of the blockemon to $YOUR_ACCOUNT\
`near call $CONTRACT deleteBlockemon '{"id": $POKEMON_ID}' --account_id $YOUR_ACCOUNT` : deletes a blockemon with the specified id\
`near call $CONTRACT transferBlockemon '{"newOwner": $OWNER_ACCOUNT, "id": $POKEMON_ID}' --account_id $YOUR_ACCOUNT` : transfers a blockemon from $YOUR_ACCOUNT to $OWNER_ACCOUNT\
