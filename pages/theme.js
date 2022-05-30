import { extendTheme } from '@chakra-ui/react'

const colors = {
    fblue: {
        900: '#1a365d',
        800: '#153e75',
        700: '#2a69ac',
    },
    fcyan: {
        50: "#E8FBFC",
        100: "#D2F6F9",
        200: "#A4EDF4",
        300: "#77E4EE",
        400: "#4ADBE8",
        500: "#1CCFE1",
        600: "#17A8B5",
        700: "#117E88",
        800: "#0B545B",
        900: "#062A2D"
    }
}
const shadows = {
    light: '0 0 0 3px rgba(255, 255, 255, 0.6)',
}

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: true,
}

const components = {
    Link: {
        baseStyle: {
            _hover: {
                textDecoration: 'none',
            },
        },
    },
}

const theme = extendTheme({ colors, shadows, config, components })

export default theme