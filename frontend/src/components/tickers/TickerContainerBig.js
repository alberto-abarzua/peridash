import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid , Box,Container} from "@mui/material";
import { Line } from "react-chartjs-2";
import styles from "./TickerContainerBig.module.css";

import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const TickerContainerBig = () => {
    // Dummy data
    const [data, setData] = useState({
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                label: "Stock Price",
                data: [12, 19, 3, 5, 2, 3],
                fill: false,
                pointRadius: 0, // This line removes the dots
                backgroundColor: "rgb(75, 192, 192)",
                borderColor: "#E63832",
            },
        ],
    });

    const [currentPrice, setCurrentPrice] = useState(0);
    const [priceVariation, setPriceVariation] = useState(0);
    const [percentageVariation, setPercentageVariation] = useState(0);

    useEffect(() => {
        // Fetch data from API and update state here
    }, []);

    const options = {
        scales: {
            y: {
                display: false,

                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    color: "white",
                },
            },
            x: {
                display: false,

                grid: {
                    display: false,
                },
                ticks: {
                    color: "white",
                },
            },
        },
        plugins: {
            legend: {
                display: false,
                labels: {
                    color: "white",
                },
            },
        },
    };

    return (
        // <Box sx={{  mt: "1rem", p: "5rem", borderRadius: '16px', display: "grid" }}>
        // <Box xs={12} sm={6} md={4} lg={3}>
        <Box width={1/2} p={2} >
        
            <Card className={styles.container}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="h5" component="div">
                                Stock Name
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h5" component="div">
                                Current Price: {currentPrice}
                            </Typography>
                            <Typography variant="body2">
                                {priceVariation}
                            </Typography>
                            <Typography >
                                Percentage Variation: {percentageVariation}%
                            </Typography>
                        </Grid>
                    </Grid>

                    <Line data={data} options={options} />
                </CardContent>
            </Card>
        </Box>
    );
};

export default TickerContainerBig;
