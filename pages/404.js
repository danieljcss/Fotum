import { Box, Button, Heading, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

export default function NotFound() {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading
                display="inline-block"
                as="h2"
                size="2xl"
                bgGradient="linear(to-r, cyan.400, cyan.600)"
                backgroundClip="text">
                404
            </Heading>
            <Text fontSize="18px" mt={3} mb={2}>
                Page Not Found
            </Text>
            <Text color={'gray.500'} mb={6}>
                The page you are looking for does not seem to exist
            </Text>

            <Button
                colorScheme="cyan"
                bgGradient="linear(to-r, cyan.400, cyan.500, cyan.600)"
                color="white"
                variant="solid">
                <NextLink href='/' passHref>
                    <Link _focus='none'>
                        Go to Home
                    </Link>
                </NextLink>
            </Button>
        </Box>
    )
}