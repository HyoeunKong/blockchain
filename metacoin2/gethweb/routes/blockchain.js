var express = require('express');
var router = express.Router();
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

 var router = express.Router();

 router.get('/', async function(req, res, next) {
  let endBlockNum = await web3.eth.getBlockNumber();
  let blockList = [];
  for(i = 0; i < endBlockNum; i++){
    let block = await web3.eth.getBlock(i)
 
 
  
    blockList.push(block)
  

  }

    
 res.render('blockchain', {blocks: blockList, title:"blockchain", selectedIdx: 0});
 

  });

 
router.get('/test',function(req,res,next){
web3.eth.getBlockNumber()
.then(number => {
  console.log(number);
  res.json(number);
  })
})
 

  
router.get('/block/:idx', async function(req, res, next) {
  let selectedIdx = req.params.idx;
  let endBlockNum = await web3.eth.getBlockNumber();
  let blockList = [];
  for(i = 0; i < endBlockNum; i++){
    let block = await web3.eth.getBlock(i)
    blockList.push(block)
  }


  let targetBlock = blockList[selectedIdx]
  let endTxs = targetBlock.transactions.length
  let txs = []
  console.log("------------------")
  console.log(targetBlock)
  console.log("------------------")
  console.log(endTxs)
  for(i = 0; i < endTxs; i++){
    txsId = targetBlock.transactions[i]
    tx = await web3.eth.getTransaction(txsId)
    txs.push(tx)
  }
  
  
  res.render('blockchain',
       {title: "Blockchain info"
       , blocks: blockList
       , selectedIdx : selectedIdx
       , txs : txs}
  )
 });

  router.get('/wallet/:address', async function(req, res, next) {
  const address = req.params.address;
  const balance = parseInt(await web3.eth.getBalance(address));
  let endBlockNum = await web3.eth.getBlockNumber();
  let txs = []


  for(i = 0; i < endBlockNum; i++){
    let block = await web3.eth.getBlock(i)
    let endTxs = block.transactions.length
  
      for(j = 0; j < endTxs; j++){
        let txsId = block.transactions[j]
        let tx = await web3.eth.getTransaction(txsId)
       
        if(tx.from === address || tx.to === address){
          txs.push([i,tx])
        }
      }
    }
 



  res.render('wallet',
       { address:address,
         balance:balance,
         txs:txs
        }  
  )
 });

router.get('/accountlist', function(req,res, next) {
web3.eth.getAccounts()
.then(async accounts => {
  console.log(accounts)
  let accountList = [];
  for(let i = 0; i < accounts.length; i++){
    await web3.eth.getBalance(accounts[i])
    .then(bal=>{
      console.log(bal)
      accountList.push({
        WalletAddress:accounts[i],
        balance: web3.utils.fromWei(bal, "ether")
        
      })

    })
  
  }
  res.render('accountlist', {accounts: accountList})
})

})

router.get('/createaccount', function(req,res,next) {

web3.eth.personal.newAccount("eth")
  .then(()=> {
    res.redirect('/blockchain/accountlist');
  })
  .catch(() => {
    console.log("ERR:create account errer");
    res.redirect('/blockchain/accountlist');
  })

  /* const newKey = ec.genKeyPair();
 const newAccount = {
   "PrivKey" : newKey.getPrivate('hex'),
   "PublicKey" : newKey.getPublic('hex'),
   "WalletAddress" : newKey.getPublic('hex')
 }
 
 mychain.accounts.push(newAccount);

 mychain.saveKeyStore();
 
 res.redirect('/blockchain/accountlist'); */
});








 
router.get('/createtx', function (req, res, next) {
  web3.eth.getCoinbase().then( wallet => {
    res.render('createtx',  {wallet : wallet} );
  });
 
})
 
router.post('/createtx', function (req, res, next) {
 const fromAddress = req.body.fromAddress;
 const toAddress = req.body.toAddress;
 const amount = web3.utils.toHex(req.body.amount);
 const keystore = {"address":"5804abfb7d5e662054b12cf072a93923d161a284","crypto":{"cipher":"aes-128-ctr","ciphertext":"78f5375d719bcb65780c5638ceeb2fbfaea3b102d1c768c641c64cd6bda1d59c","cipherparams":{"iv":"2bf667d24e0e2bc1c4e7dc3494994ed7"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"430dbe2530d57f16644e0f157967942a1dfa4b8398d8f33121f4d044bbaa1e3b"},"mac":"4cb25f70ad7c6cc7c5e120c80ba040246e6fd6c88c6934ad4c959aa38c6d337c"},"id":"822a5ef2-90ed-49e6-b0e3-ab479225c4e6","version":3};
 const decryptAccount = web3.eth.accounts.decrypt(keystore, 'eth')
 
 console.log('fromAddress : ', fromAddress);
 console.log('toAddress : ', toAddress);
 console.log('amount : ', amount);
 
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

/* 
 const tx = new Transaction(fromAddress, toAddress, amount);
 tx.signTransaction("0x021221aac1a086fbba96826cc745e97357cc48bd178646cab64b2e38b075e4dc");
 web3.eth.addTransaction(tx);
 
 console.log(web.eth.pendingTransactions); */
 res.redirect('/blockchain/pendingtransaction');
 })
 

 router.get('/pendingtransaction', function (req, res, next) {
  let txs = web3.eth.pendingTransactions
  res.render('pendingtransaction', {txs:txs});
 })

 router.get('/miningblock',function(req,res,next){
      console.log('mining...');
     web3.eth.minePendingTransactions(wallet1);
     console.log('block mined...');
     res.redirect('/blockchain');
 })


 router.get('/blockchain_setting', function (req, res, next) {
     res.render('blockchain_setting');
    })
    
 router.post('/blockchain_setting', function (req, res, next) {
     const difficulty = parseInt(req.body.difficulty);
     const reward = parseInt(req.body.reward);

     console.log(difficulty);
     console.log(reward);
     mychain.difficulty = difficulty;
     mychain.miningReward = reward;
     console.log(mychain);
     res.redirect('/blockchain');
     

    })




 
module.exports = router;
 
