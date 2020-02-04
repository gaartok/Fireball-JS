<?php

require_once("DBUtils.php");

header('Content-Type: text/xml');
header("Cache-Control: no-cache, must-revalidate");

function GetHighScores()
   {
   $db = ConnectToDB('Fireball');

   if (isset($_GET['maxRows']))
      {
      $maxRows = (int)$_GET['maxRows'];
      }
   else
      {
      $maxRows = 10;
      }

   echo '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
   echo '<HighScores>';

   $sqlQuery = "SELECT initials, score FROM scores ORDER BY score DESC LIMIT " . $maxRows;
   $result = $db->query($sqlQuery);
   if ($result)
      {
      echo '<Result>Success</Result>';
      while (($nextRow = $result->fetch_assoc()) != null)
         {
         echo '<NextScore>';
         echo '<initials>' . $nextRow['initials'] . '</initials>';
         echo '<score>' . $nextRow['score'] . '</score>';
         echo '</NextScore>';
         }
      }

   echo '</HighScores>';
   $db->close();
   }


GetHighScores();

?>
