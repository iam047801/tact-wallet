import { contractAddress, toNano } from "ton";
import { mnemonicNew, mnemonicToWalletKey, sign } from 'ton-crypto';
import { Wallet_init } from "./output/wallet_Wallet";
import { printAddress, printDeploy, printHeader } from "./utils/print";
import BN from "bn.js";

(async () => {

    // Create wallet
    let mnemonic = await mnemonicNew(24);
    let key = await mnemonicToWalletKey(mnemonic);
    let pk = new BN(key.publicKey.toString('hex'), 'hex');
    
    // Wallet state init
    let init = await Wallet_init(pk, new BN(0));

    // Get contract address with state init
    let address = contractAddress({ workchain: 0, initialCode: init.code, initialData: init.data });

    let deployAmount = toNano(1);
    let testnet = !!+process.env.TESTNET!;

    // Print basics
    printHeader('WalletTactContract');
    console.log('Mnemonic: ' + mnemonic);
    printAddress(address, testnet);
    printDeploy(init, deployAmount, "notify", testnet);
})();