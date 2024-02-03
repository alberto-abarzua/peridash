import TickerCoreInfo from '@/components/tickers/TickerCoreInfo';
import colors from '@/utils/colors';

import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';

Chart.register(...registerables);
Chart.register(annotationPlugin);
const TickerContainerBig = ({ ticker_data }) => {
    useEffect(() => {
        // here update the chart
    }, [ticker_data]);

    let currentPrice = ticker_data.cur_price.toFixed(2);
    let isPositive = ticker_data.price_dif > 0;
    // let main_color = isPositive ? 'rgba(5, 150, 105, 1)' : 'rgba(220, 38, 38, 0.1)'; // green-600 and red-600 in rgba format
    let main_color = isPositive ? colors.green[500] : colors.red[500];
    // let main_color_light = isPositive ? 'rgba(0, 255, 61, 0.8)' : 'rgba(255, 25, 25, 0.8)'; // green-300 and red-300 in rgba format
    let main_color_light = isPositive ? colors.green[700] : colors.red[700];
    let rawData = Object.entries(ticker_data.df.datetime).map(([, date], index) => ({
        date: new Date(date),
        value: ticker_data.df.close[index],
    }));

    // Sort the data by date
    rawData.sort((a, b) => a.date - b.date);

    // Split back into separate arrays for the labels and data
    let date_labels = rawData.map(item => item.date);
    let data = rawData.map(item => item.value);

    const canvas = document.createElement('canvas');

    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, main_color_light);
    gradient.addColorStop(0.04, main_color_light);
    gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    const chartData = {
        labels: date_labels,
        datasets: [
            {
                label: 'Close Prices',
                data: data,
                fill: 'origin',
                backgroundColor: gradient,
                borderColor: main_color,
                pointRadius: 0, // This line hides the data points
                borderWidth: 1,
                tension: 1.2,
            },
        ],
    };
    const highValues = Object.values(ticker_data.df.high);
    let minHighValue = Math.min(...highValues);
    minHighValue -= minHighValue * 0.03;
    let maxHighValue = Math.max(...highValues);
    maxHighValue += maxHighValue * 0.03;

    const options = {
        // maintainAspectRatio: false,
        scales: {
            y: {
                min: minHighValue,
                max: maxHighValue,
                display: false,
                beginAtZero: false,
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'white',
                },
            },
            x: {
                display: false,
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'white',
                },
            },
        },
        plugins: {
            legend: {
                display: false,
                labels: {
                    color: 'white',
                },
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: currentPrice,
                        yMax: currentPrice,
                        borderColor: 'rgba(156, 163, 175, 1)', // gray-400
                        borderWidth: 1.2,
                        borderDash: [6, 6],
                    },
                    line2: {
                        type: 'line',
                        yMin: ticker_data.ticker.buy,
                        yMax: ticker_data.ticker.buy,
                        borderColor: 'rgba(252, 211, 77, 1)', // yellow-400
                        borderWidth: 1.2,
                        borderDash: [6, 6],
                    },
                    line3: {
                        type: 'line',
                        yMin: ticker_data.ticker.gain,
                        yMax: ticker_data.ticker.gain,
                        borderColor: 'rgba(59, 130, 246, 1)', // blue-400 as a replacement for aqua
                        borderWidth: 1.2,
                        borderDash: [6, 6],
                    },
                    line4: {
                        type: 'line',
                        yMin: ticker_data.ticker.loss,
                        yMax: ticker_data.ticker.loss,
                        borderColor: 'rgba(167, 139, 250, 1)', // purple-400
                        borderWidth: 1.2,
                        borderDash: [6, 6],
                    },
                },
            },
        },
    };

    return (
        <div className=" max-h-96">
            <div className="rounded bg-darker-600 p-0 text-white ">
                <TickerCoreInfo ticker_data={ticker_data}></TickerCoreInfo>
                <div>
                    <Line className="m-0 p-0" data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
};

TickerContainerBig.propTypes = {
    ticker_data: PropTypes.shape({
        cur_price: PropTypes.number.isRequired,
        price_dif: PropTypes.number.isRequired,
        price_dif_percent: PropTypes.number.isRequired,
        df: PropTypes.object.isRequired,
        ticker: PropTypes.shape({
            symbol: PropTypes.PropTypes.shape({
                name: PropTypes.string.isRequired,
                symbol: PropTypes.string.isRequired,
                exchange: PropTypes.string.isRequired,
            }),
            is_favorite: PropTypes.bool.isRequired,
            buy: PropTypes.number.isRequired,
            gain: PropTypes.number.isRequired,
            loss: PropTypes.number.isRequired,
        }),
    }),
};

export default TickerContainerBig;
