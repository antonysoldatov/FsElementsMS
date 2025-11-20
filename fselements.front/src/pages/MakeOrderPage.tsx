import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useOrder, useOrderDispatch } from "../storage/OrderContext";
import type { Element, ElementMakeOrder } from "../data/dto";
import api from "../api/apis";
import { useForms, type FormsState } from "../storage/FormsContext";
import { useNavigate } from "react-router-dom";

const MakeOrderPage = () => {
    const order = useOrder();
    const orderDispatch = useOrderDispatch();
    const formsState = useForms();
    const navigate = useNavigate();
    const [isError, setIsError] = useState(false);
    const [elements, setElements] = useState<Element[]>([]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const sellerGroups = Object.entries(Object.groupBy(order.elementsOrder, item => item.sellerId));

    useEffect(() => {
        const promises = order.elementsOrder.map(item => api.elements.getElementById(item.elementId));
        Promise.all(promises).then(arr => {
            setElements(arr);
        });
    }, []);

    const handleMakeOrder = () => {
        setIsError(false);

        const promises = sellerGroups.map(([sellerId, items]) =>
            api.order.makeOrder({ elements: items!, sellerId: sellerId, address: address, phoneNumber: phoneNumber }));

        Promise.all(promises)
            .then(() => {
                orderDispatch({ type: 'Clear' });
                navigate('/');
            })
            .catch(e => setIsError(true));
    };

    if (order.elementsOrder.length == 0) {
        return <Typography>Empty</Typography>
    }

    return (
        <Stack sx={{ maxWidth: 400, gap: 2 }}>
            {isError &&
                <Alert severity="error">Loading error. Try later</Alert>}

            {elements.length != 0 &&
                <Stack>
                    {sellerGroups.map(([sellerId, items], index) => (
                        <Stack key={sellerId}>
                            <Typography>Seller {index + 1}</Typography>
                            {items!.map((item) => (
                                <ElementItemView
                                    key={item.elementId}
                                    item={item}
                                    elements={elements}
                                    formsState={formsState}
                                    onCountChange={(c) => orderDispatch({ type: 'ChangeCount', elementId: item.elementId, count: c })}
                                    onDelete={() => orderDispatch({ type: 'Remove', elementId: item.elementId })}
                                />
                            ))}
                        </Stack>
                    ))}
                </Stack>
            }

            <TextField label="Phone number" variant="outlined" required
                value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}></TextField>
            <TextField label="Address" variant="outlined" required
                value={address} onChange={e => setAddress(e.target.value)}></TextField>
            <Button variant="contained" onClick={handleMakeOrder}>Make order</Button>
        </Stack>
    );
}

interface ElementItemViewProps {
    item: ElementMakeOrder;
    elements: Element[];
    formsState: FormsState;
    onCountChange: (newCount: number) => void;
    onDelete: () => void
}

const ElementItemView = ({ item, elements, formsState, onCountChange, onDelete }: ElementItemViewProps) => {
    const element = elements.find(e => e.id == item.elementId);
    const form = formsState.forms.find(f => f.id == element?.elementFormId);
    return (
        <Stack direction="column"
            sx={{
                width: '100%',
                border: '1px solid gray',
                p: 1,
            }}>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" alignItems="center">
                    <Typography>({element?.uniqueCode})</Typography>
                    <Typography variant="h6">{element?.name}</Typography>
                </Stack>
                <Button variant="outlined" size="small" color="error" onClick={() => onDelete()}>Delete</Button>
            </Stack>
            <Stack direction="row">
                <Box component="img"
                    sx={{ width: 100, mr: 1 }}
                    src={form?.image}>
                </Box>
                <Stack direction="column">
                    <Typography>Price: {element?.priceWholesale}</Typography>
                    <Typography>Size: {element?.width}*{element?.height}</Typography>
                    <Typography>Weight: {element?.weight}</Typography>
                    <Stack direction="row">
                        <TextField
                            type="number"
                            size="small"
                            sx={{
                                mr: 1
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                min: 1,
                                max: 100000,
                                step: 1,
                            }}
                            value={item.count}
                            onChange={e => onCountChange(parseInt(e.target.value))}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default MakeOrderPage;