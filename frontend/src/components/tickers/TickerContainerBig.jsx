import TickerCoreInfo from '@/components/tickers/TickerCoreInfo';
import colors from '@/utils/colors';

import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';

Chart.register(...registerables);
Chart.register(annotationPlugin);

function parseValues(inputArray) {
    return inputArray.map(item => {
        return {
            ...item,
            close: parseFloat(item.close),
            datetime: new Date(item.datetime).getTime(),
            high: parseFloat(item.high),
            low: parseFloat(item.low),
            open: parseFloat(item.open),
            volume: parseFloat(item.volume, 10), // Assuming volume should be an integer
        };
    });
}
const TickerContainerBig = ({ ticker_data }) => {
    let { values: time_series } = ticker_data.symbol.price_data;

    let currentPrice = parseFloat(time_series[0].close);
    let eodPrice = ticker_data.symbol.eod_data.close;
    let priceVariation = currentPrice - eodPrice;

    let isPositive = priceVariation > 0;

    // Colors
    let main_color = isPositive ? colors.green[500] : colors.red[500];
    let main_color_light = isPositive ? colors.green[700] : colors.red[700];

    time_series = parseValues(time_series);
    time_series.sort((a, b) => a.datetime - b.datetime);

    let date_labels = time_series.map(item => item.datetime);
    let data = time_series.map(item => item.close);

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
                pointRadius: 1, // This line hides the data points
                borderWidth: 1,
                tension: 1.2,
            },
        ],
    };
    let highValues = time_series.map(item => item.high);
    let minHighValue = Math.min(...highValues);
    minHighValue -= minHighValue * 0.03;
    let maxHighValue = Math.max(...highValues);
    maxHighValue += maxHighValue * 0.03;

    const options = {
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

export default TickerContainerBig;
