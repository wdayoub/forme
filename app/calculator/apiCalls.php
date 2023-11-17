<?php
if (isset($_POST['action'])) {
   $action = $_POST['action'];
   if ($action === 'callGetUltimatePrereqs') {
      $param = $_POST['param'];
      $result = callGetUltimatePrereqs($param);
      echo $result;
   } else {
      // Handle unknown action
      echo 'Unknown action: ' . $action;
   }
}
?>

<?php
   function callGetUltimatePrereqs($param) {
      return file_get_contents("https://cis3760f23-14.socs.uoguelph.ca/api/get_ultimate_prereqs?courseCodes:" . $param);
   }
?>
