<?php

class Lotto {

    private $mysqli;


    public function __construct() {
        $this->mysqli = new mysqli("127.0.0.1","root","root","lotterie");
        $this->mysqli->query("TRUNCATE TABLE lotto");
        $this->mysqli->query('SET SESSION MAX_EXECUTION_TIME = 9999999999'); 

        $open = fopen("http://lottoscar.altervista.org/Archivi/ArchivioLotto.csv", "r");
        $counter = 0;
        while (($data = fgetcsv($open, 1000, ";")) !== FALSE)  {
           
            $data_giocata = $data[0];
            $temp_data = explode("/",$data_giocata);
            if(count($temp_data) < 3) {
                continue;
            }
            $data_giocata = $temp_data[2]."-".$temp_data[1]."-".$temp_data[0];
            $concorso = $data[1];
            $counter++;
      
            foreach ($data as $key => $value) {
                if($key === 0 || $key === 1) {
                    continue;
                }
                $ruota = $this->getRuota($key);
                $this->writeRow($data_giocata,$concorso,$ruota,$value);
            }
        }
    }

    private function getRuota($index) {
        $ruote = [
            'Bari' => [2,3,4,5,6],
            'Cagliari' => [7,8,9,10,11],
            'Firenze' => [12,13,14,15,16],
            'Genova' => [17,18,19,20,21],
            'Milano' => [22,23,24,25,26],
            'Napoli' => [27,28,29,30,31],
            'Palermo' => [32,33,34,35,36],
            'Roma' => [37,38,39,40,41],
            'Torino' => [42,43,44,45,46],
            'Venezia' => [47,48,49,50,51],
            'Nazionale' => [52,53,54,55,56],
        ];

        foreach($ruote as $rt => $numeri) {
            if(in_array($index,$numeri))  {
                return $rt;
            }
        }

    }

    private function writeRow($data,$concorso,$ruota,$numero) {
        $this->mysqli->query("INSERT INTO lotto (data,concorso,ruota,numero) VALUES ('$data','$concorso','$ruota','$numero')");
    }




}


new Lotto();

?>