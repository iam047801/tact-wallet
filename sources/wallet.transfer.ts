import { Address, contractAddress, toNano, TonClient, ExternalMessage, CommonMessageInfo, CellMessage, beginCell } from "ton";
import { mnemonicToWalletKey, sign } from 'ton-crypto';
import { Wallet_init, Transfer, packTransfer, packTransferMessage } from "./output/wallet_Wallet";
import { printAddress, printHeader, printTransfer, printWalletInfo } from "./utils/print";
import BN from "bn.js";

(async () => {

    // Get wallet address and private key
    if (process.env.MNEMONIC == undefined) {
        console.log("[ERROR] undefined mnemonic");
        return;
    }
    let mnemonic = process.env.MNEMONIC!.split(' ');
    let key = await mnemonicToWalletKey(mnemonic);
    let pk = new BN(key.publicKey.toString('hex'), 'hex');
    let init = await Wallet_init(pk, new BN(0));
    let address = contractAddress({ workchain: 0, initialCode: init.code, initialData: init.data });
    let testnet = !!+process.env.TESTNET!;
    printHeader('WalletTactContract');
    printAddress(address, testnet);

    // Create client (only needed to get balance and sequence number)
    const client = new TonClient({
        endpoint: testnet ? "https://testnet.toncenter.com/api/v2/jsonRPC" : 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: "4ab814faf78ab31792688facb4a5bf8e8e01c8053de98b9cf85c43b5780032db",
    });
    // Get balance of a contract
    let balance = await client.getBalance(address);
    // Call get method "seqno"
    let seqNoRes = await client.callGetMethod(address, 'seqno');
    let seqNo = parseInt(seqNoRes.stack[0][1], 16);
    printWalletInfo(balance, seqNo);

    if (process.env.RECEIVER_ADDRESS == undefined) {
        console.log("[ERROR] undefined receiver address");
        return;
    }
    let transfer: Transfer = {
        $$type: 'Transfer',
        seqno: new BN(seqNo),
        mode: new BN(128),
        amount: toNano(0.1337),
        to: Address.parse(process.env.RECEIVER_ADDRESS!),
        body: null
    };
    let signed = sign(packTransfer(transfer).hash(), key.secretKey);
    
    printTransfer(address, toNano(0.1), packTransferMessage({
        $$type: 'TransferMessage',
        transfer,
        signature: beginCell().storeBuffer(signed).endCell()
    }), testnet)
    
    //////// It would be great to send external message, but it's not possible yet
    // await client.sendMessage(new ExternalMessage({
    //     to: address,
    //     body: new CommonMessageInfo({
    //         body: new CellMessage(packTransferMessage({
    //             $$type: 'TransferMessage',
    //             transfer,
    //             signature: beginCell().storeBuffer(signed).endCell()
    //         }))
    //     })
    // }));
})();