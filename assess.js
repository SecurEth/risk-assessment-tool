const _              = require('lodash')
const SolidityParser = require('solidity-parser')
const AsciiTable     = require('ascii-table')


function main() {

  const contractFile = getFileFromArgs()
  const rootNode     = SolidityParser.parseFile(contractFile)

  getContracts(rootNode).forEach((node) => {
    const riskMatrix = assessContract(node)
    printTable(riskMatrix, node.name)
  })

}


function getFileFromArgs() {

  var args = process.argv.slice(2);

  if ( args.length != 1 ) {
    console.log('Not enough arguments');
    return;
  }

  const file = process.argv[2]
  console.log('File:', file)

  return file

}



function assessContract(node) {

  const contractName = node.name

  const methods = getMethods(node)

  const riskMatrix = methods.map((methodNode) => {
    return {
     methodName       : methodNode.name,
     isPublic         : isPublicMethod(methodNode, contractName),
     canModifyState   : canModifyState(methodNode),
     hasExternalCalls : hasExternalCalls(methodNode),
     isHandlingAssets : isHandlingAssets(methodNode),
   }
  })

  return riskMatrix

}



function isPublicMethod(node, contractName) {
  return (
    node.name !== contractName &&
    node.modifiers.some(m => m.name === 'public')
  )
}



function canModifyState(node) {
  return node.modifiers.every(m => (
    m.name !== 'view' &&
    m.name !== 'pure' &&
    m.name !== 'constant'
  ))
}



function hasExternalCalls(node) {
  return isCallingTransfer(node)
}



function isHandlingAssets(node) {
  return isCallingTransfer(node)
}



function isCallingTransfer(node) {

  if (!node) {
    return
  }

  let nodeBody = node.body
  if (!Array.isArray(nodeBody)) {
    nodeBody = [nodeBody]
  }

  return (
    (
      node.type === 'ExpressionStatement' &&
      _.get(node, 'expression.callee.property.name') === 'transfer'
    )
    ||
    nodeBody.some(n => isCallingTransfer(n))
  )
}



function printTable(matrix, contractName) {

  const table = new AsciiTable(contractName)

  table.setHeading('Method Name', 'isPublic', 'canModifyState', 'hasExternalCalls', 'isHandlingAssets', 'Risk')

  matrix.forEach((m) => {
    table.addRow(m.methodName, m.isPublic, m.canModifyState, m.hasExternalCalls, m.isHandlingAssets, getRisk(m))
  })

  console.log(table.toString())

}



function getRisk({ isPublic, canModifyState, hasExternalCalls, isHandlingAssets }) {


  const severity = hasExternalCalls + canModifyState + isHandlingAssets

  const likelihood = isPublic * 3

  const risk = likelihood * severity

  if (risk === 9) {
    return 'Critical'
  }
  else if (risk >= 6) {
    return 'High'
  }
  else if (risk >= 3) {
    return 'Medium'
  }
  else if (risk >= 2) {
    return 'Low'
  }
  else {
    return 'Safe'
  }

}


/////////////
// HELPERS //
////////////



function getMethods(rootNode) {
  return rootNode.body.filter((node) => node.type === 'FunctionDeclaration')
}



function getContracts(rootNode) {
  return rootNode.body.filter((node) => node.type === 'ContractStatement')
}



main()
