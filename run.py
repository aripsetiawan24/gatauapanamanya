from flask import Flask
from web3 import Web3

app = Flask(__name__)
app.config['DEBUG'] = True

def harga():
    try:
        node_url = 'https://evm.confluxrpc.com'
        web3 = Web3(Web3.HTTPProvider(node_url))

        abi = [{
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amountIn",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address[]",
                        "name": "path",
                        "type": "address[]"
                    }
                ],
                "name": "getAmountsOut",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "amounts",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }]
        address = Web3.toChecksumAddress('0x62b0873055bf896dd869e172119871ac24aea305')
        
        contract = web3.eth.contract(address = address , abi = abi)
        wcfx = Web3.toChecksumAddress('0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b')
        neko = Web3.toChecksumAddress('0xbecd75bde87020a4f0d3084bcce9cde794547660')
        usdc = Web3.toChecksumAddress('0x6963efed0ab40f6c3d7bda44a05dcf1437c44372')

        cekharga = contract.functions.getAmountsOut(1000000000000000000000, [neko, wcfx]).call() 
        x = cekharga[1]/1000000000000000000
        cekharga1 = contract.functions.getAmountsOut(cekharga[1], [wcfx, usdc]).call()
        z = cekharga1[1]/1000000000000000000
        y = round(x, 3)
        v = round(z, 3)
        hasilcfx = float(y)
        hasilusdc = float(v)
        return str(hasilusdc)
    except:
        return 'error'

@app.route('/p')
def indexs():
    return harga()
    
app.run(port=6969)
