const SolidityParser = require('solidity-parser')
const asciiTable     = require('ascii-table')


function main() {

  const contractFile = getFileFromArgs()
  const rootNode     = SolidityParser.parseFile(contractFile())

  console.log(JSON.stringify(contract, null, ' '))

  getContracts(rootNode).forEach((node) => {
    assessContract(node)
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

  const table = asciiTable

  const methods = getMethods(node)

  const riskMatrix = methods.map((methodNode) => {
    methodName       : methodNode.name,
    isPublic         : isPublicMethod(methodNode),
    canModifyState   : canModifyState(methodNode),
    hasExternalCalls : hasExternalCalls(methodNode),
    isHandlingAssets : isHandlingAssets(methodNode),
  })

  printTable(riskMatrix)

}



function isPublicMethod(node) {
  return node.modifiers.some(m => m.name === 'public')
}



function canModifyState(node) {
  return node.modifiers.every(m => (
    m !== 'view' &&
    m !== 'pure' &&
    m !== 'constant'
  ))
}



function hasExternalCalls(node) {
  return isCallingTransfer(node)
}



function isCallingTransfer(node) {
  return (
    (
      node.type === 'Identifier' &&
      node.name === 'transfer'
    )
    ||
    node.body.some(n => isCallingTransfer(n))
  )
}



function printTable(matrix) {
  console.log(JSON.stringify(matrix, null, ' '))
}



/////////////
// HELPERS //
////////////



function getAllMethods(rootNode) {
  return rootNode.body.filter((node) => node.type === 'FunctionDeclaration')
}



function getContracts(rootNode) {
  return rootNode.body.filter((node) => node.type === 'ContractStatement')
}



main()
