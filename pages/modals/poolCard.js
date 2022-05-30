import { Box, Divider, Heading, Stack, Text, Tooltip, Image, useColorModeValue } from "@chakra-ui/react"
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { IconContext } from "react-icons"
import { tokens } from "../../constants"
import poolConnectorJson from '../../artifacts/contracts/pools/PoolConnector.sol/PoolConnector.json'
import { poolConnectorAddress } from '../../config'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import PoolModal from "./poolModal"
import { useEffect, useState } from "react"
import BigNumber from "bignumber.js"

export default function PoolCard(props) {
    const { isAuthenticated } = useMoralis()
    const { runContractFunction: getName } = useWeb3Contract({
        abi: poolConnectorJson.abi,
        contractAddress: poolConnectorAddress,
        functionName: "name"
    })

    const { runContractFunction: getDescription } = useWeb3Contract({
        abi: poolConnectorJson.abi,
        contractAddress: poolConnectorAddress,
        functionName: "description"
    })

    const { runContractFunction: getApy } = useWeb3Contract({
        abi: poolConnectorJson.abi,
        contractAddress: poolConnectorAddress,
        functionName: "apy"
    })
    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [apy, setApy] = useState()
    const [tokensStaked, setTokensStaked] = useState()
    const [tokenId, setTokenId] = useState(0)

    useEffect(() => {
        if (isAuthenticated) {
            loadPoolData()
        }
    }, [isAuthenticated])

    async function loadPoolData() {
        console.log("TOKENID: ", parseInt(props.tokenId.toString()))
        setName(await getName())
        setDescription(await getDescription())

        let apyRaw = new BigNumber((await getApy()).toString())
        console.log(apyRaw)
        let precision = new BigNumber(1e16)
        let apyFormatted = apyRaw.dividedBy(precision).toFixed(1).toString()
        setApy(apyFormatted)

        let tokensRaw = new BigNumber(props.stakedAmount.toString())
        let tokensFormatted = tokensRaw.toFormat(2).toString()
        setTokensStaked(tokensFormatted)
        setTokenId(parseInt(props.tokenId.toString()))


    }

    return (
        <Stack maxW={'3xl'} w={'full'} align={'center'} mb={5}>
            <Box
                maxW={'3xl'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={useColorModeValue('2xl', '2xl')}
                rounded={'md'}
                overflow={'hidden'}>
                <Box p={6}>
                    <Stack spacing={0} align={'center'} mb={5}>
                        <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                            {name}
                        </Heading>
                        <Text color={'gray.500'}>{description}</Text>
                    </Stack>


                    <Stack direction={'row'} h='60px' justify={'center'} spacing={6} mx={10} justifyContent="space-between">
                        <Stack spacing={'5px'} align={'center'}>
                            <Stack direction={'row'} spacing={'10px'} align={'center'}>
                                <Image boxSize='30px' src={`${tokens[tokenId].icon}`} alt='USDC' />
                                <Text fontSize={'xl'} fontWeight={500}>
                                    {tokens[tokenId].symbol}
                                </Text>
                            </Stack>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                Supported coin
                            </Text>
                        </Stack>
                        <Divider orientation='vertical' />
                        <Stack spacing={'5px'} align={'center'}>
                            <Text fontWeight={600} fontSize={'xl'} >{apy}%</Text>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                APY
                            </Text>
                        </Stack>
                        <Divider orientation='vertical' />
                        <Stack spacing={'5px'} align={'center'}>
                            <Text fontWeight={600} fontSize={'xl'}>{tokensStaked}</Text>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                Tokens staked
                            </Text>
                        </Stack>
                        <Divider orientation='vertical' />
                        <Stack spacing={'5px'} align={'center'}>
                            <Text fontWeight={600} fontSize={'xl'}>10%</Text>
                            <Stack direction={'row'} spacing={'4px'} align={'center'}>
                                <Text fontSize={'sm'} color={'gray.500'}> Reward Fee </Text>
                                <Tooltip hasArrow label='This fee is deduced from your staking rewards and not from the funds you have deposited or staked.' bg='gray.300' color='black'>
                                    <span>
                                        <IconContext.Provider value={{ size: '14px', color: '#718096' }}>
                                            <AiOutlineQuestionCircle />
                                        </IconContext.Provider>
                                    </span>
                                </Tooltip>
                            </Stack>
                        </Stack>
                    </Stack>
                    <PoolModal tokenId={tokenId} poolName={name} />
                </Box>
            </Box>
        </Stack>
    )
}