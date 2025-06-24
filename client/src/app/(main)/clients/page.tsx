'use client';
import {FormEvent, useEffect, useState} from "react";
import {IClient} from "@/types/types";
import {ClientService} from "@/services/inex";
import Modal from "@/components/modal/modal";
import Input from "@/components/input/input";

export default function ClientsPage() {
    const [clients, setClients] = useState<IClient[] | null>(null);
    const [visible, setVisible] = useState(false);
    const [filteredClients, setFilteredClients] = useState<IClient[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        phone: '',
        email: '',
        passport: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };
    const clientService = new ClientService();

    function onClose() {
        setVisible(false)
    }

    const fetchClients = async () => {
        try {
            setLoading(true);
            const data = await clientService.getAllClients();
            setClients(data);
        } catch (err) {
            setError('Ошибка при загрузке клиентов');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        await clientService.createClient(formData)
            .then(() => fetchClients())

        setFormData({
            firstName: '',
            lastName: '',
            middleName: '',
            phone: '',
            email: '',
            passport: ''
        })
        setVisible(false)
    };

    function deleteClient(id: number) {
        clientService.deleteClient(id).then(() => fetchClients());
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery]);

    useEffect(() => {
        if (!clients) return;

        if (!debouncedQuery) {
            setFilteredClients(clients);
            return;
        }

        const filtered = clients.filter(client =>
            Object.values(client).some(
                val => val &&
                    val.toString().toLowerCase().includes(debouncedQuery.toLowerCase())
            )
        );
        setFilteredClients(filtered);
    }, [clients, debouncedQuery]);

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <div className='flex flex-col gap-9'>
            {visible && (
                <Modal onClose={onClose}>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                        <Input
                            id='firstName'
                            label="Имя"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <Input
                            id='lastName'
                            label="Фамилия"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        <Input
                            id='middleName'
                            label="Отчество"
                            value={formData.middleName}
                            onChange={handleChange}
                        />
                        <Input
                            id='phone'
                            label="Номер телефона"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <Input
                            id='email'
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <Input
                            id='passport'
                            label="Номер паспорт"
                            value={formData.passport}
                            onChange={handleChange}
                        />
                        <button type="submit" className='cursor-pointer hover:text-green-500 duration-300 w-fit self-center'>
                            Создать
                        </button>
                    </form>
                </Modal>
            )}
            <h1 className='text-4xl font-medium'>
                Управление клиентами
            </h1>

            <div className='w-full flex gap-4 items-center pr-60'>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск клиентов..."
                    className='w-full border border-[#DEE2E6] bg-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#5E8862] focus:border-transparent'
                />
                <button onClick={() => setVisible(true)} className='bg-[#5E8862] cursor-pointer px-24 py-2 text-white'>
                    Добавить
                </button>
            </div>

            <div className='bg-white rounded-lg shadow overflow-hidden'>
                <div className='max-h-[500px] overflow-y-auto'> {/* Добавлен контейнер с фиксированной высотой и скроллом */}
                    <table className='w-full'>
                        <thead className="sticky top-0 bg-white z-10"> {/* Заголовок прилипает при скролле */}
                        <tr className='text-left border-b'>
                            <th className='p-2'>Имя</th>
                            <th className='p-2'>Фамилия</th>
                            <th className='p-2'>Отчество</th>
                            <th className='p-2'>Email</th>
                            <th className='p-2'>Телефон</th>
                            <th className='p-2'>Паспорт</th>
                            <th className='p-2'>Действие</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredClients?.map(client => (
                            <tr key={client.id} className='border-b hover:bg-gray-50'>
                                <td className='p-2'>{client.firstName}</td>
                                <td className='p-2'>{client.lastName}</td>
                                <td className='p-2'>{client.middleName ? client.middleName : 'Отсутствует'}</td>
                                <td className='p-2'>{client.email}</td>
                                <td className='p-2'>{client.phone}</td>
                                <td className='p-2'>{client.passport}</td>
                                <td className='p-2'>
                                    <button
                                        onClick={() => deleteClient(client.id)}
                                        className='bg-[#A64851] hover:bg-[#8a3a42] cursor-pointer px-2 py-2 text-white rounded transition-colors duration-200'
                                    >
                                        Удалить
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