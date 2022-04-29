import Image from 'next/image'

export default function Logo(props) {
    return (
        <>
            <div style={{ position: 'relative', width: `${3 * props.size}px`, height: `${props.size}px` }}>
                <div style={{ position: 'absolute' }}>
                    {props.colorMode === 'light' ?
                        <Image src="/Fotum-letters.svg" alt="" width={3 * props.size} height={props.size} />
                        :
                        <Image src="/Fotum-letters-dark-mode.svg" alt="" width={3 * props.size} height={props.size} />
                    }
                </div>
                <div className="logoWrapper" style={{ marginLeft: `${0.25 * props.size}px`, height: `${props.size}px`, width: `${props.size}px` }}>
                    <div id="logoIcon" style={{ height: `${props.size}px`, width: `${props.size}px` }}>
                        <Image src="/Fotum-Icon-Space.svg" alt="" width={props.size} height={props.size} />
                    </div>
                </div>
            </div>
        </>
    )
}