import { Alert, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api/apis";
import { useUser } from "../../storage/UserContext";
import type { Order } from "../../data/dto";

const MyOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isError, setIsError] = useState(false);
    const user = useUser();

    useEffect(() => {
        api.order.getMyOrders(user.userId!)
            .then(arr => setOrders(arr))
            .catch(err => setIsError(true));
    }, []);

    console.log(orders);

    return (
        <Stack>
            {isError &&
                <Alert severity="error">Loading error. Try later</Alert>}

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Elements</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Phone number</TableCell>
                        <TableCell>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell>
                                <ul>
                                    {order.elements.map(e => (
                                        <li key={e.elementId}>
                                            <Stack direction="row" alignItems="center">
                                                <Typography sx={{ fontSize: '0.8em' }}>({e.uniqueCode})</Typography>
                                                <Typography sx={{ fontSize: '1.2em' }}>{e.name}</Typography>
                                                <Typography sx={{ ml: 2, fontSize:'1em' }}>x{e.count}</Typography>
                                            </Stack>
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell>{order.address}</TableCell>
                            <TableCell>{order.phoneNumber}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Stack>
    );
}

export default MyOrdersPage;