import api from '@/utils/api';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Save';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { tickerSliceActions } from '@/redux/tickerSlice';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '../ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormMessage,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
    favorite: z.boolean(),
    graph: z.boolean(),
    buy: z.coerce.number().min(0).default(0),
    gain: z.coerce.number().min(0).default(0),
    loss: z.coerce.number().min(0).default(0),
});

const UserTicker = ({ result }) => {
    const dispatch = useDispatch();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            favorite: result.ticker.is_favorite,
            buy: result.ticker.buy || 0,
            gain: result.ticker.gain || 0,
            loss: result.ticker.loss || 0,
            graph: result.ticker.show_graph,
        },
    });

    const onSubmit = useCallback(
        async data => {
            let response = await api.put(`/user_ticker/tickers/${result.ticker.id}`, {
                ticker_info: {
                    show_graph: data.graph,
                    is_favorite: data.favorite,
                    buy: data.buy,
                    gain: data.gain,
                    loss: data.loss,
                },
            });

            if (response.status === 200) {
                dispatch(tickerSliceActions.updateTickers());
                toast.success(`Updated Ticker ${result.symbol.symbol}`);
            } else {
                toast.error('Error updating ticker');
            }
        },
        [dispatch, result]
    );

    const handleDelete = useCallback(async () => {
        const response = await api.delete(`/user_ticker/tickers/`, {
            params: {
                ticker_id: result.ticker.id,
            },
        });

        if (response.status === 200) {
            dispatch(tickerSliceActions.updateTickers());
            toast.success(`Deleted Ticker ${result.symbol.symbol}`);
        }

        dispatch(tickerSliceActions.updateTickers());
    }, [result.ticker.id, result.symbol, dispatch]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="relative w-full  rounded-lg border border-gray-300 bg-white p-6 shadow-md lg:w-[500px]">
                    <div className="mb-6 flex items-center justify-between gap-x-4">
                        <h5 className=" text-md font-semibold lg:text-xl">
                            {result.symbol.symbol + ':' + result.symbol.exchange}
                        </h5>
                        <div className="flex items-center space-x-4">
                            <FormField
                                control={form.control}
                                name="favorite"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm">Favorite</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="graph"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm">Show Graph</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <button
                                onClick={handleDelete}
                                className="rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-500 focus:outline-none"
                            >
                                <DeleteIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    <div
                        className={`transition-all duration-500 ${
                            form.watch('favorite') ? 'block' : 'hidden'
                        }`}
                    >
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="buy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="ml-2 text-sm">Buy</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Buy"
                                                icon={<AttachMoneySharpIcon className="h-4 w-4" />}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gain"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="ml-2 text-sm">Gain</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Gain"
                                                icon={<AddIcon className="h-4 w-4" />}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="loss"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="ml-2 text-sm">Loss</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Loss"
                                                icon={<RemoveIcon className="h-4 w-4" />}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty}
                            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none"
                        >
                            <SaveIcon className="mr-2 h-4 w-4" /> Save
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};

UserTicker.propTypes = {
    result: PropTypes.object,
};

export default UserTicker;
