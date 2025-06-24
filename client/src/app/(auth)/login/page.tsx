'use client';
import {FormEvent, useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import Message from "@/components/message/message";

export default function LoginPage() {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    /** TODO
     * Сделать через JWT
     * Убрать any
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:4200/api/auth/login', {
                login,
                password
            });

            if (response.status >= 200 && response.status < 300) {
                router.push('/booking')
            }
        } catch (error: any) {
            console.error("Ошибка входа:", error);

            if (error.response) {
                setError(error.response.data.message || "Неверный логин или пароль");
            } else if (error.request) {
                setError("Сервер не отвечает");
            } else {
                setError("Ошибка при отправке запроса");
            }
        }
    };

    return (
        <div className=" flex justify-center items-center flex-col gap-6 ">
            {error && (
                <Message
                    text={error}
                    type="error"
                    duration={5000}
                />
            )}
            <h1 className="self-center text-2xl">Войти</h1>

            <form onSubmit={handleSubmit} className='w-90 flex flex-col gap-6'>
                <div className='flex flex-col gap-6'>
                    <label htmlFor='login'>Логин:</label>
                    <input
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        id='login'
                        className='bg-white py-1 px-3 border-[#D9D9D9] border-1 rounded'
                        type="text"
                        placeholder='xverlxrd1523'
                    />
                </div>
                <div className='flex flex-col gap-6'>
                    <label htmlFor='password'>Пароль:</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id='password'
                        className='bg-white py-1 px-3 border-[#D9D9D9] border-1 rounded'
                        type="password"
                    />
                </div>

                <button
                    className='self-start bg-[#5E8862] cursor-pointer text-white py-1 px-4'
                    type="submit"
                >
                    Войти
                </button>
            </form>
        </div>
    );
}