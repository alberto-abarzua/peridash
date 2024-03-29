import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { tickerSliceActions } from '@/redux/slices/tickerSlice';
import { toast } from 'sonner';

const formSchema = z.object({
    plot_range: z.coerce
        .number({ message: 'Plot range must be a number' })
        .min(1)
        .refine(value => value > 0 && value < 30, {
            message: 'Plot range must be between 1 and 30 days',
        }),
    carousel_time: z.coerce
        .number({ message: 'Plot range must be a number' })
        .min(1)
        .refine(value => value > 0 && value < 30, {
            message: 'Carousel time must be between 1 and 30 seconds',
        }),
    notification_email: z.string().min(4),
});

const UserSettingsForm = () => {
    const dispatch = useDispatch();
    const { userSettings } = useSelector(state => state.ticker);
    console.log('userSettings:', userSettings);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            plot_range: userSettings.plot_range.toString(),
            carousel_time: userSettings.carousel_time.toString(),
            notification_email: userSettings.notification_emails[0] || '',
        },
    });

    const onSubmit = async data => {
        const { notification_email, ...rest } = data;
        try {
            await api.put('/user_ticker/settings/', {
                new_settings: { ...rest, notification_emails: notification_email.split(',') },
            });
            toast.success('User settings updated');
            dispatch(tickerSliceActions.updateTickers());
        } catch (error) {
            console.error('Error updating user settings:', error);
            toast.error('Error updating user settings');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex w-full flex-col gap-5 px-4 lg:w-1/2">
                    <FormField
                        control={form.control}
                        name="plot_range"
                        render={({ field }) => (
                            <FormItem className="w-fit">
                                <FormLabel className="text-white">Plot Range (days)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="carousel_time"
                        render={({ field }) => (
                            <FormItem className="w-fit">
                                <FormLabel className="text-white">Transition Time</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value.toString()}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="notification_email"
                        render={({ field }) => (
                            <FormItem className="w-fit">
                                <FormLabel className="text-white">Notification Email</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} value={field.value.toString()} />
                                </FormControl>
                                <FormDescription className="text-gray-300">
                                    Can be multiple emails separated by commas
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={!form.formState.isDirty}>
                        Update Settings
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default UserSettingsForm;
