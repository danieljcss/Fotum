import { Button, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import VoteCharityModalForm from "./voteCharityModalForm"

export default function VoteCharityModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Button
                w={'100px'}
                mt={8}
                rounded={'md'}
                _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                }}
                onClick={onOpen}>
                Vote
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW={'2xl'} w={'full'}>
                    <ModalHeader>Vote</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VoteCharityModalForm />
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}