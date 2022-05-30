import { Center, Stack } from "@chakra-ui/react"
import VoteCard from "./modals/voteCard"
import AddCharityModal from "./modals/addCharityModal"

export default function Vote() {
    return (
        <>
            <Center py={6}>
                <Stack maxW={'3xl'} w={'full'} align={'center'} mb={5}>
                    <AddCharityModal />
                    <VoteCard />
                    <VoteCard />
                </Stack>
            </Center>

        </>
    )
}