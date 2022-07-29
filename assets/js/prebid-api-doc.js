<!--javascript to read querystring key apiDocTarget and use value to display proper content-->
<script type="text/javascript">
	
	$( document ).ready(function() {
		let apiDocTarget = urlParams.get('apiDocTarget');
		alert("linked script");
		alert(apiDocTarget);
		$("#apiDocumentation").html("test");
	});
	
</script>