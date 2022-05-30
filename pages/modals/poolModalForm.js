import {
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Button,
    Grid,
    GridItem,
    Input,
    Image,
    Select,
    Stack,
    useColorModeValue,
    Text,
    Flex
} from '@chakra-ui/react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { IconContext } from "react-icons"
import { tokens } from "../../constants"
import { useState, useEffect } from 'react'

export default function PoolModalForm(props) {
    const [formInput, setFormInput] = useState({
        amount: 0,
        children: [],
        nChildren: 0,
        charities: [],
        nCharities: 0
    })

    return (
        <Stack spacing={'20px'}>
            <Stack direction={'row'} >
                <FormControl>
                    <FormLabel htmlFor='email'>Amount to Stake</FormLabel>
                    <Input
                        id='amount'
                        type='number'
                        onChange={e => setFormInput({ ...formInput, amount: e.target.value })} />
                    {/* Amount
                        DistributionBar
                        Add Children(Address, Name, Birthday, SLide proportion)
                        Add Charity(Select scroll, slide proportion)
                        Fee */}
                </FormControl>
                <Flex alignItems={'center'} pt={"3px"}>
                    <Stack direction={'row'} spacing={'10px'}>
                        <Image boxSize='30px' src={`${tokens[props.tokenId].icon}`} alt='USDC' />
                        <Text fontSize={'xl'} pr={"20px"} fontWeight={500}>
                            {tokens[props.tokenId].symbol}
                        </Text>

                    </Stack>
                </Flex>
            </Stack>

            <RewardsBar />

            {formInput.children.map((child, i) => (
                <ChildForm key={i} />
            ))}

            <Stack direction={"row"} my={"10px"}>
                {formInput.nChildren == 0 ? (<></>) : (<RemoveChild />)}
                <AddChild />
            </Stack>

            {formInput.charities.map((charity, i) => (
                <CharityForm key={i} />
            ))}

            <Stack direction={"row"} my={"10px"}>
                {formInput.nCharities == 0 ? (<></>) : (<RemoveCharity />)}
                <AddCharity />
            </Stack>

            <Stack direction={'row'} spacing={'4px'} alignItems={'center'}>
                <Stack direction={'row'}>
                    <Text fontWeight={'medium'}>Reward Fee:</Text>
                    <Text>10%</Text>
                </Stack>
                <Tooltip hasArrow label='This fee is deduced from your staking rewards and not from the funds you have deposited or staked. If you stake more than 50% in charities this fee is reduced by half.' bg='gray.300' color='black'>
                    <span>
                        <IconContext.Provider value={{ size: '14px', color: '#718096' }}>
                            <AiOutlineQuestionCircle />
                        </IconContext.Provider>
                    </span>
                </Tooltip>

            </Stack>
        </Stack>
    )
}

function RewardsBar(props) {
    return (
        <Stack>
            <Text fontWeight={'medium'}> Staking Rewards Distribution  </Text>

            <Stack direction={'row'} align={'center'} spacing={'0px'} rounded={'lg'}>
                <Flex w={'20%'} h={'35px'} bgColor={'blue.500'} align={'center'} justifyContent={'center'}><Text>20%</Text></Flex>
                <Flex w={'70%'} h={'35px'} bgColor={'teal.500'} align={'center'} justifyContent={'center'}><Text>70%</Text></Flex>
                <Flex w={'10%'} h={'35px'} bgColor={'red.800'} align={'center'} justifyContent={'center'}><Text>10%</Text></Flex>
            </Stack>
            <Flex direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack direction={'row'} alignItems={'center'}>
                    <Box w={'15px'} h={'15px'} bgColor={'blue.500'} align={'center'} justifyContent={'center'} rounded={'sm'}></Box>
                    <Text fontSize={'sm'}>Your Rewards</Text>
                </Stack>
                <Stack direction={'row'} alignItems={'center'}>
                    <Box w={'15px'} h={'15px'} bgColor={'teal.500'} align={'center'} justifyContent={'center'} rounded={'sm'}></Box>
                    <Text fontSize={'sm'}>Children Rewards</Text>
                </Stack>
                <Stack direction={'row'} alignItems={'center'}>
                    <Box w={'15px'} h={'15px'} bgColor={'purple.500'} align={'center'} justifyContent={'center'} rounded={'sm'}></Box>
                    <Text fontSize={'sm'}>Charities Rewards</Text>
                </Stack>
                <Stack direction={'row'} alignItems={'center'}>
                    <Box w={'15px'} h={'15px'} bgColor={'red.800'} align={'center'} justifyContent={'center'} rounded={'sm'}></Box>
                    <Text fontSize={'sm'}>Fotum Fee</Text>
                </Stack>

            </Flex>
        </Stack>
    )
}

