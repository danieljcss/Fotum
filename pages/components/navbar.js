import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import {
    Box,
    Button,
    Container,
    Flex,
    HStack,
    IconButton,
    Link,
    Stack,
    Text,
    Menu, MenuButton, MenuList, MenuItem, MenuDivider,
    useDisclosure,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import Logo from './logo'
import { RiExternalLinkLine, RiLogoutBoxLine } from 'react-icons/ri';

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
    const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis()
    useEffect(() => {
        if (isAuthenticated) {
            //setUserAddress()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    // async function setUserAddress() {
    //     userAddress = await user.get('ethAddress')
    // }

    const login = async () => {
        if (!isAuthenticated) {
            await authenticate({ signingMessage: "Log in using Moralis" })
                .then(function (user) {
                    console.log("logged in user:", user);
                    console.log(user.get("ethAddress"));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    const logOut = async () => {
        await logout();
        console.log("logged out");
    }

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
                            spacing={10}
                            mr={4}
                            display={{ base: 'none', md: 'flex' }}>
                            {Links.map((link) => (
                                <NextLink key={link} href={`/${link.toLowerCase()}`} passHref>
                                    <Link _focus='none' key={link} fontWeight='semibold'>{link}</Link>
                                </NextLink>
                            ))}
                        </HStack>

                    </Flex>

                    <Flex alignItems={'center'}>
                        {!isAuthenticated ? (
                            <Button
                                onClick={login}
                                variant={'solid'}
                                colorScheme={'cyan'}
                                size={'md'}
                                mr={4}>
                                Connect Wallet
                            </Button>
                        ) : (
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    variant={'solid'}
                                    colorScheme={'cyan'}
                                    cursor={'pointer'}
                                    size={'md'}
                                    mr={4}
                                    minW={0}>
                                    {`${user.get('ethAddress').slice(0, 5)}...${user.get('ethAddress').slice(-4)}`}
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={logOut}>
                                        <HStack>
                                            <RiLogoutBoxLine mr={3} />
                                            <Text>Logout</Text>
                                        </HStack>
                                    </MenuItem>

                                    <MenuDivider />
                                    <MenuItem>
                                        <HStack>
                                            <RiExternalLinkLine mr={3} />
                                            <a href={`https://rinkeby.etherscan.io/address/${user.get('ethAddress')}`}
                                                target="_blank" rel="noopener noreferrer"
                                            >
                                                See on Etherscan
                                            </a>
                                        </HStack>
                                    </MenuItem>

                                </MenuList>
                            </Menu>
                        )}


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
        </Box >
    )
}