import { Box, Button, Center, Heading, Stack, Text, Tag, useColorModeValue } from "@chakra-ui/react"
import { Form, Formik, Field } from 'formik'

export default function DepositModal() {
    return (
        <>
            <Center py={6}>
                <Box
                    maxW={'3xl'}
                    w={'full'}
                    bg={useColorModeValue('white', 'gray.800')}
                    boxShadow={'2xl'}
                    rounded={'md'}
                    overflow={'hidden'}>
                    <Box p={6}>
                        <Box align={'center'} mb={5}>
                            <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                                Deposit
                            </Heading>
                        </Box>
                        <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
                                email: '',
                            }}
                            onSubmit={async (values) => {
                                await new Promise((r) => setTimeout(r, 500));
                                alert(JSON.stringify(values, null, 2));
                            }}
                        >
                            <Form>
                                <label htmlFor="firstName">First Name</label>
                                <Field id="firstName" name="firstName" placeholder="Jane" />

                                <label htmlFor="lastName">Last Name</label>
                                <Field id="lastName" name="lastName" placeholder="Doe" />

                                <label htmlFor="email">Email</label>
                                <Field
                                    id="email"
                                    name="email"
                                    placeholder="jane@acme.com"
                                    type="email"
                                />
                                <button type="submit">Submit</button>
                            </Form>
                        </Formik>
                    </Box>
                </Box>
            </Center>
        </>
    )
}