function ChildForm(props) {
    return (
        <Box
            w={'full'}
            p={6}
            position={"relative"}
            _before={{
                content: '""',
                //bgImage: "linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5))",
                //bgSize: "cover",
                display: "block",
                position: "absolute",
                w: "full",
                h: "full",
                bg: useColorModeValue('gray.100', 'gray.600'),
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                opacity: 0.2
            }}
            rounded={'md'}
            overflow={'hidden'}>
            <Stack direction={'row'} justify={'center'} spacing={6} mb={6}>
                <FormControl>
                    <FormLabel htmlFor='email'>Child Name</FormLabel>
                    <Input id='props.name' type='text' />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor='email'>Child Address</FormLabel>
                    <Input id='props.id' type='text' />
                </FormControl>

            </Stack>
            <Stack direction={'row'} justify={'center'} spacing={6}>
                <FormControl>
                    <FormLabel htmlFor='email'>Child Birthday</FormLabel>
                    <Input id='props.id' type='date' />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor='email'>Rewards Proportion</FormLabel>
                    <ProportionSlider />
                </FormControl>
            </Stack>
        </Box>
    )
}

function AddChild() {
    return (
        <Button
            w={"full"}
            ml={"auto"}
        >
            + Add Child
        </Button>
    )
}

function RemoveChild() {
    return (
        <Button
            w={"full"}
        >
            - Remove Child
        </Button>
    )
}

function CharityForm() {
    return (
        <Box
            w={'full'}
            p={6}
            position={"relative"}
            _before={{
                content: '""',
                //bgImage: "linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5))",
                //bgSize: "cover",
                display: "block",
                position: "absolute",
                w: "full",
                h: "full",
                bg: useColorModeValue('gray.100', 'gray.600'),
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                opacity: 0.2
            }}
            rounded={'md'}
            overflow={'hidden'}>
            <FormControl>
                <FormLabel htmlFor='charity'>Charity</FormLabel>
                <Select id='charity' placeholder='Select charity'>
                    <option>United Arab Emirates</option>
                    <option>Nigeria</option>
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor='email'>Rewards Proportion</FormLabel>
                <ProportionSlider />
            </FormControl>
        </Box>
    )
}

function AddCharity() {
    return (
        <Button
            w={"full"}
        >
            + Add Charity
        </Button>
    )
}

function RemoveCharity() {
    return (
        <Button
            w={"full"}
        >
            - Remove Charity
        </Button>
    )
}

import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    Tooltip
} from '@chakra-ui/react'


function ProportionSlider() {
    // Color should be a prop to distinguish elements in bar
    const [sliderValue, setSliderValue] = useState(5)
    const [showTooltip, setShowTooltip] = useState(false)
    return (
        <Slider
            id='slider'
            defaultValue={5}
            min={0}
            max={100}
            colorScheme='teal'
            onChange={(v) => setSliderValue(v)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <SliderMark value={25} mt='1' ml='-2.5' fontSize='sm'>
                25%
            </SliderMark>
            <SliderMark value={50} mt='1' ml='-2.5' fontSize='sm'>
                50%
            </SliderMark>
            <SliderMark value={75} mt='1' ml='-2.5' fontSize='sm'>
                75%
            </SliderMark>
            <SliderTrack>
                <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
                hasArrow
                bg='teal.500'
                color='white'
                placement='top'
                isOpen={showTooltip}
                label={`${sliderValue}%`}
            >
                <SliderThumb />
            </Tooltip>
        </Slider>
    )
}