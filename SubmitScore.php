<?php

require_once("DBUtils.php");

//echo "_SERVER (DBUtils) = <br />";
//var_export($_SERVER);
//exit;

function SubmitScore()
	{
    $db = ConnectToDB('Fireball');

    if (isset($_GET['score']) && isset($_GET['initials']))
        {
        $score    = (int)$_GET['score'];
        $initials = strtoupper(mysqli_real_escape_string($db, substr($_GET['initials'], 0, 3)));

        $sqlQuery =  "INSERT INTO scores ";
        $sqlQuery .= "(initials,score)  ";
        $sqlQuery .= "VALUES (";
        $sqlQuery .= "'" . $initials . "', ";
        $sqlQuery .= $score;
        $sqlQuery .= ");";

//        echo "sqlQuery = ", $sqlQuery, "<br />";
        $result = $db->query($sqlQuery);
        DisplayMySQLErrors($db, $sqlQuery, $result, 'FALSE', __FILE__, __LINE__);
        $db->commit();
        }
    else
        {
        }
    }


SubmitScore();

?>
