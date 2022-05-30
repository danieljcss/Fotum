import {
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Button,
    Center,
    Input,
    Select,
    Stack,
    useColorModeValue,
    Text
} from '@chakra-ui/react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { IconContext } from "react-icons"
import { RiThumbUpLine, RiThumbDownLine } from 'react-icons/ri'

export default function PoolModalForm() {
    return (
        <Center>
            <Stack align={'center'} w={'full'} maxW={'2xl'}>
                <Text fontSize={'xl'}>Add Unicef Charity to Fotum?</Text>
                <FormControl>
                    <FormLabel htmlFor='email'>Amount to Stake</FormLabel>
                    <Input id='amount' type='number' />
                    <FormHelperText>You have x votes remaining.</FormHelperText>
                </FormControl>
                <Stack direction={'row'}>
                    <Button bgColor={'green.500'}>
                        <RiThumbUpLine />
                        <Text ml={'8px'}>Yes</Text>
                    </Button>
                    <Button bgColor={'red.600'}>
                        <RiThumbDownLine />
                        <Text ml={'8px'}>No</Text>
                    </Button>
                </Stack>
            </Stack>
        </Center>
    )
}