import { ReactNode } from 'react';
import {
    Box,
    Container,
    Flex,
    HStack,
    Link,
    IconButton,
    Button,
    useDisclosure,
    useColorMode,
    useColorModeValue,
    Stack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import Logo from './logo'

const Links = ['Deposit', 'Vote', 'Dashboard']

const NavLink = ({ children }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}>
        {children}
    </Link>
);

export default function Navbar() {
    const { colorMode, toggleColorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
            <Container maxW={'7xl'}>
                <Flex h={20} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <Box alignItems={'center'}>
                        <NextLink href='/' passHref>
                            <Link _focus='none'>
                                <Logo colorMode={colorMode} size={40} />
                            </Link>
                        </NextLink>
                    </Box>

                    <Flex alignItems={'center'}>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            mr={4}
                            display={{ base: 'none', md: 'flex' }}>
                            {Links.map((link) => (
                                <NextLink key={link} href={`/${link.toLowerCase()}`} passHref>
                                    <Link _focus='none' key={link} fontWeight='semibold'>{link}</Link>
                                </NextLink>
                            ))}
                        </HStack>
                        <Button
                            variant={'solid'}
                            colorScheme={'cyan'}
                            size={'md'}
                            mr={4}>
                            Connect Wallet
                        </Button>
                        <Button onClick={toggleColorMode}>
                            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        </Button>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link) => (
                                <NextLink key={link} href={`/${link.toLowerCase()}`} passHref>
                                    <NavLink key={link}>{link}</NavLink>
                                </NextLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Container>
        </Box>
    )
}