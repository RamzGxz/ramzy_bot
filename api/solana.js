import * as solana from '@solana/web3.js'

const connection = new solana.Connection(solana.clusterApiUrl('mainnet-beta'))

const getAccInfo = async (pubkey) => {
    const data = await connection.getAccountInfo(new solana.PublicKey(String(pubkey)))
    console.log(data)
    return data
}

export { getAccInfo }