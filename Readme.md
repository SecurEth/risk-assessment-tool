# Risk Assessment Tool

This tool helps you identify risks associated with every method in a smart contract.
Use this to adequatly test critical parts of your system.

# Installation

`npm install solidity-risk-assess -g`

# Usage

Just intall it with npm and run
`solidity-risk-assess <solidity-files>`.

```bash
>  node ./assess.js sample.sol
File: sample.sol
.----------------------------------------------------------------------------------------------.
|                                        SampleContract                                        |
|----------------------------------------------------------------------------------------------|
|   Method Name   | isPublic | canModifyState | hasExternalCalls | isHandlingAssets |   Risk   |
|-----------------|----------|----------------|------------------|------------------|----------|
| SampleContract  | false    | true           | false            | false            | Safe     |
| isRich          | false    | false          | false            | false            | Safe     |
| areMoniesNeeded | true     | false          | false            | false            | Safe     |
| upvote          | true     | true           | false            | false            | Medium   |
| acceptMonies    | true     | true           | true             | true             | Critical |
'----------------------------------------------------------------------------------------------'
```

# Limitations

The code needs to be solidified in order to assess external calls.
