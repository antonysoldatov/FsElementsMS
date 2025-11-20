import { Alert, Box, Button, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllCategories, fetchAllForms, useForms, useFormsDispatch } from "../../storage/FormsContext";
import { useUser } from "../../storage/UserContext";
import { useEffect, useState } from "react";
import type { Element, ElementForm } from "../../data/dto";
import api from "../../api/apis";

const AddEditElementPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const formsState = useForms();
    const formsDispatch = useFormsDispatch();
    const user = useUser();
    const [element, setElement] = useState<Element>();
    const [formsFiltered, setFormsFiltered] = useState<ElementForm[]>([]);
    const [isError, setIsError] = useState(false);

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
            if (params.id) {
                api.elements.getElementById(params.id)
                    .then(el => {
                        setFormsFiltered(formsState.forms.filter(f => f.elementCategoryId == el.categoryId));
                        setElement(el);
                    })
                    .catch(r => { setIsError(true); });
            } else {
                const categoryId = formsState.categories[0].id!;
                const forms = formsState.forms.filter(f => f.elementCategoryId == categoryId);
                const formId = forms[0].id!;
                setFormsFiltered(forms);
                setElement({
                    uniqueCode: '',
                    name: '',
                    priceWholesale: 0,
                    priceRetail: 0,
                    width: 0,
                    height: 0,
                    weight: 0,
                    categoryId: categoryId,
                    elementFormId: formId,
                    sellerId: user.userId!
                });
            }
        }

    }, [formsState.categories, formsState.forms]);

    const handleElementChange = (name: string, val: any) => {
        setElement({ ...element, [name]: val } as Element);
    };

    const handleCategoryChange = (id: string) => {
        const forms = formsState.forms.filter(f => f.elementCategoryId == id);
        setFormsFiltered(forms);
        setElement({
            ...element,
            categoryId: id,
            elementFormId: forms[0].id!
        } as Element);
    };

    const handleSave = () => {
        api.elements.saveElement(element!)
            .then(() => {
                navigate("/sellerelements");
            })
            .catch(r => { setIsError(true); });
    };

    console.log(element);

    return (
        <Stack>
            {isError &&
                <Alert severity="error">Loading error. Try later</Alert>}

            {element &&
                <Stack sx={{ maxWidth: 400, gap: 2 }}>
                    <Stack>
                        <InputLabel id="cat-select-label">Category</InputLabel>
                        <Select value={element?.categoryId} label="Category" labelId="cat-select-label"
                            onChange={(e) => handleCategoryChange(e.target.value)}>
                            {formsState.categories.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </Stack>

                    <Stack>
                        <InputLabel id="form-select-label">Form</InputLabel>
                        <Select value={element?.elementFormId} label="Form" labelId="form-select-label"
                            renderValue={(v) =>
                                <Box component="img" src={formsState.forms.find(f => f.id == v)?.image}
                                    sx={{ width: 50 }}>
                                </Box>
                            }
                            onChange={(e) => handleElementChange('elementFormId', e.target.value)}>
                            {formsFiltered.map(f => (
                                <MenuItem key={f.id} value={f.id}>
                                    <Box component="img" src={f.image}
                                        sx={{ width: 50 }}>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </Stack>

                    <TextField value={element.uniqueCode} label="Unique code"
                        onChange={e => handleElementChange('uniqueCode', e.target.value)} />

                    <TextField value={element.name} label="Name"
                        onChange={e => handleElementChange('name', e.target.value)} />

                    <Stack direction="row" sx={{ gap: 2 }}>
                        <TextField value={element.priceRetail} label="Price retail"
                            onChange={e => handleElementChange('priceRetail', Number(e.target.value))} />

                        <TextField value={element.priceWholesale} label="Price wholesale"
                            onChange={e => handleElementChange('priceWholesale', Number(e.target.value))} />
                    </Stack>

                    <Stack direction="row" sx={{ gap: 2 }}>
                        <TextField value={element.width} label="Width"
                            onChange={e => handleElementChange('width', Number(e.target.value))} />

                        <TextField value={element.height} label="Height"
                            onChange={e => handleElementChange('height', Number(e.target.value))} />
                    </Stack>

                    <TextField value={element.weight} label="Weight"
                        onChange={e => handleElementChange('weight', Number(e.target.value))} />

                    <Button variant="contained" onClick={() => handleSave()}>Save</Button>

                </Stack>
            }
        </Stack>
    );
};

export default AddEditElementPage;