'use client';

import {useRouter} from "next/navigation";

export default function Header() {
    const router = useRouter()

    return (
        <header className='h-20 bg-[#5E8862] flex justify-end py-3 px-21'>
            <button
                onClick={() => router.push('/login')}
                className='
                flex justify-center
                items-center cursor-pointer
                px-11 py-5 text-white
                border-blue-400 border-1'
            >
                Выйти
            </button>
        </header>
    )
}