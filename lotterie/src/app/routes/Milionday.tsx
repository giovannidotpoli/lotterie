import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectEstrazioniMilionDay, fetchData } from '../redux/lotterieSlice';
import { AppDispatch } from '../redux/store';
import Table from 'react-bootstrap/Table';
import YearSelector from '../components/YearSelector';

const Milionday = () => {
    const dispatch = useDispatch<AppDispatch>();
    const estrazioni = useSelector(selectEstrazioniMilionDay);
    const thisYear = new Date().getFullYear();
    
    const selectDate = (evt:any) => {
        dispatch(fetchData({type:'milionday',year:String(evt.target.value)}));
    }

    useEffect(() => {
        dispatch(fetchData({type:'milionday',year: thisYear}));
    }, [thisYear,dispatch]);

    return (
        <>
            <YearSelector end={1939} selectDate={selectDate} />
            <Table striped bordered hover className='table_lotto w-60 m-auto'>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Orario</th>
                        <th>Numeri estratti</th>
                        <th>Numeri Extra</th>
                    </tr>
                </thead>
                <tbody>
                    {estrazioni.map((el:any) =>  {
                        return(
                            <tr key={`${el.data}${el.concorso}`}>
                                <td>{el.data}</td>
                                <td>{el.orario}</td>
                                <td>{el.numeri}</td>
                                <td>{el.extra}</td>
                             </tr>
                        )
                        })}
                </tbody>
            </Table>
        </>
    );
}

export default Milionday;