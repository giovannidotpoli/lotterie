<?php
header("Access-Control-Allow-Origin: {https://www.lottologia.com}");
header('Access-Control-Allow-Credentials: false');
header('Access-Control-Max-Age: 86400');  


class MilionDay {

    private $mysqli;

    public function __construct() {
        $this->mysqli = new mysqli("127.0.0.1","root","root","lotterie");
        $this->cleanTable();
        for($i = 1997; $i <= date("Y"); $i++ ) {
            $this->loop($i);
        }
    }

    public function loop($year) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://www.lottologia.com/superenalotto/archivio-estrazioni/?as=TXT&year='.$year);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
        $txt = curl_exec($ch);
        curl_close($ch); 
        $txt = str_replace("Lottologia.com","",$txt);
        $content = explode("\n", $txt);
        array_splice($content, 0, 2);
        $txt = implode("\n", $content);
        $remove = "\n";
        $split = explode($remove, $txt);
        $array[] = NULL;
        $tab = "\t";
        foreach ($split as $string) {
            $row = explode($tab, $string);
            array_push($array,$row);
        }
        $array = array_reverse($array);
        $this->loopCsv($array);
    }

    private function cleanTable() {
        $this->mysqli->query("TRUNCATE TABLE superenalotto");
    }

    private function loopCsv($array) {
        foreach ($array as $key => $value) {
            if(!is_array($value)) {
                return;
            }
            $data_giocata = $value[0];
            unset($value[0]);
            $this->writeRow($data_giocata,$value);
        }
    }



    private function writeRow($data_giocata,$numeri) {
        if(!is_array($numeri) || count($numeri) < 6) {
            return;
        }
        if(count($numeri) === 6) {
            $jolly = "";
            $superstar = "";
        } else {
            $jolly = $numeri[8];
            $superstar = $numeri[9];
        }
       
        $num = [
            $numeri[1],
            $numeri[2],
            $numeri[3],
            $numeri[4],
            $numeri[5],
            $numeri[6],
        ];
        sort($num);

        $numeri = implode(' - ', $num);
        $this->mysqli->query("INSERT IGNORE INTO superenalotto (data,concorso,numeri,jolly,superstar) VALUES ('$data_giocata','0','$numeri','$jolly','$superstar')");
    }

}


new MilionDay();

?>