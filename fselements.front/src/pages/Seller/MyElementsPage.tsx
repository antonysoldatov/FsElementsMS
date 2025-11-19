import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from "@mui/material";
import { fetchAllCategories, fetchAllForms, useForms, useFormsDispatch, type FormsState } from "../../storage/FormsContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Element } from "../../data/dto";
import api from "../../api/apis";
import { useUser } from "../../storage/UserContext";

const MyElementsPage = () => {
    const navigate = useNavigate();
    const formsState = useForms();
    const formsDispatch = useFormsDispatch();
    const user = useUser();
    const [elements, setElements] = useState<Element[]>([]);
    const [isError, setIsError] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

    useEffect(() => {
        if (formsState.categories.length == 0) {
            fetchAllCategories(formsDispatch);
        }
        if (formsState.forms.length == 0) {
            fetchAllForms(formsDispatch);
        }
        if (!elements || elements.length == 0) {
            loadElements();
        }
    }, []);

    const loadElements = () => {
        api.elements.getElementsBySeller(user.userId!)
            .then(arr => setElements(arr))
            .catch(r => setIsError(true));
    };

    const onEditClick = (element: Element) => {
        navigate("/sellereditelement/" + element.id);
    };

    const onDeleteClick = (element: Element) => {
        setDeleteItemId(element.id!);
    };

    const handleDelete = () => {
        setDeleteItemId(null);
        api.elements.deleteElement(deleteItemId!)
            .then(() => {
                loadElements();
            })
            .catch(r => setIsError(true));
    };

    return (
        <Stack>
            {isError &&
                <Alert severity="error">Loading error. Try later</Alert>}
            <Typography variant="h4" sx={{ mb: 1 }}>My Elements Page</Typography>
            <Stack direction="row">
                <Button variant="contained" onClick={() => navigate("/sellereditelement")}>Add</Button>
            </Stack>

            {elements.length != 0 && formsState.forms.length != 0 && formsState.categories.length != 0 &&
                <Stack direction="row" flexWrap="wrap">
                    {elements.map(item => getElementItemView(item, formsState,
                        () => onEditClick(item),
                        () => onDeleteClick(item),
                    ))}
                </Stack>
            }

            <Dialog
                open={deleteItemId !== null}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>
                    {"Delete item"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to delete this item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete}>Ok</Button>
                    <Button onClick={() => setDeleteItemId(null)} autoFocus>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

const getElementItemView = (item: Element, formsState: FormsState, onEditClick: () => void, onDeleteClick: () => void) => {
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
                        <Button variant="outlined" size="small" color="primary" onClick={() => onEditClick()}
                            sx={{ mr: 1 }}>Edit</Button>
                        <Button variant="outlined" size="small" color="error" onClick={() => onDeleteClick()}>Delete</Button>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default MyElementsPage;