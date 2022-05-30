import PoolCard from "./modals/poolCard"
import { Center, Stack, Text, Button } from "@chakra-ui/react"
import { useMoralis, useWeb3Contract } from 'react-moralis'
import fotumJson from '../artifacts/contracts/fotum/Fotum.sol/Fotum.json'
import { fotumAddress } from '../config'
import { useEffect, useState } from "react"

export default function Deposit() {
    const { isAuthenticated } = useMoralis()
    const { data, error, runContractFunction: getPools, isFetching, isLoading } = useWeb3Contract({
        abi: fotumJson.abi,
        contractAddress: fotumAddress,
        functionName: "fetchPoolsData"
    })
    const [pools, setPools] = useState([])

    useEffect(() => {
        if (isAuthenticated) {
            loadPools()
        }
    }, [isAuthenticated])

    async function loadPools() {
        let poolsRaw = await getPools({
            onError: (error) => console.log(error)
        })
        let poolsNew = []
        for (let i = 0; i < poolsRaw[0].length; i++) {
            let pool = {
                "address": poolsRaw[0][i],
                "stakedAmount": poolsRaw[1][i],
                "tokenId": poolsRaw[2][i]
            }
            poolsNew.push(pool)
        }
        setPools(poolsNew)
    }

    return (
        <>
            <Center py={6}>
                {isAuthenticated ? (
                    <Stack maxW={'3xl'} w={'full'} align={'center'} mb={5}>
                        {pools.map((pool, i) => (
                            <PoolCard
                                key={i}
                                address={pool.address}
                                stakedAmount={pool.stakedAmount}
                                tokenId={pool.tokenId}
                            />
                        ))}
                    </Stack>

                ) : (
                    <Text fontSize={'xl'} mt={6}>Please connect your wallet to deposit</Text>
                )}

            </Center>
        </>
    )
}