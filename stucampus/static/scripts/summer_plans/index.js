;(function($,jQuery)
{

    function error_tip(msg)
    {
        swal(
            { title:"<small>"+msg+"</small>",text: "",type:"warning",timer: 3000,   showConfirmButton: true ,html: true}
                                        
        );
    }
    // 提示输入框
    function sweet_input(url)
    {
        swal(
        {   
            title: "记录进度",  
            text: "", 
            type: "input",   
            showCancelButton: true,
            closeOnConfirm: false,  
            animation: "slide-from-top",
            inputPlaceholder: "Write something"
        }, 
        function(inputValue){  
            if (inputValue === false) return false;   
            if (inputValue === "") {   
             swal.showInputError("不能为空!"); 
             return false  
            }

            $.ajax({
                type: "POST",
                url: url,
                data:{content:inputValue,"csrfmiddlewaretoken":$("#csrf_token input").val()},
                dataType: "json",
                success: function(data){
                    if(data.status=="success"){
                        swal(
                            { title:"<small>成功</small>",text: "",type:"success",timer: 3000,   showConfirmButton: true ,html:true},
                            function()
                            {
                                window.location=data.redirect_url;
                            }
                            );

                    }
                    else{
                        error_tip(data.messages);
                    }
                },
                error: function(data, status, e){
                    error_tip("出现错误，请联系qq：649743466");
                },
            }
            );
        });
    
     }
     //添加url参数工具函数
	function UrlUpdateParams(name, value) {
		var r = window.location.href;
		var url = window.location.href;
		if (r != null && r != 'undefined' && r != "") {
			value = encodeURIComponent(value);
			var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
			var tmp = name + "=" + value;
			if (url.match(reg) != null) {
				r = url.replace(eval(reg), tmp);
			}
			else {
				if (url.match("[\?]")) {
					r = url + "&" + tmp;
				} else {
					r = url + "?" + tmp;
				}
			}
		}
		return r;
	}
    // 删除提示，工具函数 start
    function delete_confirm(url){
        swal(
        {  
         title: "Are you sure?",  
         text: "是否确定删除？", 
         type: "warning",   
         showCancelButton: true,  
         confirmButtonColor: "#DD6B55",  
         confirmButtonText: "Yes",  
         cancelButtonText: "No",  
         closeOnConfirm: false,  
         closeOnCancel: true }, 
         function(isConfirm){  
            if (isConfirm) {
               $.ajax({
                            type: "GET",
                            url: url,
                            dataType: "json",
                            success: function(data){
                                if(data.status=="success"){
                                    swal(
                                        { title:"<small>删除成功</small>",text: "",type:"success",timer: 3000,   showConfirmButton: true ,html:true},
                                        function()
                                        {
                                            window.location=data.redirect_url;
                                        }
                                    );
                                    
                                }
                                else{
                                    error_tip(data.messages);
                                }
                                
                            },
                            error: function(data, status, e){
                                error_tip("出现错误，请联系qq：649743466");
                                console.log(data);
                            },
                        });     
           } 
       });
    }// 删除提示，工具函数 end

	// 窗口滑动加载 start
	var loadingStatus = false;
	$(window).scroll(function(){
            var scrollPos = jQuery(document).scrollTop(); //滚动条距离顶部的高度
            var windowHeight = jQuery(window).height(); //窗口的高度
            var dbHiht = jQuery(document).height(); //整个页面文件的高度
            var page_number =$(".page_number").last().text();
            if(dbHiht - windowHeight <= scrollPos && page_number!="没有更多了"){
            	if(loadingStatus==true){
            			return false;
            	}

            	loadingStatus=true;
            	getNextTimes = parseInt(page_number) + 1;
            	setTimeout(function(){

            	$.ajax({
            			type: "GET",
            			url: UrlUpdateParams("page",getNextTimes),
            			dataType: "html",
            			beforeSend: function(XMLHttpRequest){
            				$("#loading_plan_list").removeClass('visi_hide');
            			},
            			success: function(data){
            				$(".plan_list ul").append(data);
            			},
            			error: function(data, status, e){
                            error_tip("出现错误，请联系qq：649743466!!");
            			},
            			complete:function(XMLHttpRequest){
            				loadingStatus = false;
                            $("#loading_plan_list").addClass('visi_hide');
            			}
            		});
            	},100);
            }
            
        });
        // 窗口滑动加载 end
        // 发表计划 start
        $("#submit_plan_form").click(
        	function(){
        		var url=$("#submit_plan_form").data("url");
        		$.ajax({
            				type: "POST",
            				url: url,
            				data:$("#plan_form").serialize(),
            				dataType: "json",
            				success: function(data){
            					if(data.status=="success"){
                                    swal(
                                        { title:"<small>发表成功</small>",text: "",type:"success",timer: 3000,   showConfirmButton: true ,html:true},
                                        function()
                                        {
                                            jQuery('#form_modal').modal('hide');
                                            window.location=data.redirect_url;
                                        }
                                    );
                                    
            					}
            					else{
            						$("#plan_form_error").text(data.messages);
            					}
            				},
            				error: function(data, status, e){
                                error_tip("出现错误，请联系qq：649743466");
            				},
            				complete:function(XMLHttpRequest){
            					loadingStatus = false;
            					$(".loader3").removeClass('show').addClass('hide');
            				}
            			});
        	});
        // 发表计划 end

// 点赞功能 start
        $(".plan_list").delegate('.like_btn','click',function(){
        	var url = $(this).data('url');
        	var plan_id = $(this).data('plan_id')
        	$.ajax({
            				type: "GET",
            				url: url,
            				dataType: "json",
                            beforeSend:function(){
                                $("#like_loading"+plan_id).removeClass("visi_hide");
                            },
            				success: function(data){
            					if(data.status=="success"){
            						// 处理人名
            						if (data.like_persons.length==0){
            							$('#like_persons_wrapper'+plan_id).addClass('hide');//人数为空就隐藏
            						}
            						else
            						{
            							$('#like_persons_wrapper'+plan_id).removeClass('hide');
            							var like_person_str="";
            							var i=0;
            							for (i=0;i<data.like_persons.length-1;i++){
            								like_person_str+=data.like_persons[i].szu_name+",";
            							}
            							like_person_str+=data.like_persons[i].szu_name;
            							$("#like_persons"+plan_id).text(like_person_str);

            						}
            						//处理szu_no，判断是否点赞
            						var szu_no_str="";
            						for (var i=0;i<data.like_persons.length;i++){
            								szu_no_str+=data.like_persons[i].szu_no+",";

            							}
            						var user_id = $("#user_id").text()
            						if (szu_no_str.indexOf(user_id)>=0)
            						{
            							$("#liked_tip"+plan_id).removeClass("visi_hide");
            						}
            						else
            						{	
            							$("#liked_tip"+plan_id).addClass("visi_hide");
            						}
            						
            					}
            					else{
            						error_tip(data.messages);
            					}
            					
            				},
            				error: function(data, status, e){
                                error_tip("您需要登录才能点赞，如果登录完还不能点赞，请联系qq：649743466");
            				},
            				complete:function(XMLHttpRequest){
            					loadingStatus = false;
            					$("#like_loading"+plan_id).addClass('visi_hide');
            				}
            			});
        	
        });
        // 点赞功能 end

        // 发表感想 start
        $(".plan_list").delegate('.post_thought','click',function(){
        	var url = $(this).data('url');
        	$("#submit_thought_form").data("url",url);
        	jQuery('#thought_modal').modal('show');
        });

        $("#submit_thought_form").click(function(){
        	var url = $(this).data('url');
        	$.ajax({
            				type: "POST",
            				url: url,
            				dataType: "json",
            				data:$("#thought_form").serialize(),
            				success: function(data){
            					if(data.status=="success"){
            						swal(
                                        { title:"<small>发表成功</small>",text: "",type:"success",timer: 3000,   showConfirmButton: true ,html:true},
                                        function()
                                        {
                                            jQuery('#thought_modal').modal('hide');
                                            location.reload();
                                        }
                                    );
                                    
            					}
            					else{
            						error_tip(data.messages);
            					}
            					
            				},
            				error: function(data, status, e){
            					error_tip("出现错误，请联系qq：649743466");
            					console.log(data);
            				},
            			});
        });

        // 发表感想 end

        //匿名
        $("#id_is_anon").click(function(){
            if ($(this).prop("checked")){
                $("#alias_box").removeClass("visi_hide").focus();

            }
            else{
                $("#alias_box").addClass("visi_hide");
            }


        });

        //删除plan
        $(".plan_list").delegate('.delete_btn','click',function(){
            var url = $(this).data('url');
            delete_confirm(url);
        });

        //删除记录
        $(".plan_list").delegate('.delete_plan_record_btn','click',function(){
            var url = $(this).data('url');
            delete_confirm(url);
        });
        //添加记录
        $(".plan_list").delegate('.add_plan_record_btn','click',function(){
            var url = $(this).data('url');
            sweet_input(url);
        });
        //抽奖
        $("#draw_btn").click(function(){
            var url = $(this).data("url");
            $.ajax({
                            type: "GET",
                            url: url,
                            dataType: "json",
                            success: function(data){
                                if(data.status=="success"){
                                    swal(
                                        { title:"<small>抽奖成功</small>",text: "你的幸运值是"+data.lottery_result,type:"success",timer: 3000,   showConfirmButton: true ,html:true},
                                        function()
                                        {
                                            location.reload();
                                        }
                                    );
                                    
                                    
                                }
                                else{
                                    error_tip(data.messages);
                                }
                                
                            },
                            error: function(data, status, e){
                                error_tip("您需要登录才能抽奖，如果登录完还不能抽奖，请联系qq：649743466");
                            },
                            
                        });
        });
        

        

    })(Zepto,jQuery);