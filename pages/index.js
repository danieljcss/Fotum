import { useMoralis } from "react-moralis"
import Hero from "./components/hero"

export default function Home() {
  const { isAuthenticated } = useMoralis()

  return (
    <>
      <Hero />
    </>
  )
}
