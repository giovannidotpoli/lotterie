import Form from 'react-bootstrap/Form';

interface YearSelectorProps {
    end: number;
    selectDate:any;
  }

const YearSelector = ({end,selectDate}:YearSelectorProps) => {
    const thisYear = new Date().getFullYear();
    const arr = [];
    for(let y = thisYear; y >= end; y--) {
        arr.push(y);
    }
    return(
        <Form.Select aria-label="Default select example" onChange={selectDate} className='w-50 m-auto'>
            <option>Selezione l'anno di estrazione</option>
            {arr.map((y) => (
            <option value={y} key={y}>{y}</option>
            ))}
        </Form.Select>
    );

}

export default YearSelector;