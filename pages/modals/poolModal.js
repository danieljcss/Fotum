import { Button, propNames, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import PoolModalForm from "./poolModalForm"

export default function PoolModal(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Button
                w={'full'}
                mt={8}
                bg={useColorModeValue('#151f21', 'gray.900')}
                color={'white'}
                rounded={'md'}
                _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                }}
                onClick={onOpen}>
                Deposit
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW={'2xl'} w={'full'}>
                    <ModalHeader>Deposit in {props.poolName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <PoolModalForm tokenId={props.tokenId} />
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={onClose}>Cancel</Button>
                        <Button colorScheme='blue' >
                            Deposit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}