'use client';

import {FormEvent, useEffect, useState} from "react";
import Modal from "@/components/modal/modal";
import Input from "@/components/input/input";

export default function HelpPage() {
    const [visible, setVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentServiceId, setCurrentServiceId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        text: '',
        price: '',
    });
    const [allServices, setAllServices] = useState([
        {id: 1, title: 'Добавить детскую кровать', text: 'Предоставление дополнительной детской кровати в номер', price: 500},
        {id: 2, title: 'Завтрак в номер', text: 'Доставка завтрака в номер', price: 300},
        {id: 3, title: 'Уборка номера', text: 'Ежедневная уборка номера', price: 100},
    ]);
    const [filteredServices, setFilteredServices] = useState(allServices);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery]);

    useEffect(() => {
        if (!debouncedQuery) {
            setFilteredServices(allServices);
            return;
        }

        const filtered = allServices.filter(service =>
            service.title.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        setFilteredServices(filtered);
    }, [allServices, debouncedQuery]);

    function onClose() {
        setVisible(false);
        setEditMode(false);
        setCurrentServiceId(null);
        setFormData({
            title: '',
            text: '',
            price: '',
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const deleteService = (id: number) => {
        const updatedServices = allServices.filter(service => service.id !== id);
        setAllServices(updatedServices);
    }

    const editService = (service: typeof allServices[0]) => {
        setFormData({
            title: service.title,
            text: service.text,
            price: service.price.toString(),
        });
        setCurrentServiceId(service.id);
        setEditMode(true);
        setVisible(true);
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const serviceData = {
            id: editMode ? currentServiceId! : Date.now(),
            title: formData.title,
            text: formData.text,
            price: Number(formData.price)
        };

        if (editMode) {
            setAllServices(allServices.map(service =>
                service.id === currentServiceId ? serviceData : service
            ));
        } else {
            setAllServices([...allServices, serviceData]);
        }

        setFormData({
            title: '',
            text: '',
            price: '',
        });
        onClose();
    };

    return (
        <div className='flex flex-col gap-9'>
            {visible && (
                <Modal onClose={onClose}>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                        <Input
                            id='title'
                            label="Название"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        <Input
                            id='text'
                            label="Описание"
                            value={formData.text}
                            onChange={handleChange}
                        />
                        <Input
                            id='price'
                            label="Цена"
                            value={formData.price}
                            onChange={handleChange}
                        />
                        <button type="submit" className='cursor-pointer hover:text-green-500 duration-300 w-fit self-center'>
                            Создать
                        </button>
                    </form>
                </Modal>
            )}
            <h1 className='text-4xl font-medium'>
                Услуги
            </h1>

            <div className='w-full flex gap-4 items-center pr-60'>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по названию услуги..."
                    className='w-full border border-[#DEE2E6] bg-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#5E8862] focus:border-transparent'
                />
                <button
                    onClick={() => {
                        setEditMode(false);
                        setVisible(true);
                    }}
                    className='bg-[#5E8862] cursor-pointer px-24 py-2 text-white'
                >
                    Добавить
                </button>
            </div>

            <div className='flex items-center flex-col gap-6'>
                {filteredServices.map(service => (
                    <div key={service.id} className='py-4 px-6 w-[1240] border gap-10 flex flex-col bg-[#D0E6D2] items-center'>
                        <div className='flex flex-col text-center'>
                            <h1 className='text-3xl font-medium'>{service.title}</h1>
                            <h2 className='text-xl'>{service.text}</h2>
                        </div>
                        <div className='flex gap-45 w-full'>
                            <div className='flex gap-10'>
                                <button
                                    onClick={() => editService(service)}
                                    className='w-[365] bg-[#5E8862] cursor-pointer text-white'
                                >
                                    Изменить
                                </button>
                                <button
                                    onClick={() => deleteService(service.id)}
                                    className='w-[365] bg-[#A64851] cursor-pointer text-white'
                                >
                                    Удалить
                                </button>
                            </div>
                            <button className='text-3xl font-medium'>{service.price} ₽</button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}