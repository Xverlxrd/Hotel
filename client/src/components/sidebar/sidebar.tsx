'use client';

import Image from "next/image";
import Link from "next/link";

export default function SideBar() {
    return (
        <aside className='bg-[#5E8862] flex flex-col gap-20 py-4 px-6'>
            <h1 className='text-white text-3xl self-center'>Hotel</h1>
            <ul className='flex flex-col gap-4 text-white'>
                <Link href='/booking'>
                    <li className='flex items-center py-4 gap-6 cursor-pointer'>
                        <Image src='/Booking_icon.svg' width={28} height={30} alt='Booking'/>
                        <span >Бронирования</span>
                    </li>
                </Link>
                <Link href='/clients'>
                    <li className='flex items-center py-4 gap-6 cursor-pointer'>
                        <Image src='/Clients_icon.svg' width={28} height={30} alt='Booking'/>
                        <span>Клиенты</span>
                    </li>
                </Link>
                <Link href='/help'>
                    <li className='flex items-center py-4 gap-6 cursor-pointer'>
                        <Image src='/Hellp_icon.svg' width={28} height={30} alt='Booking'/>
                        <span>Услуги</span>
                    </li>
                </Link>
                <Link href='/rooms'>
                    <li className='flex items-center py-4 gap-6 cursor-pointer'>
                        <Image src='/Rooms_icon.svg' width={28} height={30} alt='Booking'/>
                        <span>Номера</span>
                    </li>
                </Link>
            </ul>
        </aside>
    )
}