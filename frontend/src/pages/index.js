import TickerContainerBig from "../components/tickers/TickerContainerBig";
import axios from "axios";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Container,
} from "@mui/material";

const DashPage = () => {
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
    //call server on indicators/user-ticker-list
    //get list of tickers

    // let response = axios
    //     .get(
    //         process.env.NEXT_PUBLIC_BACKEND_URL + "/indicators/user-ticker-list"
    //     )
    //     .then((response) => {
    //         console.log(response.data);
    //     });
    return (
        <div>
            <h1>Test home</h1>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TickerContainerBig />
                    <TickerContainerBig />
                    <TickerContainerBig />
                    <TickerContainerBig />
                    <TickerContainerBig />
                    <TickerContainerBig />
                </Grid>
                <Grid item xs={12} md={6}></Grid>
                <Grid item xs={12} md={6}></Grid>
                <Grid item xs={12} md={6}></Grid>
            </Grid>
        </div>
    );
};

export default DashPage;
