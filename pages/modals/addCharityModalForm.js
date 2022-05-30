import {
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Button,
    Input,
    Select,
    Stack,
    useColorModeValue,
    Text
} from '@chakra-ui/react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { IconContext } from "react-icons"

export default function VoteCharityModalForm() {
    return (
        <Stack>
            <FormControl>
                <FormLabel htmlFor='name'>Charity Name</FormLabel>
                <Input id='charityname' type='text' />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor='description'>Charity Description</FormLabel>
                <Input id='charitydescription' type='text' />
                <FormHelperText>Tell us what this charity cares about.</FormHelperText>
            </FormControl>

            <FormControl>
                <FormLabel htmlFor='email'>Charity Website</FormLabel>
                <Input id='charityname' type='text' />
                <FormHelperText>Website where we can check the donation address.</FormHelperText>
            </FormControl>

            <FormControl>
                <FormLabel htmlFor='email'>Charity wallet address</FormLabel>
                <Input id='charityname' type='text' />
                <FormHelperText>Please enter the wallet address for this network.</FormHelperText>
            </FormControl>
        </Stack>

    )
}
