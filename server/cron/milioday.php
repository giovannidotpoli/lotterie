<?php
header("Access-Control-Allow-Origin: {https://www.lottologia.com}");
header('Access-Control-Allow-Credentials: false');
header('Access-Control-Max-Age: 86400');  


class MilionDay {

    private $mysqli;

    public function __construct() {
        $this->mysqli = new mysqli("127.0.0.1","root","root","lotterie");

        $this->cleanTable();
        $arr = [
            2018,
            2019,
            2020,
            2021,
            2022,
            2023
        ];
        foreach($arr as $y) {
            $this->loop($y);
        }
    }

    public function loop($year) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://www.lottologia.com/millionday/archivio-estrazioni/?as=TXT&year='.$year);
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
        $this->mysqli->query("TRUNCATE TABLE milionday");
    }

    private function loopCsv($array) {
        foreach ($array as $key => $value) {
            if(!is_array($value)) {
                return;
            }
            $data_giocata = $value[0];
            $temp = explode("/",$data_giocata);
            $data_giocata = $temp[0];
            if(count($temp) > 1) {
                $orario = $temp[1];
            } else {
                $orario = "";
            }
            unset($value[0]);
            $this->writeRow($data_giocata,$orario,$value);
        }
    }



    private function writeRow($data_giocata,$orario,$numeri) {
        if(count($numeri) < 7) {
            return;
        }
        unset($numeri[6]);
        $extra = $numeri[7];

        if($extra) {
            $extra = str_replace("."," - ",$extra);
        }
        //$numeriTemp = array_splice($numeri,0,4);
        $num = [
            $numeri[1],
            $numeri[2],
            $numeri[3],
            $numeri[4],
            $numeri[5],
        ];
        sort($num);

        $numeri = implode(' - ', $num);
        $this->mysqli->query("INSERT IGNORE INTO milionday (data,orario,numeri,extra) VALUES ('$data_giocata','$orario','$numeri','$extra')");
    }

}


new MilionDay();

?>