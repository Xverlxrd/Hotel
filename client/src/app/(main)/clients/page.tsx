'use client';
import {useEffect, useState} from "react";
import axios from "axios";

export default function ClientsPage() {
    const [clients, setClients] = useState<[]>()
    useEffect(() => {
        axios.get('http://localhost:4200/api/clients')
            .then(res => setClients(res.data))
    }, [])

    return (
        <div className='flex flex-col gap-9'>
            <h1 className='text-4xl font-medium'>
                Управление клиентами
            </h1>

            <div className='w-full flex gap-4 items-center pr-60'>
                <input className='w-full border-1 border-[#DEE2E6] bg-white'/>
                <button className='bg-[#5E8862] px-24 py-2 text-white'>
                    Добавить
                </button>
                <button className='bg-[#A64851] px-24 py-2 text-white'>
                    Удалить
                </button>
            </div>

            <div className='bg-white'>
            </div>
        </div>
    )
}