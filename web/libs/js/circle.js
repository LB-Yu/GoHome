$(function(){
	var flag=true;
    $("#nav").click(function(){
        if(flag){
            flag=false;
            $(this).css({
                transition:"transform 1s",
                webkitTransition:"transform 1s",
                oTransition:"transform 1s",
                msTransition:"transform 1s",
                mozTransition:"transform 1s",

                transform:"scale(1.2)",
                webkitTransform:"scale(1.2)",
                oTransform:"scale(1.2)",
                msTransform:"scale(1.2)",
                mozTransform:"scale(1.2)"
            });
            $("#out").css({
                transition:"right 1s, bottom 1s",
                webkitTransition:"right 1s, bottom 1s",
                oTransition:"right 1s, bottom 1s",
                msTransition:"right 1s, bottom 1s",
                mozTransition:"right 1s, bottom 1s",

                right:"-300px",
                bottom:"-300px"
            });
            $("#first").css({
                transition:"left 1.2s,top 1.2s",
                webkitTransition:"left 1.2s,top 1.2s",
                oTransition:"left 1.2s,top 1.2s",
                msTransition:"left 1.2s,top 1.2s",
                mozTransition:"left 1.2s,top 1.2s",

                left:"185px",
                top:"32px"
            });
            $("#second").css({
                transition:"left 1.5s,top 1.5s",
                webkitTransition:"left 1.5s,top 1.5s",
                oTransition:"left 1.5s,top 1.5s",
                msTransition:"left 1.5s,top 1.5s",
                mozTransition:"left 1.5s,top 1.5s",
                left:"91px",
                top:"95px"
            });
            $("#third").css({
                transition:"left 1.8s,top 1.8s",
                webkitTransition:"left 1.8s,top 1.8s",
                oTransition:"left 1.8s,top 1.8s",
                msTransition:"left 1.8s,top 1.8s",
                mozTransition:"left 1.8s,top 1.8s",
                left:"34px",
                top:"194px"
            });
        }else{
            flag=true;
            $(this).css({
                transition:"transform 1s",
                webkitTransition:"transform 1s",
                oTransition:"transform 1s",
                msTransition:"transform 1s",
                mozTransition:"transform 1s",

                transform:"scale(1)",
                webkitTransform:"scale(1)",
                oTransform:"scale(1)",
                mozTransition:"scale(1)",
                msTransform:"scale(1)"
            });
            $("#out").css({
                transition:"right 0.5s, bottom 0.5s",
                webkitTransition:"right 0.5s, bottom 0.5s",
                oTransition:"right 0.5s, bottom 0.5s",
                msTransition:"right 0.5s, bottom 0.5s",
                mozTransition:"right 0.5s, bottom 0.5s",

                right:"-450px",
                bottom:"-450px"
            });
            $("#first").css({
                transition:"left 1s,top 1s",
                webkitTransition:"left 1s,top 1s",
                oTransition:"left 1s,top 1s",
                msTransition:"left 1s,top 1s",
                mozTransition:"left 1s,top 1s",
                left:"100px",
                top:"100px"
            });
            $("#second").css({
                transition:"left 1s,top 1s",
                webkitTransition:"left 1s,top 1s",
                oTransition:"left 1s,top 1s",
                msTransition:"left 1s,top 1s",
                mozTransition:"left 1s,top 1s",
                left:"100px",
                top:"100px"
            });
            $("#third").css({
                transition:"left 1s,top 1s",
                webkitTransition:"left 1s,top 1s",
                oTransition:"left 1s,top 1s",
                msTransition:"left 1s,top 1s",
                mozTransition:"left 1s,top 1s",
                left:"100px",
                top:"100px"
            });/**/
        }
    });
})