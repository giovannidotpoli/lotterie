import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectEstrazioniSuperEnalotto, fetchData } from '../redux/lotterieSlice';
import { AppDispatch } from '../redux/store';
import Table from 'react-bootstrap/Table';
import YearSelector from '../components/YearSelector';

const Superenalotto = () => {
    const dispatch = useDispatch<AppDispatch>();
    const estrazioni = useSelector(selectEstrazioniSuperEnalotto);
    const thisYear = new Date().getFullYear();
    
    const selectDate = (evt:any) => {
        dispatch(fetchData({type:'superenalotto',year:String(evt.target.value)}));
    }

    useEffect(() => {
        dispatch(fetchData({type:'superenalotto',year: thisYear}));
    }, [thisYear,dispatch]);

    return (
        <>
            <YearSelector end={1997} selectDate={selectDate} />
            <Table striped bordered hover className='table_lotto w-50 m-auto'>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Numeri estratti</th>
                        <th>Jolly</th>
                        <th>Superstar</th>
                    </tr>
                </thead>
                <tbody>
                    {estrazioni.map((el:any) =>  {
                        return(
                            <tr key={`${el.data}`}>
                                <td>{el.data}</td>
                                <td>{el.numeri}</td>
                                <td>{el.jolly}</td>
                                <td>{el.superstar}</td>
                             </tr>
                        )
                        })}
                </tbody>
            </Table>
        </>
    );
}

export default Superenalotto;