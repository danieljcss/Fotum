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
import AddCharityModalForm from "./addCharityModalForm"

export default function AddCharityModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Button
                w={'full'}
                mt={8}
                // bg={useColorModeValue('#151f21', 'gray.900')}
                // color={'white'}
                rounded={'md'}
                _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                }}
                onClick={onOpen}>
                + Add Proposal
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW={'2xl'} w={'full'}>
                    <ModalHeader>Propose Charity</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <AddCharityModalForm />
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={onClose}>Cancel</Button>
                        <Button colorScheme='blue' >
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}