import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

//ballot address = 0xCd1f4c54c728F0AF2B6cC757a8b397Ae516BE93b
async function main() {
    //receive address of ballot and proposal index from CLI
    const ballotAddress = process.argv[2];
    const proposalIndex = process.argv[3];
    const voteAmount = process.argv[4];

    //get a provider
    const provider = new ethers.providers.InfuraProvider(
        "goerli",
        process.env.INFURA_API_KEY
        );


    //get your signer from .env (should be voter)
    const privateKey = process.env.PRIVATE_KEY;

    if(!privateKey || privateKey.length <= 0)
        throw new Error("Missing private key");

    const wallet = new ethers.Wallet(privateKey);
    
    const signer = wallet.connect(provider);
    console.log(`Connected to the wallet ${wallet.address}`)

    ////To create HD wallet, so as to create multiple addresses with one private key

    //const mnemonic = process.env.MNEMONIC;
    // if(!mnemonic || mnemonic.length <= 0)
    //     throw new Error("Missing private key");
    //     const HDNode = ethers.utils.HDNode.fromMnemonic(mnemonic);  
    //     const derivedNode = HDNode.derivePath(`m/44'/60'/0'/0/${1}`);
    //     const derivedNode2 = HDNode.derivePath(`m/44'/60'/0'/0/${2}`);

    // console.log(`Connected to the wallet ${derivedNode.address}`)
    // console.log(`Connected to the wallet ${derivedNode2.address}`)

//create a contract instance (attach)
    const ballotFactory =  new Ballot__factory(signer);
    const contractInstance = ballotFactory.attach(ballotAddress)

//interact
    const transactionResponse = await contractInstance.vote(proposalIndex, voteAmount);
    console.log("Voting in progress")
    const txReceipt = await transactionResponse.wait(1);
    console.log(txReceipt);

    console.log(`${signer.address} has just voted`);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  
  