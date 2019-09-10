var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

const keystore = {"address":"5804abfb7d5e662054b12cf072a93923d161a284","crypto":{"cipher":"aes-128-ctr","ciphertext":"78f5375d719bcb65780c5638ceeb2fbfaea3b102d1c768c641c64cd6bda1d59c","cipherparams":{"iv":"2bf667d24e0e2bc1c4e7dc3494994ed7"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"430dbe2530d57f16644e0f157967942a1dfa4b8398d8f33121f4d044bbaa1e3b"},"mac":"4cb25f70ad7c6cc7c5e120c80ba040246e6fd6c88c6934ad4c959aa38c6d337c"},"id":"822a5ef2-90ed-49e6-b0e3-ab479225c4e6","version":3};
const decryptAccount = web3.eth.accounts.decrypt(keystore, 'eth') //keystore 파일을 해석해서 복호화
console.log(decryptAccount.privateKey);

//priveKey = 0x021221aac1a086fbba96826cc745e97357cc48bd178646cab64b2e38b075e4dc

//transaction 
var fromAddress = "0x5804abfb7d5e662054b12cf072a93923d161a284";
var toAddress = "0x76caB570f21e8427311992968Bda3576102FB661";
var amount = web3.utils.toHex(111111111);

async function sendTransaction(fromAddress, toAddress, amount){
    var txPrams = {
        from : fromAddress,
        to : toAddress,
        value : amount,
        gas : web3.utils.toHex(0x21000)
    }
    var signedTx = await decryptAccount.signTransaction(txPrams);
    console.log(signedTx);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .once('transactionHash',(hash)=>{
        console.log(hash)
    })
}

sendTransaction(fromAddress, toAddress, amount);