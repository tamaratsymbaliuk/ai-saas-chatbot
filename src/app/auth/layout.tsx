import Image from 'next/image'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <div className="h-screen flex w-full justify-center">
            <div className="w-[600px] lg:w-full flex flex-col items-start p-6">
                {/* <Image
                src="/images/logo.png"
                alt="LOGO"
                sizes="100vw"
                style={{
                    width: '20%',
                    height: 'auto',
                }}
                width={0}
                height={0}
            /> */}
                {children}     
            </div>
            <div className="hidden lg:flex flex-1 w-full max-h-full max-w-[4000px] overflow-hidden relative bg-cream flex-col pt-6">
                <h2 className="text-gravel md:text-4xl font-bold">
                    Hi, I&apos;m your AI-powered sales assistant, MailGenie!
                </h2>
                <p className="text-iridium md:text-sm mb-10">
                    MailGenie is capable of capturing lead information without a form...{' '}
                    <br />
                    something never done before.
                </p>
                <Image 
                    src="/images/app-ui.png"
                    alt="App image"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="absolute shrink-0 !w-[1600px] top-48"
                    width={1600}
                    height={900}
                />
            </div>
        </div>
    )
}

export default Layout;
