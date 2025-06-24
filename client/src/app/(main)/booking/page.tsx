'use client';

import {useEffect, useState} from "react";
import {IBoking} from "@/types/types";
import {BookingService, ClientService, RoomService} from "@/services/inex";
import Modal from "@/components/modal/modal";
import Input from "@/components/input/input";


const typeTranslations: Record<string, string> = {
    'SINGLE': 'Одноместная',
    'DOUBLE': 'Двухместная',
    'TRIPLE': 'Трёхместная',
};

const categoryTranslations: Record<string, string> = {
    'STANDARD': 'Стандарт',
    'DELUXE': 'Люкс',
    'COMFORT': 'Комфорт',
};
const tabs = ['Сегодня', 'За неделю', 'За месяц', 'За год', 'За всё время'];

export default function BookingPage() {
    const [bookings, setBookings] = useState<IBoking[] | null>(null);
    const [clients, setClients] = useState<IClient[] | null>(null);
    const [rooms, setRooms] = useState<IRoom[] | null>(null);

    const [formData, setFormData] = useState({
        clientId: '',
        roomId: '',
        startDate: '',
        endDate: '',
    });

    const [activeTab, setActiveTab] = useState('За всё время');
    const [visible, setVisible] = useState(false);

    const bookingService = new BookingService();
    const clientService = new ClientService();
    const roomService = new RoomService();

    function onClose() {
        setVisible(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await bookingService.createBooking({
                clientId: Number(formData.clientId),
                roomId: Number(formData.roomId),
                startDate: formData.startDate,
                endDate: formData.endDate,
            });
            await fetchBookings();
            onClose();
        } catch (error) {
            console.error('Ошибка при создании бронирования:', error);
        }
    };

    const fetchBookings = async () => {
        try {
            const data = await bookingService.getAllBookings();
            setBookings(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchClients = async () => {
        try {
            const data = await clientService.getAllClients();
            setClients(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRooms = async () => {
        try {
            const data = await roomService.getAllRooms();
            setRooms(data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateBookingStatus = async (id: number, status: string) => {
        try {
            if (status === 'CANCELLED') {
                await bookingService.updateBookingStatus(id, {status: 'CONFIRMED'});
            } else {
                await bookingService.cancelBooking(id);
            }
            fetchBookings()

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchBookings()
        fetchClients()
        fetchRooms()
    }, [])

    return (
        <div className='flex flex-col gap-9'>
            {visible && (
                <Modal onClose={onClose}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 w-full max-w-md bg-white rounded shadow">
                        <label className="text-sm font-medium text-gray-700">
                            Клиент
                            <select
                                value={formData.clientId}
                                onChange={e => setFormData({...formData, clientId: e.target.value})}
                                className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                            >
                                <option>Выберите клиента</option>
                                {clients?.map(client => (
                                    <option
                                        disabled={client.Booking.length > 0}
                                        key={client.id}
                                        value={client.id}
                                    >
                                        {client.lastName} {client.firstName} {client.middleName}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="text-sm font-medium text-gray-700">
                            Комната
                            <select
                                value={formData.roomId}
                                onChange={e => setFormData({...formData, roomId: e.target.value})}
                                className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                            >
                                <option>Выберите комнату</option>
                                {rooms?.map(room => (
                                    <option
                                        disabled={!room.isAvailable}
                                        key={room.id}
                                        value={room.id}
                                    >
                                        {room.number} {typeTranslations[room.type]} {categoryTranslations[room.category]}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <Input
                            id="startDate"
                            label="Дата заселения"
                            type="date"
                            value={formData.startDate}
                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                        />
                        <Input
                            id="endDate"
                            label="Дата выселения"
                            type="date"
                            value={formData.endDate}
                            onChange={e => setFormData({...formData, endDate: e.target.value})}
                        />

                        <button
                            type="submit"
                            className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-200 self-center"
                        >
                            Создать
                        </button>
                    </form>
                </Modal>
            )}
            <h1 className='text-4xl font-medium'>
                Бронирования
            </h1>

            <div className="flex border w-fit border-[#c3d3c0] rounded overflow-hidden bg-[#f9f9f4] text-sm">
                {tabs.map((tab, index) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-10 py-2 border-r border-[#c3d3c0] text-[#4b5f4b] transition-colors duration-200
            ${activeTab === tab ? 'bg-[#5f8762] text-white' : 'hover:bg-[#e8f0e5]'}
            ${index === tabs.length - 1 ? 'border-r-0' : ''}
          `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex gap-2 p-2 bg-[#f4f4ef]">
                <input
                    type="text"
                    placeholder="Найти"
                    className="px-3 py-1 rounded border bg-white w-[370] border-gray-300 text-sm outline-none focus:ring focus:ring-green-200"
                />
                <button onClick={() => setVisible(true)} className="bg-[#5E8862] w-[265] text-white px-4 py-1 rounded text-sm hover:bg-green-800">
                    Добавить
                </button>
            </div>

            <div className='bg-white rounded-lg shadow overflow-hidden'>
                <div className='max-h-[500px] overflow-y-auto'>
                    <table className='w-full'>
                        <thead className="sticky top-0 bg-white z-10">
                        <tr className='text-left border-b'>
                            <th className='p-2'>Клиент</th>
                            <th className='p-2'>Комната</th>
                            <th className='p-2'>Тип</th>
                            <th className='p-2'>Вместимость</th>
                            <th className='p-2'>Стоимость</th>
                            <th className='p-2'>Дата заселения</th>
                            <th className='p-2'>Дата выселения</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings?.map(booking => (
                            <tr
                                key={booking.id}
                                className={`border-b hover:bg-gray-50 ${
                                    booking.status === "CANCELLED" ? 'bg-red-100 text-gray-500 line-through' : ''
                                }`}
                            >
                                <td className='p-2'>{booking.client.firstName}</td>
                                <td className='p-2'>{booking.room.number}</td>
                                <td className='p-2'>{typeTranslations[booking.room.type] || booking.room.type}</td>
                                <td className='p-2'>{categoryTranslations[booking.room.category] || booking.room.category}</td>
                                <td className='p-2'>{booking.totalPrice} ₽</td>
                                <td className='p-2'>{new Date(booking.startDate).toLocaleDateString('ru-RU')}</td>
                                <td className='p-2'>{new Date(booking.endDate).toLocaleDateString('ru-RU')}</td>
                                <td className='p-2'>
                                    <button
                                        onClick={() => updateBookingStatus(booking.id, booking.status)}
                                        className={`
        px-4 py-2 rounded-md font-medium text-white
        ${booking.status === 'CANCELLED'
                                            ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
                                            : 'bg-rose-600 hover:bg-rose-700 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2'
                                        }
        transition-all duration-200 ease-in-out
        transform hover:scale-[1.02] active:scale-[0.98]
        shadow-md hover:shadow-lg
        focus:outline-none
    `}
                                    >
                                        {booking.status === 'CANCELLED' ? 'Восстановить' : 'Отменить бронь'}
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