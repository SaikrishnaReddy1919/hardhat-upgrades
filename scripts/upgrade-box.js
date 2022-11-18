const { ethers } = require("hardhat")

//manual way
async function main() {
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin")
    const transparentProxy = await ethers.getContract("Box_Proxy") //hardhat deploy names the box contract as implementation_contract_name(Box)_Proxy : Box_Proxy

    //get version
    const proxyBox1 = await ethers.getContractAt("BoxV2", transparentProxy.address)
    const version1 = await proxyBox1.version()
    console.log("Version before upgrading : ", version1.toString())

    //-------------upgrade--------------
    const boxV2 = await ethers.getContract("BoxV2")
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address)
    await upgradeTx.wait(1)

    //check version again
    const proxyBox2 = await ethers.getContractAt("BoxV2", transparentProxy.address) //transparentProxy is now BoxV2
    const version2 = await proxyBox2.version()
    console.log("Version after upgrading : ", version2.toString())
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
