pragma solidity ^0.4.18;

import "node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";


contract Sample {
  using SafeMath for uint256;

  // address where funds are store
  address public wallet;

  // amount of raised money in wei
  uint256 public weiRaised;

  // number of upvotes
  uint256 public upvoteCount;

  function Sample(address _wallet) public {
    require(_wallet != address(0));
    wallet = _wallet;
  }

  // internal method with no risky things
  function isRich() internal view returns (bool) {
    return weiRaised >= 1000000000000000000;
  }

  // publically accessible method with no risky things
  function areMoniesNeeded() public view returns (bool) {
    return !isRich();
  }

  // publically accessible method with some risky things
  function upvote() public {
    // update state
    upvoteCount = weiRaised.add(1);
  }

  // publically accessible method with lots of risky things
  function acceptMonies(address beneficiary) public payable {
    require(beneficiary != address(0));
    require(!isRich());

    // update state
    weiRaised = weiRaised.add(msg.value);

    // make external call
    wallet.transfer(msg.value);
  }

}
