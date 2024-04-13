To fix the issue, we can have a check in the `burn` function to prevent burning locked tokens using `require`. 

Here's is how we can achieve it:

```
function burn(uint256 amount) external {
    require(_lockedBalances[msg.sender] == 0, "Cannot burn locked tokens");
    _burn(msg.sender, amount);
}
```

1.  Document the debugging steps and the solution you implemented:

    -   Debugging Steps:

        -  As it was mentioned itself in the problem statement that `Users are able to burn tokens even if tokens are locked`, so just looked into the function and found that we can have a check around the same.

    -   Solution Implemented:

        -   Added a check in the `burn` function to prevent burning locked tokens.
        -   Updated the unit test to verify that burning locked tokens.