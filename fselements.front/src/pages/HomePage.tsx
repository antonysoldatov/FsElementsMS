import { useEffect, useState } from "react";
import { fetchAllCategories, fetchAllForms, useForms, useFormsDispatch, type FormsState } from "../storage/FormsContext";
import { Alert, Box, Button, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import type { Element, ElementForm } from "../data/dto";
import api from "../api/apis";
import NumberField from "../components/NumberField";
import { useOrderDispatch } from "../storage/OrderContext";

function HomePage() {
    const formsState = useForms();
    const formsDispatch = useFormsDispatch();
    const orderDispatch = useOrderDispatch();
    const [isError, setIsError] = useState(false);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [formId, setFormId] = useState<string | null>(null);
    const [formFiltered, setformFiltered] = useState<ElementForm[]>([]);
    const [elements, setElements] = useState<Element[]>([]);    

    useEffect(() => {
        if (formsState.categories.length == 0) {
            fetchAllCategories(formsDispatch);
        }
        if (formsState.forms.length == 0) {
            fetchAllForms(formsDispatch);
        }
    }, []);

    useEffect(() => {
        if (formsState.forms.length != 0 && formsState.categories.length != 0) {
            setCategoryId(formsState.categories[0].id!);
            setformFiltered(formsState.forms.filter(f => f.elementCategoryId == formsState.categories[0].id));
            setFormId(null);
        }
    }, [formsState.categories, formsState.forms]);

    useEffect(() => {
        loadElements();
    }, [formId, categoryId]);

    const loadElements = () => {
        api.elements.getElements(categoryId, formId)
            .then(items => {
                setElements(items);
            })
            .catch(r => { setIsError(true); });
    }

    const handleCategoryChange = (categoryId: string) => {
        setCategoryId(categoryId);
        setformFiltered(formsState.forms.filter(f => f.elementCategoryId == categoryId));
        setFormId(null);
    };

    const handleFormChange = (formId: string | null) => {
        setFormId(formId);
    }

    const handleBuyClick = (item: Element, count: number) => {
        orderDispatch({ type: 'Add', element: { elementId: item.id!, count: count, sellerId: item.sellerId } });
    }

    return (
        <Stack alignItems="center">
            {isError &&
                <Alert severity="error">Loading error. Try later</Alert>}

            {categoryId &&
                <Stack width={300}>
                    <InputLabel id="cat-select-label">Category</InputLabel>
                    <Select value={categoryId} label="Category" labelId="cat-select-label"
                        onChange={(e) => handleCategoryChange(e.target.value)}>
                        {formsState.categories.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                </Stack>
            }

            {formFiltered.length != 0 &&
                <Box overflow="auto" mt={2}>
                    <Stack direction="row">
                        <Box sx={{
                            width: 50,
                            height: 50,
                            m: 1,
                            border: formId == null ? '2px solid blue' : '1px solid grey',
                        }}
                            onClick={() => handleFormChange(null)}
                        >
                            <Typography fontSize={14} textAlign="center">All forms</Typography>
                        </Box>
                        {formFiltered.map(f =>
                            <Box key={f.id} component="img" src={f.image} onClick={() => handleFormChange(f.id)}
                                sx={{
                                    width: 50,
                                    height: 50,
                                    m: 1,
                                    border: formId == f.id ? '2px solid blue' : '',
                                }}>
                            </Box>
                        )}
                    </Stack>
                </Box>
            }

            <Stack direction="row" flexWrap="wrap">
                {elements.map(item =>
                    <ElementItemView key={item.id} item={item} formsState={formsState} onBuyClick={c => handleBuyClick(item, c)} />
                )}
            </Stack>

        </Stack>
    );
}

interface ElementItemViewProps {
    item: Element;
    formsState: FormsState;
    onBuyClick: (count: number) => void;
}

const ElementItemView = ({ item, formsState, onBuyClick }: ElementItemViewProps) => {
    const [count, setCount] = useState(1);
    const form = formsState.forms.find(f => f.id == item.elementFormId);

    return (
        <Stack key={item.id} direction="column"
            sx={{
                width: 300,
                border: '1px solid gray',
                m: 1,
                p: 1,
            }}>
            <Stack direction="row" alignItems="center">
                <Typography>({item.uniqueCode})</Typography>
                <Typography variant="h6">{item.name}</Typography>
            </Stack>
            <Stack direction="row">
                <Box component="img"
                    sx={{ width: 100, mr: 1 }}
                    src={form?.image}>
                </Box>
                <Stack direction="column">
                    <Typography>Price: {item.priceWholesale}/{item.priceRetail}</Typography>
                    <Typography>Size: {item.width}*{item.height}</Typography>
                    <Typography>Weight: {item.weight}</Typography>
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
                            value={count}
                            onChange={e => setCount(parseInt(e.target.value))}                            
                        />
                        <Button variant="outlined" size="small" color="primary" onClick={() => onBuyClick(count)}>Buy</Button>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default HomePage;