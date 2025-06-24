'use client';

import {useEffect, useState} from "react";
import {IRoom} from "@/types/types";
import {RoomService} from "@/services/inex";

export default function RoomsPage() {
    const [rooms, setRooms] = useState<IRoom[] | null>(null);
    const [filteredRooms, setFilteredRooms] = useState<IRoom[] | null>(null);
    const [capacityFilter, setCapacityFilter] = useState<string>("");
    const [typeFilter, setTypeFilter] = useState<string>("");

    const roomService = new RoomService();

    const fetchClients = async () => {
        try {
            const data = await roomService.getAllRooms();
            setRooms(data);
            setFilteredRooms(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if (rooms) {
            let result = [...rooms];

            if (capacityFilter) {
                result = result.filter(room => room.type === capacityFilter);
            }

            if (typeFilter) {
                result = result.filter(room => room.category === typeFilter);
            }


            setFilteredRooms(result);
        }
    }, [capacityFilter, typeFilter, rooms]);

    return (
        <div className='flex flex-col gap-9'>
            <h1 className='text-4xl font-medium'>
                Номера
            </h1>

            <div className='w-full flex gap-4 items-center pr-60'>
                <select
                    className='w-full border border-[#DEE2E6] bg-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#5E8862] focus:border-transparent'
                    value={capacityFilter}
                    onChange={(e) => setCapacityFilter(e.target.value)}
                >
                    <option value="">Вместительность</option>
                    <option value="SINGLE">Одноместный</option>
                    <option value="DOUBLE">Двухместный</option>
                    <option value="TRIPLE">Трехместный</option>
                </select>
                <select
                    className='w-full border border-[#DEE2E6] bg-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#5E8862] focus:border-transparent'
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                >
                    <option value="">Тип комнаты</option>
                    <option value="STANDARD">Стандарт</option>
                    <option value="DELUXE">Люкс</option>
                    <option value="COMFORT">Комфорт</option>
                </select>
            </div>

            <div className='bg-white rounded-lg shadow overflow-hidden'>
                <div className='max-h-[500px] overflow-y-auto'>
                    <table className='w-full'>
                        <thead className="sticky top-0 bg-white z-10">
                        <tr className='text-left border-b'>
                            <th className='p-2'>Номер комнаты</th>
                            <th className='p-2'>Тип комнаты</th>
                            <th className='p-2'>Категория</th>
                            <th className='p-2'>Детская кровать</th>
                            <th className='p-2'>Статус</th>
                            <th className='p-2'>Цена за ночь</th>
                            <th className='p-2'>Действие</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRooms?.map(room => (
                            <tr key={room.id} className='border-b hover:bg-gray-50'>
                                <td className='p-2'>{room.number}</td>
                                <td className='p-2'>{room.type}</td>
                                <td className='p-2'>{room.category}</td>
                                <td className='p-2'>{room.hasChildBed ? 'Да' : 'Нет'}</td>
                                <td className='p-2'>{room.isAvailable ? 'Свободна' : 'Занята'}</td>
                                <td className='p-2'>{room.pricePerNight} ₽</td>
                                <td className='p-2 flex gap-2'>
                                    <button
                                        className='bg-[#A64851] cursor-pointer px-2 py-2 text-white rounded transition-colors duration-200'
                                    >
                                        Заблокировать
                                    </button>
                                    <button
                                        className='bg-[#5E8862] cursor-pointer px-2 py-2 text-white rounded transition-colors duration-200'
                                    >
                                        Активировать
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}