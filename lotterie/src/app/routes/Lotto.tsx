import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectEstrazioniLotto, fetchData } from '../redux/lotterieSlice';
import { AppDispatch } from '../redux/store';
import Table from 'react-bootstrap/Table';
import YearSelector from '../components/YearSelector';
import { startLotto } from '../config';

const Lotto = () => {
    const dispatch = useDispatch<AppDispatch>();
    const estrazioni = useSelector(selectEstrazioniLotto);
    const thisYear = new Date().getFullYear();
    const [extr,setExtr] = useState([]);
    
    const selectDate = (evt:any) => {
        dispatch(fetchData({type:'lotto',year:String(evt.target.value)}));
    }

    useEffect(() => {
        dispatch(fetchData({type:'lotto',year: thisYear}));
    }, [thisYear,dispatch]);

    useEffect(() => {
        let prevConcorso = estrazioni[0]?.concorso;
        const arr:any = [];
        estrazioni.forEach((el:any) => {
            if(el.concorso !== prevConcorso) {
                arr.push({data:"",ruota: "",numeri:""})
            }
            arr.push(el);
            prevConcorso = el.concorso;
        });
        setExtr(arr);
    }, [estrazioni,thisYear,dispatch]);
 
    return (
        <>
            <YearSelector end={startLotto} selectDate={selectDate} />
            <Table striped bordered hover className='table_lotto w-50 m-auto'>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Ruota</th>
                        <th>Numeri estratti</th>
                    </tr>
                </thead>
                <tbody>
                    {extr.map((el:any,index:number) =>  {
                        return(
                            <tr key={`${el.data}${el.ruota}${index}`}>
                                <td>{el.data}</td>
                                <td>{el.ruota}</td>
                                <td>{el.numeri}</td>
                             </tr>
                        )
                        })}
                </tbody>
            </Table>
        </>
    );
}

export default Lotto;