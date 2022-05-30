import { Box, Button, Divider, Heading, Stack, Text, Tooltip, Image, useColorModeValue } from "@chakra-ui/react"
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { IconContext } from "react-icons"
import VoteCharityModal from "./voteCharityModal"

export default function VoteCard(params) {
    return (
        <>
            <Box
                maxW={'3xl'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={useColorModeValue('2xl', '2xl')}
                rounded={'md'}
                overflow={'hidden'}>
                <Box p={6}>
                    <Stack direction={'row'} h='60px' justify={'center'} spacing={6} mx={10} justifyContent="space-between">
                        <Stack spacing={'5px'} align={'center'}>
                            <Text fontSize={'xl'}>Add Unicef Charity</Text>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                Vote to add this charity to Fotum
                            </Text>
                        </Stack>
                        <Stack spacing={'5px'} align={'center'}>
                            <Text fontSize={'xl'}>20.05.2022</Text>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                Deadline
                            </Text>
                        </Stack>

                        <VoteCharityModal />
                    </Stack>


                </Box>
            </Box>
        </>
    )
}