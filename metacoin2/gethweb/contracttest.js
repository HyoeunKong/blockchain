var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_value",
				"type": "string"
			}
		],
		"name": "setValue",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_value",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getValue",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

const contractAddress = "0x8db336237c116fb0d990f92e6e0185160a30fbfe";

var MyContract = new web3.eth.Contract(abi,contractAddress);
//console.log( MyContract.options.adress);
//console.log( MyContract.options.jsonInterface);
/* 
MyContract.methods.getValue().call()
    .then(result => {
        console.log(result);
    }) */

//voteContract.methods.getNumOfCandidate().call().then(console.log);


async function sendTest(){
    let result = await MyContract.methods
        .setValue("12345")
        .send({from:"0x11710075051B0Be756A16Aa3a5fdafD7008e13e4"});
        console.log(result);
}

sendTest();

async function hello (){
    let result = await MyContract.methods.getValue().call();
    console.log(result);
}

hello();