import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import React from 'react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userSliceActions } from '@/redux/slices/userSlice';
import { tickerSliceActions } from '@/redux/slices/tickerSlice';
import supabase from '@/utils/supabase/client';
import { useNavigate, Navigate } from 'react-router-dom';

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
});

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async form_data => {
        setLoading(true);
        const { email, password } = form_data;
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setLoading(false);
            toast.error(error.message);

            return;
        }
        dispatch(userSliceActions.setUserSession(data.session));
        dispatch(tickerSliceActions.updateTickers());

        setLoading(false);
        navigate('/live/dashboard');
    };
    if (user.session) {
        return <Navigate to="/live/dashboard" />;
    }

    return (
        <Form {...form}>
            <form
                className="rounded-md border border-gray-700 bg-gray-800/30 px-10 py-10 shadow-lg shadow-gray-800 drop-shadow-lg"
                onSubmit={form.handleSubmit(onSubmit)}
                id="contactUs"
            >
                <h1 className=" whitespace-nowrap text-3xl font-bold">Please Login</h1>

                <div className="flex flex-row items-center justify-center gap-x-10">
                    <div className="mt-10 w-full">
                        <FormField
                            key="email"
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>{'Email'}</FormLabel>
                                    <FormControl>
                                        <Input className="text-gray-800" type="email" {...field} />
                                    </FormControl>
                                    {fieldState.error && (
                                        <FormMessage>{fieldState.error.message}</FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            key="password"
                            control={form.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>{'Contraseña'}</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="text-gray-800"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    {fieldState.error && (
                                        <FormMessage>{fieldState.error.message}</FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="mt-5 flex flex-col gap-y-3">
                    <Button
                        className={`mt-4 w-full bg-green-600 hover:bg-green-700 `}
                        disabled={loading}
                        type="submit"
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default LoginForm;
