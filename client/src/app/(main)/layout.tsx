import SideBar from "@/components/sidebar/sidebar";
import Header from "@/components/header/header";

export default function MainLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <div className="h-full bg-[#F2F1EC] grid grid-cols-[307px_auto]">
            <SideBar/>
            <main>
                <Header/>
                <section className='py-6 px-4 h-full'>
                    {children}
                </section>
            </main>
        </div>
        </body>
        </html>
    )
}