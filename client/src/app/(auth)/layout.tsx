import Image from "next/image";

export default function AuthLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <div className="h-full grid grid-cols-2 bg-[#F2F1EC]">
            <div className='relative'>
                <Image src='/Login_bg.png' fill objectFit='cover' alt='Login_bg'/>
            </div>
            {children}
        </div>
        </body>
        </html>
    )
}