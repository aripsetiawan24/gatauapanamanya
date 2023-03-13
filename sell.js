const Web3 = require('web3')
const HDWallet = require('@truffle/hdwallet-provider')
const moment = require('moment')
const delay = require('delay');
const axios = require('axios');

const harga = async () => {
    while (true) {
        try {
            const response = await axios.get('http://127.0.0.1:6969/p');
            data = parseInt(response.data)
            // console.log(data)
            if (data > 11) {
                console.log(`[ ${moment().format("HH:mm:ss")} ] harga $${response.data} Waktunya jual`)
                const pubAddr = 'ADDRESS'
                const privAddr = 'PRIVATE_KEY'
                const infuraConnect = 'https://evm.confluxrpc.com'
                const web3 = new Web3(new HDWallet(privAddr, infuraConnect));

                const abi = require('./swap.json')
                const kontrakswap = '0x62b0873055bf896dd869e172119871ac24aea305'
                const wcfx = "0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b"
                const neko = "0xbecd75bde87020a4f0d3084bcce9cde794547660"
                const amount = web3.utils.toWei('JUMLAH', 'ether')
                const kontrak = new web3.eth.Contract(abi, kontrakswap);
                const getAmountsOut = await kontrak.methods.getAmountsOut(amount, [neko, wcfx]).call()
                const jum = getAmountsOut[1] / 1000000000000000000
                console.log(`[ ${moment().format("HH:mm:ss")} ] Jumlah NEKO yang akan dijual: ` + amount / 1000000000000000000)
                console.log(`[ ${moment().format("HH:mm:ss")} ] Jumlah CFX yang akan didapat: ` + jum)
                await kontrak.methods.swapExactTokensForETH(amount, getAmountsOut[1], [neko, wcfx], pubAddr, Math.floor(Date.now() / 1000) + 60 * 20).send({ from: pubAddr, value: '0', gasPrice: '20000000000' })
                    .on('transactionHash', (transactionHash) => {
                        console.log(`[ ${moment().format("HH:mm:ss")} ]`, ('Berhasil Jual ' + amount / 1000000000000000000 + ' NEKO : ' + transactionHash));
                    })
            }
            else {
                console.log(`[ ${moment().format("HH:mm:ss")} ] Tunggu harga masih $` + response.data)
            }
        } catch (error) {
            console.log(error)
        }
        await delay(10000)
    }
}

harga()
